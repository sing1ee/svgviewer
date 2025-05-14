import OptimizerFaq from '@/components/faq/optimizer-faq';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';
import { setRequestLocale } from 'next-intl/server';

export default function OptimizerPage({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <SvgConverter />
        <OptimizerFaq />
      </main>
      <Footer />
    </div>
  );
}