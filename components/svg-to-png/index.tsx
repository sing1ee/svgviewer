
import FAQ from '../faq/faq';
import SvgConverter from '../svg-converter';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { homeDefaultSvg } from '@/lib/default-svgs';
import UseCases from '../UseCases';
const SvgToPNG: React.FC = () => {

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
};

export default SvgToPNG; 