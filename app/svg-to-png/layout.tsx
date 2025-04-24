import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SVG to PNG Converter - Free Online Tool to Convert SVG to PNG',
  description: 'Convert SVG files to PNG format online for free. Our SVG to PNG converter tool makes it easy to transform vector graphics into high-quality PNG images with customizable settings.',
  keywords: 'svg to png, svg converter, convert svg to png, svg to png converter, svg to image, png converter, vector to raster, svg transformation',
  openGraph: {
    title: 'SVG to PNG Converter - Free Online Tool to Convert SVG to PNG',
    description: 'Convert SVG files to PNG format online for free. Our SVG to PNG converter tool makes it easy to transform vector graphics into high-quality PNG images with customizable settings.',
    url: 'https://svgviewer.app/svg-to-png',
    images: [
      {
        url: 'https://svgviewer.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SVG to PNG Converter',
      }
    ],
  },
  alternates: {
    canonical: 'https://svgviewer.app/svg-to-png',
  },
};

export default function SvgToPNGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 