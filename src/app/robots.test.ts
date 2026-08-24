import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildRobotsRules } from './robots-rules';

describe('robots rules builder', () => {
  const base = { siteUrl: 'https://example.com' };

  it('allows everything and exposes the sitemap by default', () => {
    const result = buildRobotsRules(base);
    assert.deepEqual(result.rules, { userAgent: '*', allow: '/', disallow: [] });
    assert.equal(result.sitemap, 'https://example.com/sitemap.xml');
  });

  it('blocks the whole site when indexing is disabled and omits the sitemap', () => {
    const result = buildRobotsRules({ ...base, robots: { allowIndexing: false } });
    assert.deepEqual(result.rules, { userAgent: '*', disallow: '/' });
    assert.equal(result.sitemap, undefined);
  });

  it('omits the sitemap when disabled while keeping indexing allowed', () => {
    const result = buildRobotsRules({ ...base, robots: { sitemapEnabled: false } });
    assert.equal(result.sitemap, undefined);
    const rules = result.rules as { allow?: string };
    assert.equal(rules.allow, '/');
  });

  it('passes through custom disallow paths and drops empty entries', () => {
    const result = buildRobotsRules({
      ...base,
      robots: { disallowPaths: ['/private', ''] },
    }) as { rules: { disallow?: string[] } };
    assert.deepEqual(result.rules.disallow, ['/private']);
  });

  it('strips a trailing slash from the site URL when building the sitemap link', () => {
    const result = buildRobotsRules({ siteUrl: 'https://example.com/' });
    assert.equal(result.sitemap, 'https://example.com/sitemap.xml');
  });

  it('falls back to no sitemap without a site URL', () => {
    const result = buildRobotsRules({});
    assert.equal(result.sitemap, undefined);
  });
});
