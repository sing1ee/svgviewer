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
        <div className="w-[90%] mx-auto">
          <div className="flex flex-col gap-6 h-full">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG Converter</h1>
              <p className="text-muted-foreground text-lg">Convert your SVG files to PNG, JPEG, WebP formats or ICO.</p>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <div className="h-full">
              <SvgConverter svgCodeParam={homeDefaultSvg} defaultFormat="svg" />
            </div>
          </div>
          
          <div className="py-6">
            <ConverterFaq />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}