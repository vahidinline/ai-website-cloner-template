# Content, SEO, and Deployment Roadmap

## Goal

Make the website fully content-driven through Sanity: no editorial copy, site
settings, SEO data, or content-page configuration may be hard-coded in the
Next.js application. A Sanity update must be visible on the live site without
a manual Netlify rebuild or redeploy.

## Current deployment diagnosis

This is not inherently a Netlify limitation. The current application statically
generates detail pages at build time via `generateStaticParams` and explicitly
disables unknown paths with `dynamicParams = false`. No revalidation interval,
Sanity webhook, or on-demand revalidation endpoint exists. Therefore Sanity
changes are only reflected by a new build/deploy.

Moving the same application to Cloudflare Pages would not fix this by itself:
the same static-generation rules would still serve build-time data. Keep
Netlify for this work unless there is a separate operational reason to migrate.

## Implementation order

### P0 — Security and configuration

- [ ] Revoke the Sanity API token currently committed in `src/sanity/env.ts`. **Manual:** the exposed token was removed from source; revoke it in Sanity before deployment.
- [ ] Create a new least-privilege server read token and expose it only as
  `SANITY_API_READ_TOKEN` in Netlify environment variables.
- [x] Remove all credentials and production defaults from source; add a
  complete `.env.example` without secrets.
- [ ] Ensure all server-only variables are never prefixed with `NEXT_PUBLIC_`.
- [x] Remove production debug logging (`console.log` / `console.dir`). (`src/app/page.tsx`, `src/components/SectionRenderer.tsx`, `src/components/portable-text/PortableTextRenderer.tsx`)

**Done when:** no credential is present in Git history going forward, local
setup is documented by `.env.example`, and no Sanity response is logged in
production.

### P0 — Create a single source of truth in Sanity

- [x] Extend singleton `siteSettings` with: site URL, default language and
  direction, site name, logo, favicon/icon set, default SEO, social profiles,
  robots configuration, header configuration, footer configuration, and
  person/organization structured-data fields.
- [ ] Add editorial validation and sensible field groups to the Sanity Studio.
- [x] Add a `sitePage`/`page` model that includes title, URL slug/path, SEO,
  status, sections, and optional page-template configuration.
- [x] Add a reusable `archivePageSettings` model for Blog, Podcast, Videos,
  and Books: title, eyebrow, introduction, empty-state copy, SEO, ordering,
  and pagination settings.
- [x] Move the home-page JSON-LD profile data into structured Sanity fields.

**Done when:** editors can change every public-facing site-level text and SEO
value from Studio without a code change.

### P0 — Remove hard-coded editorial content

- [ ] Replace hard-coded archive headings, eyebrow text, CTA labels,
  newsletter text, empty states, and fallback labels with Sanity fields.
- [ ] Remove the local logo fallback and all `href="#"` content fallbacks;
  render an editor-safe empty state only in preview/development where needed.
- [x] Replace the static profile schema object in `src/app/page.tsx` with data
  from `siteSettings`.
- [x] Retire or convert legacy static content in `HomepageSections.tsx` and
  `HeroSection.tsx`; no live code path may render editorial copy from them.
- [x] Centralize URL resolution for all internal references (`page`, `post`,
  `podcastEpisode`, `video`, and `book`) and use it in Header, Footer,
  Portable Text, and section buttons.

**Done when:** searching production application code shows no editorial copy,
hard-coded external profile links, or local content-image fallbacks.

### P0 — Dynamic pages and routing

- [x] Add a public catch-all page route for Sanity pages, while reserving
  application routes such as `/studio`, `/blog`, `/podcast`, `/videos`, and
  `/books`.
- [ ] Use the existing page query as the basis for a complete section query;
  return `notFound()` only when the Sanity page does not exist.
- [ ] Make every section renderer honor Sanity section settings and support
  all section types declared in the schema.
- [x] Remove duplicate home-page GROQ queries and use one typed data-access
  layer.
- [x] Generate metadata per page from Sanity with correct canonical, Open
  Graph, robots, and language values.

**Done when:** creating and publishing a page in Studio makes it available at
its configured URL and all page copy is rendered from Sanity.

### P1 — Publish updates without a manual deploy (Netlify)

- [ ] Decide the cache policy per route:
  - Site settings/header/footer: short ISR cache with tag `site-settings`.
  - Home and standard pages: ISR cache with tag `page:<id-or-slug>`.
  - Posts, episodes, videos, and books: ISR cache with content-specific tags.
- [x] Remove `dynamicParams = false` from public content routes unless there
  is an explicit, tested reason to keep it.
- [x] Add an authenticated `POST /api/revalidate` endpoint that validates a
  shared secret and calls `revalidateTag` / `revalidatePath` for changed
  documents.
