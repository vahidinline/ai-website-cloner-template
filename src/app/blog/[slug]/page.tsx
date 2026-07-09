import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PortableTextRenderer } from '@/components/portable-text/PortableTextRenderer';
import {
  allPostSlugsQuery,
  getPostBySlug,
  sanityClient,
} from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';

export const dynamicParams = false;

type BlogPost = {
  title?: string;
  excerpt?: string;
  body?: unknown[];
  publishedAt?: string;
};

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!hasValidSanityConfig) {
    return [];
  }

  const posts = await sanityClient.fetch<{ slug: string }[]>(allPostSlugsQuery);
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = (await getPostBySlug(slug)) as BlogPost | null;

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <main className="flex-1 px-[18px] pb-20 pt-[170px]">
        <article className="mx-auto max-w-[860px] text-[#001523]">
          {post.publishedAt ? (
            <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          ) : null}
          <h1 className="mt-3 text-[48px] font-bold leading-[1.02] tracking-[-1.8px] md:text-[76px]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-6 text-xl leading-8 text-[#66737b]">
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-12">
            <PortableTextRenderer value={post.body} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
