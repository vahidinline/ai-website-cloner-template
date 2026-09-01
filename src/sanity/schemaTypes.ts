import { defineArrayMember, defineField, defineType } from 'sanity';
import { validateRedirectSource } from '../lib/redirect-validation';

const alignmentOptions = [
  { title: 'Left', value: 'left' },
  { title: 'Center', value: 'center' },
  { title: 'Right', value: 'right' },
];

const themeOptions = [
  { title: 'Default', value: 'default' },
  { title: 'Light', value: 'light' },
  { title: 'Dark', value: 'dark' },
  { title: 'Brand', value: 'brand' },
  { title: 'Custom', value: 'custom' },
];

const colorTokenOptions = [
  { title: 'Default', value: 'default' },
  { title: 'Primary', value: 'primary' },
  { title: 'Secondary', value: 'secondary' },
  { title: 'Accent', value: 'accent' },
  { title: 'Muted', value: 'muted' },
  { title: 'Dark', value: 'dark' },
  { title: 'Light', value: 'light' },
  { title: 'Custom', value: 'custom' },
];

const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta title', type: 'string' }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'imageWithAlt',
    }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
    defineField({
      name: 'languageAlternates',
      title: 'Language alternates (hreflang)',
      description: 'Add the matching page on the other language site. Each site must list the other site back.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'language', title: 'Language code', type: 'string', description: 'For example: en or fa-IR', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'Alternate page URL', type: 'url', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'language', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'isProfilePage',
      title: 'This is the person profile page',
      description: 'Enable only on the primary About page. It adds a ProfilePage connected to the site-wide Person entity.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'noIndex',
      title: 'No index',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});

const structuredData = defineType({
  name: 'structuredData',
  title: 'Person structured data',
  type: 'object',
  fields: [
    defineField({ name: 'type', title: 'Entity type', type: 'string', options: { list: ['Person', 'Organization'] }, initialValue: 'Person', validation: (Rule) => Rule.required() }),
    defineField({ name: 'id', title: 'Stable entity ID (@id)', type: 'url', description: 'Use one identical, permanent URL on both language sites, for example https://souzangar.com/#person.', validation: (Rule) => Rule.required() }),
    defineField({ name: 'name', title: 'Primary name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alternateName', title: 'Alternate names', type: 'array', of: [defineArrayMember({ type: 'string' })], description: 'For example: سعید سوزنگر.' }),
    defineField({ name: 'url', title: 'Primary website URL', type: 'url', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'jobTitle', title: 'Professional title', type: 'string' }),
    defineField({ name: 'image', title: 'Portrait image', type: 'imageWithAlt', description: 'Published as an ImageObject, including image dimensions when available.' }),
    defineField({ name: 'sameAs', title: 'Verified profiles (sameAs)', type: 'array', of: [defineArrayMember({ type: 'url' })], description: 'Add only profiles that belong to this exact person.' }),
    defineField({
      name: 'subjectOf',
      title: 'Independent coverage (subjectOf)',
      type: 'array',
      description: 'Use original reporting URLs, not summaries hosted on this site.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'type', title: 'Schema type', type: 'string', options: { list: ['NewsArticle', 'Article', 'PodcastEpisode', 'VideoObject'] }, initialValue: 'NewsArticle', validation: (Rule) => Rule.required() }),
            defineField({ name: 'headline', title: 'Headline', type: 'string' }),
            defineField({ name: 'url', title: 'Original source URL', type: 'url', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'headline', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'organizations',
      title: 'Organizations and projects',
      type: 'array',
      description: 'Add only organizations or projects the person is genuinely affiliated with.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'Official URL', type: 'url' }),
            defineField({ name: 'sameAs', title: 'Verified profile URLs', type: 'array', of: [defineArrayMember({ type: 'url' })] }),
          ],
          preview: { select: { title: 'name', subtitle: 'url' } },
        }),
      ],
    }),
  ],
});

