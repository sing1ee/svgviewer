"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, DownloadIcon, UploadIcon, XIcon, ClipboardPasteIcon } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { GridBackground } from '@/components/grid-background';
import NextImage from 'next/image';
import { MobileNav } from '@/components/mobile-nav';
import ConverterFaq from '@/components/faq/converter-faq';
import html2canvas from 'html2canvas';

export default function ConverterPage() {
  const [svgCode, setSvgCode] = useState<string>('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">\n  <rect width="400" height="400" rx="200" fill="#2563eb"/>\n  <circle cx="200" cy="200" r="80" fill="black"/>\n  <rect x="240" y="240" width="120" height="120" rx="20" fill="white" transform="rotate(-45 240 240)"/>\n</svg>');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "SVG code has been copied to your clipboard",
    });
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
      const svgWidth = parseInt(svgElement.getAttribute('width') || '400');
      const svgHeight = parseInt(svgElement.getAttribute('height') || '400');
      
      // 根据格式设置输出尺寸
      let outputWidth = svgWidth * scale;
      let outputHeight = svgHeight * scale;
      
      if (format === 'ico') {
        outputWidth = icoSize;
        outputHeight = icoSize;
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
        title: "转换失败",
        description: "无法将 SVG 转换为目标格式",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async () => {
    if (!dataUrl && format !== 'svg') return;

    const downloadFileName = fileName || getDefaultFileName(format, format === 'ico' ? icoSize : undefined);
    
    if (format === 'ico') {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const pngArrayBuffer = await blob.arrayBuffer();
        
        // Create ICO header
        const header = new ArrayBuffer(6);
        const view = new DataView(header);
        view.setUint16(0, 0, true);     // Reserved. Must always be 0
        view.setUint16(2, 1, true);     // Image type: 1 for icon (.ICO)
        view.setUint16(4, 1, true);     // Number of images
        
        // Create ICO directory entry
        const directory = new ArrayBuffer(16);
        const dirView = new DataView(directory);
        dirView.setUint8(0, icoSize >= 256 ? 0 : icoSize);    // Width
        dirView.setUint8(1, icoSize >= 256 ? 0 : icoSize);    // Height
        dirView.setUint8(2, 0);         // Color palette
        dirView.setUint8(3, 0);         // Reserved
        dirView.setUint16(4, 1, true);  // Color planes
        dirView.setUint16(6, 32, true); // Bits per pixel
        dirView.setUint32(8, pngArrayBuffer.byteLength, true);  // Size of image data
        dirView.setUint32(12, 22, true);        // Offset of image data
        
        // Combine all parts
        const iconData = new Blob([header, directory, pngArrayBuffer], { type: 'image/x-icon' });
        
        // Download
        const url = URL.createObjectURL(iconData);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${downloadFileName}.ico`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Image Downloaded",
          description: "SVG has been converted to ICO and downloaded",
        });
      } catch (error) {
        console.error("ICO conversion error:", error);
        toast({
          title: "Conversion Failed",
          description: "Failed to convert to ICO format",
          variant: "destructive",
        });
      }
      return;
    }
    
    // Original download logic for other formats
    const a = document.createElement('a');
    a.href = format === 'svg' ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}` : dataUrl;
    a.download = `${downloadFileName}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Image Downloaded",
      description: `SVG has been converted to ${format.toUpperCase()} and downloaded`,
    });
  };

  const handleClear = () => {
    setSvgCode('');
    toast({
      title: "Cleared",
      description: "SVG code has been cleared",
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSvgCode(text);
      toast({
        title: "Pasted from clipboard",
        description: "SVG code has been pasted from your clipboard",
      });
    } catch (error) {
      toast({
        title: "Paste failed",
        description: "Failed to read from clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={32} height={32} className="rounded-md" />
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVGViewer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Viewer
            </Link>
            <Link href="/svg-optimizer" className="text-sm font-medium hover:text-primary transition-colors">
              Optimizer
            </Link>
            <Link href="/svg-converter" className="text-sm font-medium text-primary">
              Converter
            </Link>
          </nav>
          <MobileNav />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-8.5rem)]">
        <div className="flex flex-col gap-6 h-full">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG Converter</h1>
            <p className="text-muted-foreground text-lg">Convert your SVG files to PNG, JPEG, WebP formats or ICO.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg shadow-sm gradient-border">
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
              <Button
                variant="default"
                className="gap-2 shadow-md"
                onClick={handleDownloadImage}
                disabled={!dataUrl && format !== 'svg'}
              >
                <DownloadIcon className="h-4 w-4" />
                Download as {format.toUpperCase()}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Zoom:</span>
                <Slider
                  value={[zoom]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={(value) => setZoom(value[0])}
                  className="w-32"
                />
                <span className="text-sm w-12">{zoom}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">SVG Code</h2>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="hover:bg-primary/10 h-7 px-2"
                  >
                    <XIcon className="h-3.5 w-3.5 mr-1" />
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(svgCode)}
                    className="hover:bg-primary/10 h-7 px-2"
                  >
                    <CopyIcon className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePaste}
                    className="hover:bg-primary/10 h-7 px-2"
                  >
                    <ClipboardPasteIcon className="h-3.5 w-3.5 mr-1" />
                    Paste
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden flex-1 shadow-md gradient-border">
                <CodeEditor value={svgCode} onChange={setSvgCode} />
              </div>
            </div>

            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Size: {originalSize} bytes</span>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden relative flex-1 min-h-0 flex items-center justify-center shadow-md gradient-border bg-white dark:bg-black">
                <GridBackground />
                <SvgPreview 
                  svgCode={svgCode} 
                  zoom={zoom} 
                />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm gradient-border">
            <h2 className="text-xl font-semibold mb-4">Conversion Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Output Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="svg">SVG (Original)</SelectItem>
                    <SelectItem value="ico">ICO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {format === 'ico' ? (
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Icon Size</label>
                  <Select value={icoSize.toString()} onValueChange={(value) => setIcoSize(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16">16x16 - Browser tabs, address bar</SelectItem>
                      <SelectItem value="32">32x32 - Taskbar, shortcuts</SelectItem>
                      <SelectItem value="48">48x48 - Desktop icons</SelectItem>
                      <SelectItem value="64">64x64 - High-resolution displays</SelectItem>
                      <SelectItem value="128">128x128 - App icons</SelectItem>
                      <SelectItem value="256">256x256 - Modern Windows icons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Scale Factor</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[scale]}
                      min={0.5}
                      max={3}
                      step={0.5}
                      onValueChange={(value) => setScale(value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-12">{scale}x</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">File Name</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder={getDefaultFileName(format, format === 'ico' ? icoSize : undefined)}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">.{format}</span>
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="default" 
                  className="w-full gap-2 shadow-md"
                  onClick={handleDownloadImage}
                  disabled={!dataUrl && format !== 'svg'}
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download as {format.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center my-6">
            <Button variant="outline" className="gap-2 shadow-sm" onClick={() => document.getElementById('file-upload')?.click()}>
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
            <Button variant="outline" className="gap-2 shadow-sm" onClick={() => handleCopy(svgCode)}>
              <CopyIcon className="h-4 w-4" />
              Copy SVG
            </Button>
          </div>
        </div>
        
        <ConverterFaq />
      </main>

      <footer className="border-t py-6 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={28} height={28} className="rounded-md" />
              <span className="font-poppins font-bold text-xl">SVGViewer</span>
            </div>
            <div className="flex gap-8">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Viewer
              </Link>
              <Link href="/svg-optimizer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Optimizer
              </Link>
              <Link href="/svg-converter" className="text-sm text-primary hover:text-primary transition-colors">
                Converter
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <a href="/privacy.html" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="/terms.html" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SVGViewer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}