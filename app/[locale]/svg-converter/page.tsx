import ConverterFaq from '@/components/faq/converter-faq';
import Footer from '@/components/footer';
import Header from '@/components/header';
import SvgConverter from '@/components/svg-converter';
import { homeDefaultSvg } from '@/lib/default-svgs';

export default function ConverterPage() {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
        <SvgConverter svgCodeParam={homeDefaultSvg} defaultFormat="svg" />
        <ConverterFaq />
      </main>

      <Footer />
    </div>
  );
}