const button = defineType({
  name: 'button',
  title: 'Button / Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'url', title: 'External URL', type: 'url' }),
    defineField({
      name: 'internalLink',
      title: 'Internal link',
      type: 'reference',
      to: [
        { type: 'page' },
        { type: 'post' },
        { type: 'podcastEpisode' },
        { type: 'video' },
        { type: 'book' },
      ],
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
          { title: 'Link', value: 'link' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'For footer social links, choose the matching platform icon.',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Telegram', value: 'telegram' },
          { title: 'X', value: 'x' },
          { title: 'YouTube', value: 'youtube' },
          { title: 'Instagram', value: 'instagram' },
        ],
      },
    }),
  ],
});

const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required().error('A navigation label is required.') }),
    defineField({ name: 'url', title: 'External URL', type: 'url', validation: (Rule) => Rule.custom((url, context) => {
      const parent = context.parent as { internalLink?: unknown } | undefined;
      const internalLink = parent?.internalLink;
      if (!url && !internalLink) return 'Choose an internal page or enter an external URL.';
      if (url && internalLink) return 'Use either an internal page or an external URL, not both.';
      return true;
    }) }),
    defineField({ name: 'internalLink', title: 'Internal destination', type: 'reference', to: [{ type: 'page' }, { type: 'post' }, { type: 'podcastEpisode' }, { type: 'video' }, { type: 'book' }], validation: (Rule) => Rule.custom((internalLink, context) => {
      const parent = context.parent as { url?: unknown } | undefined;
      const url = parent?.url;
      if (!internalLink && !url) return 'Choose an internal page or enter an external URL.';
      if (internalLink && url) return 'Use either an internal page or an external URL, not both.';
      return true;
    }) }),
    defineField({ name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'label', external: 'url', internal: 'internalLink.slug.current' },
    prepare: ({ title, external, internal }) => ({ title, subtitle: external || (internal ? `/${internal}` : 'No destination selected') }),
  },
});

