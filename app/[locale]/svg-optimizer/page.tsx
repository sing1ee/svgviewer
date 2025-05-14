
import OptimizerFaq from '@/components/faq/optimizer-faq';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';

export default function OptimizerPage() {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="w-[90%] mx-auto">
          <div className="flex flex-col gap-6 h-full">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG Optimizer</h1>
              <p className="text-muted-foreground text-lg">Reduce your SVG file size while maintaining quality.</p>
            </div>

            <SvgConverter />
          </div>
          
          <OptimizerFaq />
        </div>
      </main>

      <Footer />
    </div>
  );
}