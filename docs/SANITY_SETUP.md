# Sanity CMS Setup

This project includes a full Sanity-powered Page Builder for dynamic pages, blog posts, podcast episodes, videos, books, and global settings.

## 1. Create / connect a Sanity project

Create a Sanity project from the Sanity dashboard or CLI, then copy your project ID and dataset into `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-06-29
SANITY_API_READ_TOKEN=
```

The app uses safe placeholders (`yourprojectid`) so it can compile before real credentials are added.
Dynamic Sanity routes return empty static params until a real `NEXT_PUBLIC_SANITY_PROJECT_ID` is configured.

If your Sanity dataset is private, create a read token in Sanity Manage and set `SANITY_API_READ_TOKEN` in `.env.local` and in your deployment environment. The website fetches Sanity content on the server, so this token must **not** use the `NEXT_PUBLIC_` prefix.

## 2. Run the site and Studio

```bash
npm run dev
```

Open:

```text
http://localhost:3000/studio
```

## 2.1 Import the cloned homepage into Sanity

To avoid rebuilding the current homepage manually in Studio, use the seed script.

1. Create a write token in Sanity Manage:

```text
https://www.sanity.io/manage/project/YOUR_PROJECT_ID/api#tokens
```

Use an Editor token, then add it to `.env.local`:

```env
SANITY_API_WRITE_TOKEN=sk...
```

2. Run:

```bash
npm run sanity:seed
```

The script imports:

- Home page with slug `home`
- Homepage section structure
- Hero content and images
- Featured interviews / podcast episodes
- Recent episodes
- Recent blog posts
- Videos
- Books
- Logo clouds
- Site settings and logos

After it finishes, open `/studio` → `Page` → `Home` and edit the imported content visually.

## 3. Content architecture

### Documents

- `Page` — Dynamic pages with reorderable `sections[]`
- `Blog post` — Sanity-managed blog posts with Portable Text body
- `Podcast episode` — Episodes, guests, transcript, audio URL, external links
- `Video` — YouTube/video entries
- `Book` — Book cards and buy links
- `Person / Author / Guest` — Authors and podcast guests
- `Category` — Shared taxonomy
- `Site settings` — Global logo, navigation, footer, default SEO

### Section Builder

Each `Page` can use these sections:

- Hero section
- Rich text section
- Newsletter section
- Featured interviews section
- Recent episodes section
- Recent posts section
- Video grid section
- About section
- Logo cloud section
- Books section
- CTA section
- Cards section
- FAQ section
- Embed section
- Gallery section

### Rich Text features

Portable Text supports:

- H1-H4 headings
- Paragraphs
- Quotes
- Bullet and numbered lists
- External links
- Internal references
- Inline text color
- Inline font size
- Inline font family
- Images with alt/caption
- Buttons
- Callouts
- Embeds

## 4. Recommended first content

Create a `Page` with:

- Title: `Home`
- Slug: `home`
- Add sections matching the cloned homepage.

The homepage `/` is now connected to Sanity. To change homepage text, images, links, colors, and section order:

1. Open `/studio`
2. Go to `Page`
3. Create or edit the page with slug `home`
4. Edit the `Sections` array
5. Add/reorder sections like `Hero section`, `Rich text section`, `Recent posts section`, `Books section`, etc.
6. Publish the document

If Sanity is not configured yet, or if there is no published `home` page, `/` falls back to the static cloned homepage so the site still builds and displays correctly.

Dynamic internal pages work through `src/app/[slug]/page.tsx`.

## 5. Deployment

On Vercel, add the same environment variables under Project Settings → Environment Variables, then deploy as a normal Next.js project.
