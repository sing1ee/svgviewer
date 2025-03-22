import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SVG Converter - Free Online Tool to Convert SVG Files',
  description: 'Convert SVG files to PNG, JPEG, and other formats online for free. Our SVG converter tool makes it easy to transform vector graphics into raster images.',
  keywords: 'svg converter, svg to png, svg to jpeg, svg to image, convert svg files, svg transformation',
  openGraph: {
    title: 'SVG Converter - Free Online Tool to Convert SVG Files',
    description: 'Convert SVG files to PNG, JPEG, and other formats online for free. Our SVG converter tool makes it easy to transform vector graphics into raster images.',
    url: 'https://svgviewer.app/svg-converter',
    images: [
      {
        url: 'https://svgviewer.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SVG Converter',
      }
    ],
  },
  alternates: {
    canonical: 'https://svgviewer.app/svg-converter',
  },
};

export default function ConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 