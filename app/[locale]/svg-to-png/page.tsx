import FAQ from '@/components/faq';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';
import UseCases from '@/components/usecases';
import { siteConfig } from '@/config/site';
import { homeDefaultSvg } from '@/lib/default-svgs';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const revalidate = 60;
export const dynamic = "force-static";

export async function generateMetadata(props: { params: Promise<{ locale: 'en' | 'zh' }> }): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

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

export default async function SvgToPNGPage(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <SvgConverter svgCodeParam={homeDefaultSvg}/>
        <UseCases page="svgToPngUseCases" />
        <FAQ page="svgToPng" />
      </main>
      <Footer />
    </div>
  );
} 

export const runtime = 'edge';