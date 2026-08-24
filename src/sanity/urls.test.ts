import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { embedYouTubeUrl, resolveButtonUrl, resolveInternalUrl } from './urls';
import type { SanityButton } from './types';

describe('resolveInternalUrl', () => {
  it('maps each document type to its public path', () => {
    assert.equal(resolveInternalUrl({ _type: 'post', slug: { current: 'hello-world' } }), '/blog/hello-world');
    assert.equal(resolveInternalUrl({ _type: 'podcastEpisode', slug: { current: 'ep-1' } }), '/podcast/ep-1');
    assert.equal(resolveInternalUrl({ _type: 'video', slug: { current: 'v-1' } }), '/videos/v-1');
    assert.equal(resolveInternalUrl({ _type: 'book', slug: { current: 'b-1' } }), '/books/b-1');
  });

  it('resolves the home page to / and other pages to /slug', () => {
    assert.equal(resolveInternalUrl({ _type: 'page', slug: { current: 'home' } }), '/');
    assert.equal(resolveInternalUrl({ _type: 'page', slug: { current: 'about' } }), '/about');
  });

  it('returns undefined without a slug or unknown type', () => {
    assert.equal(resolveInternalUrl(undefined), undefined);
    assert.equal(resolveInternalUrl({ _type: 'page', slug: undefined }), undefined);
    assert.equal(resolveInternalUrl({ _type: 'category', slug: { current: 'x' } }), undefined);
  });
});

describe('resolveButtonUrl', () => {
  it('prefers the external URL over the internal reference', () => {
    const button = { url: 'https://example.com', internalLink: { _type: 'page', slug: { current: 'about' } } } as SanityButton;
    assert.equal(resolveButtonUrl(button), 'https://example.com');
  });

  it('falls back to the resolved internal link and returns undefined when neither exists', () => {
    assert.equal(resolveButtonUrl({ label: 'About', internalLink: { _type: 'page', slug: { current: 'about' } } }), '/about');
    assert.equal(resolveButtonUrl({ label: 'Dead' }), undefined);
  });
});

describe('embedYouTubeUrl', () => {
  it('converts watch, youtu.be and shorts URLs to nocookie embeds', () => {
    assert.equal(embedYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    assert.equal(embedYouTubeUrl('https://youtu.be/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    assert.equal(embedYouTubeUrl('https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=30s'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    assert.equal(embedYouTubeUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('passes through existing /embed/ URLs and rejects non-YouTube URLs', () => {
    assert.equal(embedYouTubeUrl('https://www.youtube.com/embed/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    assert.equal(embedYouTubeUrl('https://vimeo.com/12345'), undefined);
    assert.equal(embedYouTubeUrl('not a url'), undefined);
  });
});
