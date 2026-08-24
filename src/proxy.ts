import { NextRequest, NextResponse } from 'next/server';
import { getRedirect } from '@/sanity/queries';
import { resolveInternalUrl } from '@/sanity/urls';
import type { SanityRedirect } from '@/sanity/types';

const gonePage = `<!doctype html>
<html lang="fa" dir="rtl">
  <head><meta charset="utf-8"><title>صفحه حذف شده است</title></head>
  <body>
    <main>
      <h1>این صفحه حذف شده است</h1>
      <p>این محتوا دیگر در دسترس نیست.</p>
      <a href="/">بازگشت به صفحهٔ اصلی</a>
    </main>
  </body>
</html>`;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Normalize before matching: strip trailing slash (except root).
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') || '/' : pathname;

  const redirect = await getRedirect(normalizedPath) as SanityRedirect | null;
  if (!redirect) return NextResponse.next();

  // 410 is not a redirect: it explicitly tells clients and search engines
  // that the requested page has been permanently removed. Return HTML so the
  // visitor sees a useful page instead of a blank browser response.
  if (redirect.statusCode === 410) {
    return new NextResponse(gonePage, {
      status: 410,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  const internalHref = resolveInternalUrl(redirect.destinationInternal);
  const destination = redirect.destinationUrl || internalHref;
  if (!destination || destination === pathname || destination === normalizedPath) return NextResponse.next();

  return NextResponse.redirect(new URL(destination, request.url), redirect.statusCode || 301);
}

export const config = { matcher: ['/((?!api|_next|studio|favicon.ico).*)'] };
