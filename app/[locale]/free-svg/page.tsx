import {Link} from "@/i18n/navigation";
import Header from '@/components/header'
import Footer from '@/components/footer'
import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: 'en' | 'zh' }> }): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'Metadata-free-svg' });

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
      canonical: locale === 'en' ? '/free-svg' : `/${locale}/free-svg`,
      languages: {
        'en': '/free-svg',
        'zh': '/zh/free-svg',
        'zh-TW': '/zh-TW/free-svg',
        'ja': '/ja/free-svg',
        'ru': '/ru/free-svg',
        'pt': '/pt/free-svg',
        'es': '/es/free-svg',
        'ko': '/ko/free-svg',
        'ar': '/ar/free-svg',
        'hi': '/hi/free-svg',
        'fr': '/fr/free-svg',
        'de': '/de/free-svg',
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

export default async function FreeSVGPage(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);
  const t = await getTranslations("freeSvgCollections");
  const collections = [
    {
      name: t('collections.japaneseCulture.name'),
      path: '/category/japanese-culture',
      description: t('collections.japaneseCulture.description')
    },
    {
      name: t('collections.bitcoinLogo.name'),
      path: '/category/btc-logo',
      description: t('collections.bitcoinLogo.description')
    },
    {
      name: t('collections.helloKitty.name'),
      path: '/category/hello-kitty',
      description: t('collections.helloKitty.description')
    },
    {
      name: t('collections.heart.name'),
      path: '/category/heart',
      description: t('collections.heart.description')
    },
    {
      name: t('collections.flower.name'),
      path: '/category/flower',
      description: t('collections.flower.description')
    },
    {
      name: t('collections.butterfly.name'),
      path: '/category/butterfly',
      description: t('collections.butterfly.description')
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <p className="text-lg mb-6">
            {t('welcome')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((collection) => (
              <div key={collection.path} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-3">{collection.name}</h2>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <Link 
                  href={collection.path}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {t('viewCollection')}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">{t('whyChoose.title')}</h2>
            <ul className="list-disc pl-6 space-y-2">
              {t.raw('whyChoose.reasons').map((reason: string, index: number) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="mt-12 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">{t('howToUse.title')}</h2>
            <p className="mb-4">
              {t('howToUse.description')}
            </p>
            <p>
              {t('howToUse.licenseNote')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}     