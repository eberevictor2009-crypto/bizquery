// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO: Global Metadata for BizQuery
export const metadata: Metadata = {
  metadataBase: new URL('https://bizquery.com'), // Replace with your real domain when you buy it
  title: {
    default: 'BizQuery - Ask, Get Answers and Grow Your Business',
    template: '%s | BizQuery',
  },
  description: 'The premier platform for entrepreneurs and startups. Ask business questions, get expert answers, and grow your company.',
  keywords: ['business questions', 'startup advice', 'entrepreneur forum', 'business growth', 'Nigeria business', 'how to grow a business'],
  authors: [{ name: 'BizQuery Team' }],
  openGraph: {
    title: 'BizQuery - Business Q&A',
    description: 'Ask, Get Answers and Grow Your Business.',
    url: 'https://bizquery.com',
    siteName: 'BizQuery',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizQuery - Business Q&A',
    description: 'Ask, Get Answers and Grow Your Business.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // ✅ Fixes the extension hydration errors
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}