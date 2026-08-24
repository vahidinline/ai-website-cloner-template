import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateRedirectSource } from './redirect-validation';

describe('validateRedirectSource', () => {
  it('accepts normal absolute paths', () => {
    assert.deepEqual(validateRedirectSource('/old-page'), { ok: true });
    assert.deepEqual(validateRedirectSource('/nested/path'), { ok: true });
    assert.deepEqual(validateRedirectSource('/چگونه-فضای-سایبری'), { ok: true });
  });

  it('rejects paths that do not start with a single slash', () => {
    assert.equal(validateRedirectSource('old-page').ok, false);
    assert.equal(validateRedirectSource('//example.com').ok, false);
    assert.equal(validateRedirectSource('').ok, false);
  });

  it('rejects whitespace and accepts query strings or fragments as path aliases', () => {
    assert.equal(validateRedirectSource('/has space').ok, false);
    assert.deepEqual(validateRedirectSource('/path?x=1'), { ok: true });
    assert.deepEqual(validateRedirectSource('/path#frag'), { ok: true });
  });

  it('rejects trailing slashes', () => {
    assert.equal(validateRedirectSource('/path/').ok, false);
  });

  it('rejects reserved application routes', () => {
    for (const reserved of ['/api', '/api/revalidate', '/studio', '/_next/static/x']) {
      assert.equal(validateRedirectSource(reserved).ok, false, reserved);
    }
  });

  it('rejects the home page as a source', () => {
    assert.equal(validateRedirectSource('/').ok, false);
  });

  it('rejects self-redirects and duplicate active sources', () => {
    const result = validateRedirectSource('/old', { destinationPath: '/old' });
    assert.equal(result.ok, false);
    assert.equal(
      validateRedirectSource('/old', { existingSources: new Set(['/old']) }).ok,
      false
    );
  });

  it('rejects invalid status codes', () => {
    assert.equal(validateRedirectSource('/a', { statusCode: 303 }).ok, false);
    assert.deepEqual(validateRedirectSource('/a', { statusCode: 308 }), { ok: true });
    assert.deepEqual(validateRedirectSource('/removed-page', { statusCode: 410 }), { ok: true });
  });
});
