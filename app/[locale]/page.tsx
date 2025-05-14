
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
        <div className="w-[90%] mx-auto">
          <div className="flex flex-col gap-6 h-full">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG Viewer & Editor</h1>
              <p className="text-muted-foreground text-base md:text-lg">A powerful online tool to view, edit, and optimize your SVG files in real-time.</p>
            </div>

            <SvgConverter 
            />
          </div>
          
          <ViewerFaq />
        </div>
      </main>

      <Footer />
    </div>
  );
}