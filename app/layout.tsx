import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: {
    template: '%s | SVG Viewer',
    default: 'SVG Viewer - Free Online Tool to View and Convert SVG Files',
  },
  description: 'Free online SVG viewer tool to view, edit, optimize and convert SVG files. Our SVG viewer helps you visualize and manipulate SVG code in real-time.',
  metadataBase: new URL('https://svgviewer.app'),
  keywords: 'svg viewer, svg editor, svg optimizer, svg converter, svg code, svg online tool',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SVG Viewer',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'SVG Viewer - Free Online Tool to View and Convert SVG',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <style>
          {`
            .cm-editor {
              min-height: 200px;
            }
            .preview-container {
              min-height: 200px;
            }
          `}
        </style>
      </head>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DVMP8MGHFZ" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DVMP8MGHFZ');
        `}
      </Script>
      <body className={`${inter.className} safe-bottom`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}