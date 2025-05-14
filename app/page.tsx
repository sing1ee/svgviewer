"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';
import SvgConverter from '@/components/svg-converter';
import ViewerFaq from '@/components/faq/viewer-faq';
import Footer from '@/components/footer';
import Header from '@/components/header';

export default function Home() {
  const [svgCode, setSvgCode] = useState<string>(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#1a1a2e"/><circle cx="500" cy="80" r="40" fill="#e94560" opacity="0.7"/><text x="300" y="150" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#ffffff">
    WELCOME TO
  </text><text x="300" y="210" font-family="Arial, sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="#e94560">
    SVGViewer.app
  </text><rect x="200" y="250" width="200" height="50" rx="25" fill="#e94560"/><text x="300" y="285" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">
    VISIT NOW
  </text><text x="300" y="350" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffffff">
    https://svgviewer.app
  </text></svg>`);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSvgCode(content);
      };
      reader.readAsText(file);
    }
  };

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
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg shadow-sm gradient-border">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="gap-2 shadow-sm text-sm h-9"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <UploadIcon className="h-4 w-4" />
                  Upload SVG
                  <input
                    id="file-upload"
                    type="file"
                    accept=".svg"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Button>
              </div>
            </div>

            <SvgConverter 
              svgCode={svgCode} 
              onSvgCodeChange={setSvgCode}
            />
          </div>
          
          <ViewerFaq />
        </div>
      </main>

      <Footer />
    </div>
  );
}