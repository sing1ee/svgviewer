import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free SVG Collections',
  description: 'Discover our curated collection of free SVG files. Download high-quality SVG icons, logos, and designs for your projects. Perfect for web design, mobile apps, and print materials.',
  keywords: 'free svg, svg collections, free svg files, svg icons, svg resources, vector graphics, free vector, svg download, svg library',
  openGraph: {
    title: 'Free SVG Collections - Download High-Quality SVG Resources',
    description: 'Discover our curated collection of free SVG files. Download high-quality SVG icons, logos, and designs for your projects. Perfect for web design, mobile apps, and print materials.',
    url: 'https://svgviewer.app/free-svg',
    images: [
      {
        url: 'https://svgviewer.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free SVG Collections',
      }
    ],
  },
  alternates: {
    canonical: 'https://svgviewer.app/free-svg',
  },
};

export default function FreeSVGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 