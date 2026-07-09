import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'The Blog of Author Saeed Souzangar',
  description:
    'The Saeed Souzangar Show is one of the most popular podcasts in the world, with more than one billion downloads.',
  icons: {
    icon: [
      { url: '/seo/favicon-0.png', sizes: '32x32' },
      { url: '/seo/favicon-1.png', sizes: '192x192' },
    ],
    apple: '/seo/favicon-2.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
