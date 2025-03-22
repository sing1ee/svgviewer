import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SVG Optimizer - Free Online Tool to Optimize SVG',
  description: 'Optimize and clean your SVG files online for free. Reduce file size, remove unnecessary code, and improve performance with our SVG optimizer tool.',
  keywords: 'svg optimizer, svg optimization, compress svg, clean svg, minify svg, svg file size reduction',
  openGraph: {
    title: 'SVG Optimizer - Free Online Tool to Optimize SVG Files',
    description: 'Optimize and clean your SVG files online for free. Reduce file size, remove unnecessary code, and improve performance with our SVG optimizer tool.',
    url: 'https://svgviewer.app/svg-optimizer',
    images: [
      {
        url: 'https://svgviewer.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SVG Optimizer',
      }
    ],
  },
  alternates: {
    canonical: 'https://svgviewer.app/svg-optimizer',
  },
};

export default function OptimizerLayout({
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