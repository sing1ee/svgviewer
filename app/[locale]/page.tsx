
import SvgConverter from '@/components/svg-converter';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import FAQ from '@/components/faq';
import Topbar from '@/components/topbar';
import { Link } from '@/i18n/navigation';

export default async function Home(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);

  const t = await getTranslations('hero');
  const ft = await getTranslations('features');
  const st = await getTranslations('freeSvgCollections');

  const features = ft.raw('viewer.features') as { title: string; description: string }[];
  const collections = [
    { name: st('collections.japaneseCulture.name'), path: '/category/japanese-culture', description: st('collections.japaneseCulture.description') },
    { name: st('collections.bitcoinLogo.name'), path: '/category/btc-logo', description: st('collections.bitcoinLogo.description') },
    { name: st('collections.helloKitty.name'), path: '/category/hello-kitty', description: st('collections.helloKitty.description') },
    { name: st('collections.heart.name'), path: '/category/heart', description: st('collections.heart.description') },
    { name: st('collections.flower.name'), path: '/category/flower', description: st('collections.flower.description') },
    { name: st('collections.butterfly.name'), path: '/category/butterfly', description: st('collections.butterfly.description') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Topbar />
      <Header />
      <main className="flex-1 flex flex-col">
        {/* Hero：唯一保留渐变文字的区域，作为视觉锚点 */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-6 pt-14 pb-10 md:pt-20 md:pb-14 text-center">
            <h1 className="font-poppins text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto mb-10">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#viewer"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm h-11 px-8 text-sm font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                {t('ctaViewer')}
              </a>
              <Link
                href="/free-svg"
                title={t('ctaCollections')}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background shadow-sm h-11 px-8 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
              >
                {t('ctaCollections')}
              </Link>
            </div>
          </div>
        </section>

        {/* 主工具区 */}
        <div id="viewer" className="scroll-mt-24 px-6">
          <SvgConverter />
        </div>

        {/* 特性区 */}
        <section className="container mx-auto px-6 py-12 md:py-16">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            {t('featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border/40 bg-card p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 免费 SVG 集合入口 */}
        <section className="container mx-auto px-6 pb-12 md:pb-16">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
            {t('collectionsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.path}
                href={collection.path}
                title={collection.name}
                className="group rounded-xl border border-border/40 bg-card p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-sm text-foreground/70">{collection.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <FAQ page="viewer" showFeatures={false} />
      </main>
      <Footer />
    </div>
  );
}
