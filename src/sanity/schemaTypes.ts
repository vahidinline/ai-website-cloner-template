import { defineArrayMember, defineField, defineType } from 'sanity';

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
      name: 'noIndex',
      title: 'No index',
      type: 'boolean',
      initialValue: false,
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
    defineField({ name: 'icon', title: 'Icon name', type: 'string' }),
  ],
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
      title: 'Episodes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'podcastEpisode' }],
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
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
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

const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', title: 'Site title', type: 'string' }),
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
    defineField({ name: 'footerCta', title: 'Footer CTA', type: 'ctaSection' }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo' }),
  ],
});

export const schemaTypes = [
  seo,
  button,
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
  siteSettings,
];
