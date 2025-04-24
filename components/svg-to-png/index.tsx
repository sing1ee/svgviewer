"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import SvgConverter from '../svg-converter';
import SvgToPNGFAQ from './SvgToPNGFAQ';
import SvgToPNGUseCases from './SvgToPNGUseCases';
import Footer from '@/components/footer';
import Header from '@/components/header';

const SvgToPNG: React.FC = () => {
  const [svgCode, setSvgCode] = useState<string>(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#1a1a2e"/><g transform="translate(150, 100) scale(0.8)"><text font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff">.svg</text><rect x="-10" y="-35" width="80" height="45" rx="5" fill="#4CAF50" opacity="0.7"/></g><path d="M300 120 L350 120 L340 110 M350 120 L340 130" stroke="#ffffff" stroke-width="4" fill="none"/><g transform="translate(400, 100) scale(0.8)"><text font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff">.png</text><rect x="-10" y="-35" width="85" height="45" rx="5" fill="#2196F3" opacity="0.7"/></g><text x="300" y="190" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#ffffff">
    SVG to PNG
  </text><text x="300" y="230" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#e94560">
    Conversion Module
  </text><text x="300" y="280" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#ffffff">
    High Quality • Batch Processing • Adjustable Output
  </text><rect x="200" y="310" width="200" height="50" rx="25" fill="#e94560"/><text x="300" y="342" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="#ffffff">
    CONVERT NOW
  </text><circle cx="500" cy="80" r="40" fill="#e94560" opacity="0.5"/><circle cx="100" cy="330" r="30" fill="#4CAF50" opacity="0.5"/></svg>`);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [dataUrl, setDataUrl] = useState<string>("");
  
  const { toast } = useToast();

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
    }
  }, [svgCode]);

  useEffect(() => {
    convertSvgToImage();
  }, [svgCode, scale]);

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

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertSvgToImage = async () => {
    if (!svgCode) return;

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgCode;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const svgElement = tempDiv.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found');
      }

      let svgWidth = parseInt(svgElement.getAttribute('width') || '0');
      let svgHeight = parseInt(svgElement.getAttribute('height') || '0');

      if (!svgWidth || !svgHeight) {
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const [minX, minY, width, height] = viewBox.split(' ').map(Number);
          svgWidth = width;
          svgHeight = height; 
        }
      }
      svgElement.setAttribute('width', svgWidth.toString());
      svgElement.setAttribute('height', svgHeight.toString());
      
      let outputWidth = svgWidth * scale;
      let outputHeight = svgHeight * scale;

      const canvas = await html2canvas(tempDiv, {
        width: outputWidth,
        height: outputHeight,
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      setDataUrl(dataUrl);

      document.body.removeChild(tempDiv);

    } catch (error) {
      console.error('Error converting SVG:', error);
      toast({
        title: "Conversion failed",
        description: "Failed to convert SVG to PNG",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="w-[90%] mx-auto">
          <div className="flex flex-col gap-6 h-full">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG to PNG Converter</h1>
              <p className="text-muted-foreground text-lg">Convert your SVG files to high-quality PNG images with customizable settings.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg shadow-sm gradient-border mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="gap-2 shadow-sm"
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
                <Button variant="outline" className="gap-2 shadow-sm" onClick={() => handleDownload(svgCode, 'download.svg')}>
                  <DownloadIcon className="h-4 w-4" />
                  Download SVG
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <div className="h-full">
              <SvgConverter svgCode={svgCode} onSvgCodeChange={setSvgCode} defaultFormat="png" />
            </div>
          </div>
          
          <SvgToPNGUseCases />
          
          <div className="py-6">
            <SvgToPNGFAQ />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SvgToPNG; 