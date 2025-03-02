import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SVG Viewer - Free Online Tool to View and Edit SVG Files',
  description: 'Free online SVG viewer tool to view, edit, optimize and convert SVG files. Our SVG viewer helps you visualize and manipulate SVG code in real-time.',
  keywords: 'svg viewer, svg editor, svg optimizer, svg converter, svg code, svg online tool',
  openGraph: {
    title: 'SVG Viewer - Free Online Tool to View and Edit SVG Files',
    description: 'Free online SVG viewer tool to view, edit, optimize and convert SVG files. Our SVG viewer helps you visualize and manipulate SVG code in real-time.',
    type: 'website',
    url: 'https://svgviewer.app',
    images: [
      {
        url: 'https://svgviewer.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SVG Viewer',
      }
    ],
  },
  alternates: {
    canonical: 'https://svgviewer.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DVMP8MGHFZ" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DVMP8MGHFZ');
        `}
      </Script>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}