export const siteConfig = {
  name: 'SVGViewer.app',
  url: 'https://svgviewer.app',
  
  ogImage: {
    svgviewer: '/og-image.png',
  },
  favicon: '/favicon.ico',
} as const;

export type SiteConfig = typeof siteConfig; 