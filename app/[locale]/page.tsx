
import SvgConverter from '@/components/svg-converter';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { setRequestLocale } from 'next-intl/server';
import FAQ from '@/components/faq';

export const revalidate = 60;
export const dynamic = "force-static";

export default async function Home(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
          <SvgConverter />
          <FAQ
              page="viewer"
            />
      </main>
      <Footer />
    </div>
  );
}