- [ ] Configure a Sanity webhook for create, update, publish, unpublish, and
  delete events, sending the document type, ID, and slug to that endpoint.
- [ ] Handle global-settings changes by invalidating header, footer, metadata,
  favicon, robots, sitemap, and all relevant pages.
- [ ] Configure Netlify environment variables for the Sanity project, dataset,
  read token, webhook secret, and public site URL.
- [ ] Document a fallback operational path: Netlify Build Hook only for schema
  or global code changes, never as the normal editorial publishing workflow.

**Done when:** publishing an edited document in Sanity updates the matching
Netlify URL within the selected cache window; publishing a brand-new slug also
works without a redeploy.

### P1 — Favicon and site manifest management

- [x] Add Sanity fields for favicon SVG/ICO/PNG, Apple touch icon, Android
  icons, theme color, and optional manifest name.
- [x] Generate `Metadata.icons` from Sanity assets; remove fixed
  `/public/seo/favicon-*` references.
- [x] Add a dynamic `manifest.ts` driven by `siteSettings`.
- [ ] Revalidate favicon/manifest metadata when site settings are published.

**Done when:** an editor can upload replacement icons in Sanity and they are
served after the normal revalidation window.

### P1 — Redirect management

- [x] Add a `redirect` document type: source path, destination (internal
  reference or external URL), HTTP status (301/302/307/308), enabled flag,
  notes, and optional expiry date.
- [ ] Validate source paths, reject self-redirects, duplicate active sources,
  invalid destinations, and common redirect loops.
- [x] Implement redirects at the Next.js request layer with a cached Sanity
  query; invalidate the redirect cache through the same webhook.
- [ ] Add an optional import/export script for existing redirects and a Studio
  list view for active redirects.
- [ ] Test query strings, trailing slashes, disabled redirects, expiry, and
  each redirect status code.

**Done when:** a non-developer can create, publish, disable, and audit a
redirect in Studio without editing Netlify configuration.

### P1 — Robots and sitemap

- [x] Add dynamic `robots.ts` driven by the Sanity robots settings.
- [x] Add dynamic `sitemap.ts` for published pages, posts, episodes, videos,
  and books, excluding `noIndex` documents.
- [ ] Use each document's publish/update date and canonical URL consistently.
- [ ] Add tests for no-index handling and sitemap/robots output.

**Done when:** `/robots.txt` and `/sitemap.xml` accurately reflect published
Sanity content and site-level rules.

### P2 — Quality, performance, and verification

- [ ] Replace raw `<img>` usage with `next/image` where compatible and add
  Sanity CDN image remote patterns/configuration.
- [ ] Fix the remaining ESLint warnings in `scripts/download-assets.ts`.
- [ ] Add TypeScript types generated from/kept aligned with Sanity schemas;
  remove broad `unknown` / untyped section casting where possible.
- [ ] Add automated tests for URL resolution, redirect validation, metadata,
  revalidation authorization, and dynamic routing.
- [ ] Add an end-to-end publishing test: change a Sanity document, trigger the
  webhook, then assert the live/preview route receives updated content.
- [ ] Run CI with Node 24 as configured in `netlify.toml` and require
  `pnpm check` to pass.

**Done when:** CI passes cleanly and the editor publishing workflow is covered
by an automated integration test.

## Implementation evidence — 2026-08-23

- `pnpm typecheck` passed locally. `pnpm lint` completed with pre-existing raw-image warnings and three unused catch-variable warnings in `scripts/download-assets.ts`.
- `pnpm check` was started; the local shell is Node 21 while the project requires Node 24, so final CI verification must run under Netlify/Node 24.
- Netlify environment variables and the Sanity webhook are deployment configuration and must be configured by a project administrator; the expected variable names are in `.env.example`.

## Implementation evidence — 2026-08-24

- Added the `Navigation menu` document model with required labels, one valid
  internal or external destination per item, and an editor-friendly preview in
  `src/sanity/schemaTypes.ts`. It is available as **Navigation menus** in
  Studio and selected through **Site settings → Header & navigation**.
- `src/components/Header.tsx` now renders the selected menu dynamically. It
  retains the existing `mainNavigation` field as a content-only migration
  fallback until a navigation-menu document is assigned.
- `pnpm typecheck` passed locally (Node 22; the project still requires Node 24
  for the final CI check).

## Agent handoff rules

1. Do not introduce new hard-coded editorial content. Styling tokens and
   component structure are allowed in code; visitor-visible copy belongs in
   Sanity.
2. Do not expose tokens to the browser or commit them to Git.
3. Complete P0 before P1; revalidation relies on stable document models and
   route resolution.
4. After each task, run the smallest relevant tests and update this checklist
   with evidence (file links, test command, and result).
