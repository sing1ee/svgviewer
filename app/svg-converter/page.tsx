"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import ConverterFaq from '@/components/faq/converter-faq';
import html2canvas from 'html2canvas';
import Footer from '@/components/footer';
import Header from '@/components/header';
import SvgConverter from '@/components/svg-converter';

export default function ConverterPage() {
  const [svgCode, setSvgCode] = useState<string>(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#1a1a2e"/><circle cx="500" cy="80" r="40" fill="#e94560" opacity="0.7"/><text x="300" y="150" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#ffffff">
    WELCOME TO
  </text><text x="300" y="210" font-family="Arial, sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="#e94560">
    SVGViewer.app
  </text><rect x="200" y="250" width="200" height="50" rx="25" fill="#e94560"/><text x="300" y="285" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#ffffff">
    VISIT NOW
  </text><text x="300" y="350" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffffff">
    https://svgviewer.app
  </text></svg>`);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [format, setFormat] = useState<string>("png");
  const [scale, setScale] = useState<number>(1);
  const [dataUrl, setDataUrl] = useState<string>("");
  
  const { toast } = useToast();
  const [icoSize, setIcoSize] = useState<number>(16);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
    }
  }, [svgCode]);

  useEffect(() => {
    // Convert SVG to data URL when format or scale changes
    convertSvgToImage();
  }, [svgCode, format, scale, icoSize]);
  
  useEffect(() => {
    setFileName(getDefaultFileName(format, format === 'ico' ? icoSize : undefined));
  }, [format, icoSize]);

  const getDefaultFileName = (format: string, size?: number) => {
    if (format === 'ico') {
      return size === 16 ? 'favicon' : `favicon-${size}x${size}`;
    }
    const formatMap: Record<string, string> = {
      'png': 'svgtopng',
      'jpeg': 'svgtojpeg',
      'webp': 'svgtowebp',
      'svg': 'svgoriginal'
    };
    return formatMap[format] || '';
  };
  
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
      // 创建一个临时的 div 来放置 SVG
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgCode;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // 获取 SVG 元素
      const svgElement = tempDiv.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found');
      }

      // 设置 SVG 尺寸
      let svgWidth = parseInt(svgElement.getAttribute('width') || '0');
      let svgHeight = parseInt(svgElement.getAttribute('height') || '0');

      // 如果 width 和 height 没有设置，则从 viewBox 中读取
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
      
      // 根据格式设置输出尺寸
      let outputWidth = svgWidth * scale;
      let outputHeight = svgHeight * scale;
      
      if (format === 'ico') {
        outputWidth = icoSize;
        outputHeight = icoSize;
      }
      // 如果是 ico，并且 icoSize 小于 svgWidth 和 svgHeight，则等比例缩放 svg，以适合 icoSize
      if (format === 'ico' && icoSize < svgWidth && icoSize < svgHeight) {
        svgElement.setAttribute('width', icoSize.toString());
        svgElement.setAttribute('height', icoSize.toString());
      }

      // 使用 html2canvas 转换
      const canvas = await html2canvas(tempDiv, {
        width: outputWidth,
        height: outputHeight,
        scale: 2, // 提高输出质量
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      // 转换为 data URL
      const dataUrl = format === 'ico' 
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL(`image/${format}`);
      
      setDataUrl(dataUrl);

      // 清理临时元素
      document.body.removeChild(tempDiv);

    } catch (error) {
      console.error('Error converting SVG:', error);
      toast({
        title: "Conversion failed",
        description: "Failed to convert to target format",
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
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG Converter</h1>
              <p className="text-muted-foreground text-lg">Convert your SVG files to PNG, JPEG, WebP formats or ICO.</p>
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
              <SvgConverter svgCode={svgCode} onSvgCodeChange={setSvgCode} defaultFormat="svg" />
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