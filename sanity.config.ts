import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';
import { visionTool } from '@sanity/vision';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u09gju27';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-29';

const singletonTypes = new Set(['siteSettings']);

export default defineConfig({
  name: 'default',
  title: 'Website CMS',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site settings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings')
              ),
            ...['blog', 'podcast', 'videos', 'books'].map((archive) =>
              S.listItem()
                .title(`Archive: ${archive}`)
                .id(`archive-${archive}`)
                .child(
                  S.documentList()
                    .title(`Archive settings for ${archive}`)
                    .apiVersion(apiVersion)
                    .filter('_type == "archivePageSettings" && archiveType == $archive')
                    .params({ archive })
                    .initialValueTemplates([
                      S.initialValueTemplateItem('archivePageSettings', {
                        params: { archiveType: archive },
                      }),
                    ])
                )
            ),
            S.divider(),
            S.documentTypeListItem('navigationMenu').title('Navigation menus'),
            S.documentTypeListItem('page'),
            S.documentTypeListItem('post'),
            S.documentTypeListItem('podcastEpisode'),
            S.documentTypeListItem('video'),
            S.documentTypeListItem('book'),
            S.divider(),
            S.documentTypeListItem('redirect').title('Redirects'),
            ...[
              S.documentTypeListItem('category'),
              S.documentTypeListItem('person'),
            ],
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Hide singletons from the "Create new document" menu.
    newDocumentOptions: (prev) => prev.filter((item) => !singletonTypes.has(item.templateId)),
    actions: (actions, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return actions.filter((action) => action.action !== 'delete' && action.action !== 'unpublish' && action.action !== 'duplicate');
      }
      return actions;
    },
  },
});
