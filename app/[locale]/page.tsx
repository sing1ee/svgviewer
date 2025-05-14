
import SvgConverter from '@/components/svg-converter';
import ViewerFaq from '@/components/faq/viewer-faq';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { setRequestLocale } from 'next-intl/server';

export default function Home({params: {locale}}: {params: {locale: string}}) {
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
          <SvgConverter />
          <ViewerFaq />
      </main>
      <Footer />
    </div>
  );
}