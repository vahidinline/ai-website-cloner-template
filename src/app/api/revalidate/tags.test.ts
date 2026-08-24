import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isGlobalType, revalidationTargets } from './tags';

describe('revalidationTargets', () => {
  it('returns no targets without a document type', () => {
    assert.deepEqual(revalidationTargets({}), { tags: [] });
  });

  it('maps content documents to collection, id and slug tags', () => {
    const result = revalidationTargets({ _type: 'post', _id: 'abc123', slug: 'hello-world' });
    assert.deepEqual(result.tags, ['posts', 'post:abc123', 'post:hello-world']);
    assert.equal(result.path, '/blog/hello-world');
  });

  it('routes each detail type to its public path prefix', () => {
    assert.equal(revalidationTargets({ _type: 'podcastEpisode', slug: 'e1' }).path, '/podcast/e1');
    assert.equal(revalidationTargets({ _type: 'video', slug: 'v1' }).path, '/videos/v1');
    assert.equal(revalidationTargets({ _type: 'book', slug: 'b1' }).path, '/books/b1');
  });

  it('maps the home page to / and other pages to /slug', () => {
    assert.equal(revalidationTargets({ _type: 'page', slug: 'home' }).path, '/');
    assert.equal(revalidationTargets({ _type: 'page', slug: 'about' }).path, '/about');
    // Pages also invalidate their detail path via tag-based invalidation.
    assert.deepEqual(revalidationTargets({ _type: 'page', slug: 'about' }).tags, ['pages', 'page:about']);
  });

  it('omits id/slug tags when those fields are missing', () => {
    assert.deepEqual(revalidationTargets({ _type: 'video' }), { tags: ['videos'], path: undefined });
  });
});

describe('isGlobalType', () => {
  it('treats settings documents as global', () => {
    for (const type of ['siteSettings', 'redirect', 'archivePageSettings']) {
      assert.equal(isGlobalType(type), true, type);
    }
    assert.equal(isGlobalType('post'), false);
  });
});