const navigationMenu = defineType({
  name: 'navigationMenu',
  title: 'Navigation menu',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Menu name', description: 'For editors only; this is not shown on the website.', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'items', title: 'Menu items', type: 'array', of: [defineArrayMember({ type: 'navigationItem' })], validation: (Rule) => Rule.min(1) }),
  ],
  preview: {
    select: { title: 'title', items: 'items' },
    prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} item${items?.length === 1 ? '' : 's'}` }),
  },
});

const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({ name: 'link', title: 'Link', type: 'url' }),
    defineField({
      name: 'objectFit',
      title: 'Object fit',
      type: 'string',
      options: {
        list: [
          { title: 'Cover', value: 'cover' },
          { title: 'Contain', value: 'contain' },
          { title: 'Fill', value: 'fill' },
        ],
      },
      initialValue: 'cover',
    }),
  ],
});

const typographySettings = defineType({
  name: 'typographySettings',
  title: 'Typography settings',
  type: 'object',
  fields: [
    defineField({ name: 'fontFamily', title: 'Font family', type: 'string' }),
    defineField({ name: 'headingSize', title: 'Heading size', type: 'string' }),
    defineField({ name: 'bodySize', title: 'Body size', type: 'string' }),
    defineField({ name: 'lineHeight', title: 'Line height', type: 'string' }),
    defineField({
      name: 'letterSpacing',
      title: 'Letter spacing',
      type: 'string',
    }),
    defineField({ name: 'fontWeight', title: 'Font weight', type: 'string' }),
    defineField({
      name: 'textTransform',
      title: 'Text transform',
      type: 'string',
    }),
  ],
});

const sectionSettings = defineType({
  name: 'sectionSettings',
  title: 'Section settings',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'HTML section ID / anchor',
      type: 'string',
    }),
    defineField({ name: 'anchorLabel', title: 'Anchor label', type: 'string' }),
    defineField({
      name: 'isHidden',
      title: 'Hide section',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: { list: themeOptions },
      initialValue: 'default',
    }),
    defineField({
      name: 'backgroundColorToken',
      title: 'Background color token',
      type: 'string',
      options: { list: colorTokenOptions },
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Custom background color',
      type: 'string',
    }),
    defineField({
      name: 'textColorToken',
      title: 'Text color token',
      type: 'string',
      options: { list: colorTokenOptions },
    }),
    defineField({
      name: 'textColor',
      title: 'Custom text color',
      type: 'string',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'overlayColor',
      title: 'Overlay color',
      type: 'string',
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Overlay opacity 0-100',
      type: 'number',
    }),
    defineField({ name: 'paddingTop', title: 'Padding top', type: 'string' }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding bottom',
      type: 'string',
    }),
    defineField({ name: 'marginTop', title: 'Margin top', type: 'string' }),
    defineField({
      name: 'marginBottom',
      title: 'Margin bottom',
      type: 'string',
    }),
    defineField({
      name: 'containerWidth',
      title: 'Container width',
      type: 'string',
    }),
    defineField({
      name: 'customClassName',
      title: 'Custom CSS class',
      type: 'string',
    }),
    defineField({
      name: 'typography',
      title: 'Typography',
      type: 'typographySettings',
    }),
  ],
});

const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: { list: ['info', 'success', 'warning', 'danger', 'neutral'] },
    }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text' }),
  ],
});

const embed = defineType({
  name: 'embed',
  title: 'Embed',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
    defineField({ name: 'embedCode', title: 'Embed code', type: 'text' }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect ratio',
      type: 'string',
      initialValue: '16/9',
    }),
  ],
});

const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'External link',
            type: 'object',
            fields: [
              defineField({ name: 'href', title: 'URL', type: 'url' }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
              }),
            ],
          }),
          defineArrayMember({
            name: 'internalLink',
            title: 'Internal link',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                title: 'Reference',
                type: 'reference',
                to: [
                  { type: 'page' },
                  { type: 'post' },
                  { type: 'podcastEpisode' },
                  { type: 'video' },
                  { type: 'book' },
                ],
              }),
            ],
          }),
          defineArrayMember({
            name: 'textColor',
            title: 'Text color',
            type: 'object',
            fields: [
              defineField({ name: 'color', title: 'Color', type: 'string' }),
            ],
          }),
          defineArrayMember({
            name: 'fontSize',
            title: 'Font size',
            type: 'object',
            fields: [
              defineField({ name: 'size', title: 'Size', type: 'string' }),
            ],
          }),
          defineArrayMember({
            name: 'fontFamily',
            title: 'Font family',
            type: 'object',
            fields: [
              defineField({ name: 'family', title: 'Family', type: 'string' }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
    defineArrayMember({ type: 'button' }),
    defineArrayMember({ type: 'callout' }),
    defineArrayMember({ type: 'embed' }),
  ],
});

const statItem = defineType({
  name: 'statItem',
  title: 'Stat item',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string' }),
    defineField({ name: 'label', title: 'Label', type: 'string' }),
  ],
});

const logoItem = defineType({
  name: 'logoItem',
  title: 'Logo item',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'image', title: 'Logo', type: 'imageWithAlt' }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
  ],
});

const cardItem = defineType({
  name: 'cardItem',
  title: 'Card item',
  type: 'object',
  fields: [
    defineField({ name: 'icon', title: 'Icon name', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'link', title: 'Link', type: 'button' }),
  ],
});

const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({ name: 'answer', title: 'Answer', type: 'richText' }),
  ],
});

const buyLink = defineType({
  name: 'buyLink',
  title: 'Buy link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
  ],
});

const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer column',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Column title', type: 'string' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
  ],
});

const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer settings',
  type: 'object',
  fields: [
    defineField({ name: 'enabled', title: 'Show footer', type: 'boolean', initialValue: true }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt' }),
    defineField({ name: 'copyright', title: 'Copyright', type: 'string' }),
    defineField({
      name: 'columns',
      title: 'Navigation columns',
      type: 'array',
      of: [defineArrayMember({ type: 'footerColumn' })],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
    defineField({ name: 'affiliateDisclosure', title: 'Affiliate disclosure', type: 'text', rows: 3 }),
  ],
});

function sectionBaseFields() {
  return [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
    defineField({
      name: 'settings',
      title: 'Section settings',
      type: 'sectionSettings',
    }),
  ];
}

const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: ['split', 'centered', 'backgroundImage', 'bookPromo', 'minimal'],
      },
      initialValue: 'split',
    }),
    ...sectionBaseFields(),
    defineField({
      name: 'headingLevel',
      title: 'Title heading level',
      type: 'string',
      options: {
        list: [
          { title: 'H1', value: 'h1' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
        ],
        layout: 'radio',
      },
      initialValue: 'h1',
    }),
    defineField({ name: 'richText', title: 'Rich text', type: 'richText' }),
    defineField({
      name: 'primaryButton',
      title: 'Primary button',
      type: 'button',
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Secondary button',
      type: 'button',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'foregroundImage',
      title: 'Foreground image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: { list: alignmentOptions },
      initialValue: 'left',
    }),
    defineField({ name: 'height', title: 'Height', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'variant' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Hero section',
      subtitle,
    }),
  },
});

const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({ name: 'content', title: 'Content', type: 'richText' }),
    defineField({ name: 'maxWidth', title: 'Max width', type: 'string' }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: { list: alignmentOptions },
    }),
  ],
});

const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Newsletter section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({ name: 'richText', title: 'Rich text', type: 'richText' }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({
      name: 'formProvider',
      title: 'Form provider',
      type: 'string',
      options: { list: ['custom', 'mailchimp', 'convertkit', 'hubspot'] },
      initialValue: 'custom',
    }),
    defineField({
      name: 'emailPlaceholder',
      title: 'Email placeholder',
      type: 'string',
      initialValue: 'Your Email Address',
    }),
    defineField({ name: 'buttonLabel', title: 'Button label', type: 'string' }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
    }),
    defineField({
      name: 'privacyText',
      title: 'Privacy text',
      type: 'richText',
    }),
  ],
});

const featuredInterviewsSection = defineType({
  name: 'featuredInterviewsSection',
  title: 'Featured interviews section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'episodes',
      title: 'Featured content',
      description: 'Select the existing content that should appear as cards in this section. Each card links to the selected item automatically.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [
            { type: 'page' },
            { type: 'post' },
            { type: 'podcastEpisode' },
            { type: 'video' },
            { type: 'book' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['grid', 'slider', 'list'] },
      initialValue: 'grid',
    }),
    defineField({
      name: 'itemsPerRow',
      title: 'Items per row',
      type: 'number',
    }),
    defineField({
      name: 'showImage',
      title: 'Show image',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showExcerpt',
      title: 'Show excerpt',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showPlayButton',
      title: 'Show play button',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'button' }),
  ],
});

const recentEpisodesSection = defineType({
  name: 'recentEpisodesSection',
  title: 'Recent episodes section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: { list: ['latest', 'manual', 'category'] },
      initialValue: 'latest',
    }),
    defineField({
      name: 'episodes',
      title: 'Manual episodes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'podcastEpisode' }],
        }),
      ],
    }),
    defineField({
      name: 'limit',
      title: 'Limit',
      type: 'number',
      initialValue: 3,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['cards', 'list', 'featured'] },
      initialValue: 'cards',
    }),
  ],
});

const recentPostsSection = defineType({
  name: 'recentPostsSection',
  title: 'Recent posts section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      options: { list: ['latest', 'manual', 'category'] },
      initialValue: 'latest',
    }),
    defineField({
      name: 'posts',
      title: 'Manual posts',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'limit',
      title: 'Limit',
      type: 'number',
      initialValue: 3,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['cards', 'list', 'featured'] },
      initialValue: 'cards',
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'button' }),
  ],
});

const videoGridSection = defineType({
  name: 'videoGridSection',
  title: 'Video grid section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'video' }] })],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['grid', 'slider', 'featured'] },
      initialValue: 'grid',
    }),
    defineField({
      name: 'showPlayOverlay',
      title: 'Show play overlay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'button' }),
  ],
});

const aboutSection = defineType({
  name: 'aboutSection',
  title: 'About section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({ name: 'richText', title: 'Rich text', type: 'richText' }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [defineArrayMember({ type: 'statItem' })],
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [defineArrayMember({ type: 'logoItem' })],
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'button' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['imageLeft', 'imageRight', 'centered'] },
    }),
  ],
});

const logoCloudSection = defineType({
  name: 'logoCloudSection',
  title: 'Logo cloud section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [defineArrayMember({ type: 'logoItem' })],
    }),
    defineField({ name: 'columns', title: 'Columns', type: 'number' }),
  ],
});

const booksSection = defineType({
  name: 'booksSection',
  title: 'Books section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'books',
      title: 'Books',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'book' }] })],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['grid', 'slider', 'featured'] },
      initialValue: 'grid',
    }),
    defineField({
      name: 'showDescription',
      title: 'Show description',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showBuyButton',
      title: 'Show buy button',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'cta', title: 'CTA', type: 'button' }),
  ],
});

const ctaSection = defineType({
  name: 'ctaSection',
  title: 'CTA section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({ name: 'richText', title: 'Rich text', type: 'richText' }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['centered', 'split', 'banner'] },
    }),
  ],
});

const cardsSection = defineType({
  name: 'cardsSection',
  title: 'Cards section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [defineArrayMember({ type: 'cardItem' })],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['grid', 'slider', 'list'] },
    }),
    defineField({ name: 'columns', title: 'Columns', type: 'number' }),
  ],
});

const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['accordion', 'twoColumn'] },
    }),
  ],
});

const embedSection = defineType({
  name: 'embedSection',
  title: 'Embed section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({ name: 'embed', title: 'Embed', type: 'embed' }),
  ],
});

const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Gallery section',
  type: 'object',
  fields: [
    ...sectionBaseFields(),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['grid', 'masonry', 'slider'] },
    }),
    defineField({
      name: 'lightboxEnabled',
      title: 'Lightbox enabled',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});

const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
});

const person = defineType({
  name: 'person',
  title: 'Person / Author / Guest',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    }),
    defineField({ name: 'portrait', title: 'Portrait', type: 'imageWithAlt' }),
    defineField({ name: 'bio', title: 'Bio', type: 'richText' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
  ],
});

const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'person' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({ type: 'reference', to: [{ type: 'category' }] }),
      ],
    }),
    defineField({ name: 'body', title: 'Body', type: 'richText' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
});

const podcastEpisode = defineType({
  name: 'podcastEpisode',
  title: 'Podcast episode',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode number',
      type: 'number',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 4 }),
    defineField({ name: 'body', title: 'Show notes / Body', type: 'richText' }),
    defineField({ name: 'transcriptTitle', title: 'Transcript heading', type: 'string' }),
    defineField({ name: 'transcript', title: 'Transcript', type: 'richText' }),
    defineField({ name: 'audioUrl', title: 'Audio URL', type: 'url' }),
    defineField({
      name: 'externalLinks',
      title: 'External links',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
    defineField({
      name: 'guests',
      title: 'Guests',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }] })],
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
});

const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'imageWithAlt',
    }),
    defineField({ name: 'youtubeUrl', title: 'YouTube URL', type: 'url' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({ type: 'reference', to: [{ type: 'category' }] }),
      ],
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
});

const book = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'richText',
    }),
    defineField({
      name: 'buyLinks',
      title: 'Buy links',
      type: 'array',
      of: [defineArrayMember({ type: 'buyLink' })],
    }),
    defineField({ name: 'order', title: 'Order', type: 'number' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
});

const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['draft', 'published'] }, initialValue: 'published' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'newsletterSection' }),
        defineArrayMember({ type: 'featuredInterviewsSection' }),
        defineArrayMember({ type: 'recentEpisodesSection' }),
        defineArrayMember({ type: 'recentPostsSection' }),
        defineArrayMember({ type: 'videoGridSection' }),
        defineArrayMember({ type: 'aboutSection' }),
        defineArrayMember({ type: 'logoCloudSection' }),
        defineArrayMember({ type: 'booksSection' }),
        defineArrayMember({ type: 'ctaSection' }),
        defineArrayMember({ type: 'cardsSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'embedSection' }),
        defineArrayMember({ type: 'gallerySection' }),
      ],
    }),
  ],
});

const archivePageSettings = defineType({
  name: 'archivePageSettings', title: 'Archive page settings', type: 'document',
  fields: [
    defineField({ name: 'archiveType', title: 'Archive', type: 'string', options: { list: [
      { title: 'Blog', value: 'blog' }, { title: 'Podcast', value: 'podcast' }, { title: 'Videos', value: 'videos' }, { title: 'Books', value: 'books' },
    ] }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'introduction', title: 'Introduction', type: 'text', rows: 3 }),
    defineField({ name: 'emptyState', title: 'Empty state', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'ordering', title: 'Ordering', type: 'string', options: { list: ['publishedAtDesc', 'publishedAtAsc', 'titleAsc', 'manual'] }, initialValue: 'publishedAtDesc' }),
    defineField({ name: 'itemsPerPage', title: 'Items per page', type: 'number', validation: (Rule) => Rule.min(1).max(100), initialValue: 12 }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
});

const redirect = defineType({
  name: 'redirect', title: 'Redirect', type: 'document',
  fields: [
    defineField({
      name: 'sourcePath', title: 'Source path', type: 'string',
      description: 'Must start with a single /, e.g. /old-page. A pasted query string or fragment is ignored when matching.',
      validation: (Rule) => Rule.required().custom((value) => {
        const result = validateRedirectSource(String(value ?? ''));
        return result.ok ? true : result.message;
      }),
    }),
    defineField({ name: 'destinationUrl', title: 'External destination', type: 'url', hidden: ({ parent }) => parent?.statusCode === 410 }),
    defineField({ name: 'destinationInternal', title: 'Internal destination', type: 'reference', to: [{ type: 'page' }, { type: 'post' }, { type: 'podcastEpisode' }, { type: 'video' }, { type: 'book' }], hidden: ({ parent }) => parent?.statusCode === 410 }),
    defineField({
      name: 'statusCode', title: 'Status code', type: 'number', options: { list: [
        { title: '301 — Permanent redirect', value: 301 },
        { title: '302 — Temporary redirect', value: 302 },
        { title: '307 — Temporary redirect (method preserved)', value: 307 },
        { title: '308 — Permanent redirect (method preserved)', value: 308 },
        { title: '410 — Page removed (Gone)', value: 410 },
      ] }, initialValue: 301,
      // The select list is the Studio-side constraint. `Rule.valid()` is not
      // reliable for numeric option values in the installed Sanity version.
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: true }),
    defineField({ name: 'expiresAt', title: 'Expiry', type: 'datetime' }),
    defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { source: 'sourcePath', external: 'destinationUrl', internal: 'destinationInternal', status: 'statusCode', enabled: 'enabled' },
    prepare: ({ source, external, internal, status, enabled }) => ({
      title: `${enabled === false ? '[disabled] ' : ''}${source}`,
      subtitle: `${status || 301} → ${external || internal?.slug?.current || '(no destination)'}`,
    }),
  },
});

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', title: 'Site name', type: 'string', group: 'identity', validation: (Rule) => Rule.required() }),
    defineField({ name: 'siteUrl', title: 'Site URL', type: 'url', group: 'identity' }),
    defineField({ name: 'defaultLanguage', title: 'Default language', type: 'string', group: 'identity', initialValue: 'en' }),
    defineField({ name: 'direction', title: 'Text direction', type: 'string', group: 'identity', options: { list: ['ltr', 'rtl'] }, initialValue: 'ltr' }),
    defineField({ name: 'footer', title: 'Footer', type: 'footerSettings' }),
    defineField({ name: 'header', title: 'Header', type: 'object', group: 'header', fields: [
      defineField({ name: 'enabled', title: 'Show header', type: 'boolean', initialValue: true }),
      defineField({ name: 'navigationMenu', title: 'Navigation menu', type: 'reference', to: [{ type: 'navigationMenu' }] }),
      defineField({ name: 'searchLabel', title: 'Search button label', type: 'string' }),
      defineField({ name: 'action', title: 'Header action', type: 'button' }),
    ] }),
    defineField({
      name: 'logoLight',
      title: 'Logo light',
      type: 'imageWithAlt',
    }),
    defineField({ name: 'logoDark', title: 'Logo dark', type: 'imageWithAlt' }),
    defineField({
      name: 'mainNavigation',
      title: 'Main navigation',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
    defineField({
      name: 'footerNavigation',
      title: 'Footer navigation',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({ type: 'button' })],
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Footer copyright',
      type: 'string',
      initialValue: 'Copyright © 2007–2026 Saeed Souzangar. All rights reserved.',
    }),
    defineField({
      name: 'affiliateDisclosure',
      title: 'Affiliate disclosure',
      type: 'text',
      rows: 3,
    }),
    defineField({ name: 'footerCta', title: 'Footer CTA', type: 'ctaSection' }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo' }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'imageWithAlt', group: 'icons' }),
    defineField({ name: 'appleTouchIcon', title: 'Apple touch icon', type: 'imageWithAlt', group: 'icons' }),
    defineField({ name: 'androidIcons', title: 'Android icons', type: 'array', of: [defineArrayMember({ type: 'imageWithAlt' })], group: 'icons' }),
    defineField({ name: 'themeColor', title: 'Theme color', type: 'string', group: 'icons' }),
    defineField({ name: 'manifestName', title: 'Manifest name', type: 'string', group: 'icons' }),
    defineField({ name: 'robots', title: 'Robots', type: 'object', group: 'seo', fields: [defineField({ name: 'allowIndexing', title: 'Allow indexing', type: 'boolean', initialValue: true }), defineField({ name: 'disallowPaths', title: 'Disallow paths', type: 'array', of: [defineArrayMember({ type: 'string' })] }), defineField({ name: 'sitemapEnabled', title: 'Include sitemap', type: 'boolean', initialValue: true })] }),
    defineField({ name: 'structuredData', title: 'Structured data', type: 'structuredData', group: 'structuredData' }),
  ],
  groups: [{ name: 'identity', title: 'Identity' }, { name: 'header', title: 'Header & navigation' }, { name: 'seo', title: 'SEO' }, { name: 'icons', title: 'Icons & manifest' }, { name: 'structuredData', title: 'Structured data' }],
});

export const schemaTypes = [
  seo,
  structuredData,
  button,
  navigationItem,
  navigationMenu,
  imageWithAlt,
  typographySettings,
  sectionSettings,
  callout,
  embed,
  richText,
  statItem,
  logoItem,
  cardItem,
  faqItem,
  buyLink,
  footerColumn,
  footerSettings,
  heroSection,
  richTextSection,
  newsletterSection,
  featuredInterviewsSection,
  recentEpisodesSection,
  recentPostsSection,
  videoGridSection,
  aboutSection,
  logoCloudSection,
  booksSection,
  ctaSection,
  cardsSection,
  faqSection,
  embedSection,
  gallerySection,
  category,
  person,
  post,
  podcastEpisode,
  video,
  book,
  page,
  archivePageSettings,
  redirect,
  siteSettings,
];
