import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemapEntries } from './sitemap-entries';

const base = 'https://example.com';

describe('sitemap entries builder', () => {
  it('maps each document type to its public path', () => {
    const entries = buildSitemapEntries(
      [
        { _type: 'page', slug: 'about' },
        { _type: 'post', slug: 'hello' },
        { _type: 'podcastEpisode', slug: 'ep1' },
        { _type: 'video', slug: 'v1' },
        { _type: 'book', slug: 'b1' },
      ],
      base
    );
    assert.deepEqual(
      entries.map((entry) => entry.url),
      [
        'https://example.com/about',
        'https://example.com/blog/hello',
        'https://example.com/podcast/ep1',
        'https://example.com/videos/v1',
        'https://example.com/books/b1',
      ]
    );
  });

  it('maps the home page to the root URL', () => {
    const entries = buildSitemapEntries([{ _type: 'page', slug: 'home' }], base);
    assert.equal(entries[0]?.url, 'https://example.com/');
  });

  it('prefers the publish date over the update date', () => {
    const entries = buildSitemapEntries(
      [{ _type: 'post', slug: 'hello', publishedAt: '2026-01-01T00:00:00.000Z', _updatedAt: '2026-02-01T00:00:00.000Z' }],
      base
    );
    assert.equal((entries[0]?.lastModified as Date)?.toISOString(), '2026-01-01T00:00:00.000Z');
  });

  it('falls back to the update date and omits lastModified when neither exists', () => {
    const withUpdate = buildSitemapEntries([{ _type: 'post', slug: 'a', _updatedAt: '2026-03-05T00:00:00.000Z' }], base);
    assert.equal((withUpdate[0]?.lastModified as Date)?.toISOString(), '2026-03-05T00:00:00.000Z');

    const withoutDates = buildSitemapEntries([{ _type: 'post', slug: 'b' }], base);
    assert.equal(withoutDates[0]?.lastModified, undefined);
  });

  it('honors absolute canonical URLs and resolves relative ones against the base', () => {
    const entries = buildSitemapEntries(
      [
        { _type: 'page', slug: 'a', canonicalUrl: 'https://cdn.example.com/canonical' },
        { _type: 'page', slug: 'b', canonicalUrl: '/relative-canonical' },
      ],
      base
    );
    assert.equal(entries[0]?.url, 'https://cdn.example.com/canonical');
    assert.equal(entries[1]?.url, 'https://example.com/relative-canonical');
  });

  it('returns no entries without a site URL', () => {
    assert.deepEqual(buildSitemapEntries([{ _type: 'page', slug: 'x' }], undefined), []);
  });
});
