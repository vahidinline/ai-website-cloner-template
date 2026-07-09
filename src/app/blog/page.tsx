import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { getPosts } from '@/sanity/queries';
import { hasValidSanityConfig } from '@/sanity/env';

type PostListItem = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  publishedAt?: string;
};

export default async function BlogIndexPage() {
  const posts = hasValidSanityConfig
    ? ((await getPosts()) as PostListItem[])
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf9f9]">
      <Header />
      <main className="flex-1 px-[18px] pb-20 pt-[170px]">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-[#2c80b8]">
            Blog
          </p>
          <h1 className="mt-3 text-[56px] font-bold leading-none tracking-[-2px] text-[#001523] md:text-[88px]">
            Latest posts
          </h1>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="rounded-[30px] bg-white p-8 shadow-sm">
                <h2 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#001523]">
                  <Link href={`/blog/${post.slug?.current || '#'}`}>
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt ? (
                  <p className="mt-4 text-[#66737b]">{post.excerpt}</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
