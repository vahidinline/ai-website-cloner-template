import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { isGlobalType, revalidationTargets, type WebhookBody } from './tags';

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || request.headers.get('x-sanity-revalidate-secret') !== secret) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = await request.json() as WebhookBody;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body?._type) return NextResponse.json({ message: 'Missing document type' }, { status: 400 });

  const { tags, path } = revalidationTargets(body);
  for (const tag of tags) revalidateTag(tag, 'max');
  if (path) revalidatePath(path);
  // Global settings affect header/footer/metadata on every route.
  if (isGlobalType(body._type)) {
    for (const tag of ['site-settings', 'redirects', 'archive-settings', 'sitemap']) revalidateTag(tag, 'max');
    revalidatePath('/', 'layout');
  }

  return NextResponse.json({ revalidated: true, tags });
}
