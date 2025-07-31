import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: { params: Promise<{ locale: 'en' | 'zh' }> }): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'Metadata-share' });

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
      canonical: locale === 'en' ? '/share' : `/${locale}/share`,
      languages: {
        'en': '/share',
        'zh': '/zh/share',
        'zh-TW': '/zh-TW/share',
        'ja': '/ja/share',
        'ru': '/ru/share',
        'pt': '/pt/share',
        'es': '/es/share',
        'ko': '/ko/share',
        'ar': '/ar/share',
        'hi': '/hi/share',
        'fr': '/fr/share',
        'de': '/de/share',
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

export default async function SharePage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { locale } = params;
  const { code } = searchParams;

  setRequestLocale(locale);

  let svgCode = '';
  
  if (code) {
    try {
      // 解码 base64 编码的 SVG 代码
      svgCode = decodeURIComponent(atob(code));
    } catch (error) {
      console.error('Failed to decode SVG code:', error);
      // 如果解码失败，返回 404
      notFound();
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <SvgConverter svgCodeParam={svgCode} />
      </main>
      <Footer />
    </div>
  );
}