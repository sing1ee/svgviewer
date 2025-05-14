
import SvgConverter from '../svg-converter';
import SvgToPNGFAQ from './SvgToPNGFAQ';
import SvgToPNGUseCases from './SvgToPNGUseCases';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { homeDefaultSvg } from '@/lib/default-svgs';

const SvgToPNG: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
              <SvgConverter svgCodeParam={homeDefaultSvg} defaultFormat="png" />
          
          <SvgToPNGUseCases />
          
            <SvgToPNGFAQ />
      </main>

      <Footer />
    </div>
  );
};

export default SvgToPNG; 