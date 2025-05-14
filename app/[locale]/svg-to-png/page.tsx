import SvgToPNG from '@/components/svg-to-png';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: 'en' | 'zh' } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata-svg-to-png' });


  const title = t('title');
  const description = t('description');
  const ogTitle = t('ogTitle') || title;
  const ogDescription = t('ogDescription') || description;
  const twitterTitle = t('twitterTitle') || title;
  const twitterDescription = t('twitterDescription') || description;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    icons: {
      icon: siteConfig.favicon,
    },
    alternates: {
      canonical: locale === 'en' ? '/svg-to-png' : `/${locale}/svg-to-png`,
      languages: {
        'en': '/svg-to-png',
        'zh': '/zh/svg-to-png',
        'zh-TW': '/zh-TW/svg-to-png',
        'ja': '/ja/svg-to-png',
        'ru': '/ru/svg-to-png',
        'pt': '/pt/svg-to-png',
        'es': '/es/svg-to-png',
        'ko': '/ko/svg-to-png',
        'ar': '/ar/svg-to-png',
        'hi': '/hi/svg-to-png',
        'fr': '/fr/svg-to-png',
        'de': '/de/svg-to-png',
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
  };
}

export default function SvgToPNGPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  return <SvgToPNG />;
} 