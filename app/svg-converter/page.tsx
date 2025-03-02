"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {  CopyIcon, DownloadIcon, UploadIcon, ZapIcon, Code2Icon } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { GridBackground } from '@/components/grid-background';
import NextImage from 'next/image';

export default function ConverterPage() {
  const [svgCode, setSvgCode] = useState<string>('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">\n  <rect width="400" height="400" rx="200" fill="#2563eb"/>\n  <circle cx="200" cy="200" r="80" fill="black"/>\n  <rect x="240" y="240" width="120" height="120" rx="20" fill="white" transform="rotate(-45 240 240)"/>\n</svg>');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 400, height: 400 });
  const [zoom, setZoom] = useState<number>(100);
  const [format, setFormat] = useState<string>("png");
  const [scale, setScale] = useState<number>(1);
  const [dataUrl, setDataUrl] = useState<string>("");
  
  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
    }
  }, [svgCode]);

  useEffect(() => {
    // Convert SVG to data URL when format or scale changes
    convertSvgToImage();
  }, [svgCode, format, scale]);

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

  const handleCanvasSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setCanvasSize(prev => ({ ...prev, [dimension]: numValue }));
    }
  };

  const convertSvgToImage = () => {
    if (!svgCode) return;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions based on SVG and scale
    const svgWidth = parseInt(svgElement.getAttribute('width') || '400');
    const svgHeight = parseInt(svgElement.getAttribute('height') || '400');
    canvas.width = svgWidth * scale;
    canvas.height = svgHeight * scale;
    
    // Create an image from the SVG
    const img = document.createElement('img');
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL(`image/${format}`);
      setDataUrl(dataUrl);
      
      // Clean up
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  const handleDownloadImage = () => {
    if (!dataUrl) return;
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `converted.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Image Downloaded",
      description: `SVG has been converted to ${format.toUpperCase()} and downloaded`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={24} height={24} />
              <span className="font-bold text-xl">SVGViewer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/svg-optimizer" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Optimizer
            </Link>
            <Link href="/svg-converter" className="text-sm font-medium text-blue-600">
              Converter
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-2 flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
            <h1 className="text-2xl font-bold">SVG Converter</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Canvas:</span>
                <Input
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => handleCanvasSizeChange('width', e.target.value)}
                  className="w-20 h-8"
                />
                <span className="text-sm text-muted-foreground">×</span>
                <Input
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => handleCanvasSizeChange('height', e.target.value)}
                  className="w-20 h-8"
                />
              </div>
              <div className="flex items-center gap-2 ml-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">SVG Code</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(svgCode)}
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="border rounded-md overflow-hidden flex-1">
                <CodeEditor value={svgCode} onChange={setSvgCode} />
              </div>
            </div>

            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Preview</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Size: {originalSize} bytes</span>
                </div>
              </div>
              <div className="border rounded-md overflow-hidden relative flex-1 flex items-center justify-center">
                <GridBackground />
                {format === 'svg' ? (
                  <SvgPreview 
                    svgCode={svgCode} 
                    width={canvasSize.width} 
                    height={canvasSize.height} 
                    zoom={zoom} 
                  />
                ) : (
                  dataUrl && (
                    <img 
                      src={dataUrl} 
                      alt="Converted SVG" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%',
                        transform: `scale(${zoom / 100})` 
                      }} 
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Conversion Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="svg">SVG (Original)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Scale Factor</label>
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
              <div className="flex items-end">
                <Button 
                  variant="default" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleDownloadImage}
                  disabled={!dataUrl && format !== 'svg'}
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download as {format.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center my-2">
            <Button variant="outline" className="gap-2" onClick={() => document.getElementById('file-upload')?.click()}>
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
            <Button variant="outline" className="gap-2" onClick={() => handleDownload(svgCode, 'download.svg')}>
              <DownloadIcon className="h-4 w-4" />
              Download SVG
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => handleCopy(svgCode)}>
              <CopyIcon className="h-4 w-4" />
              Copy SVG
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={24} height={24} />
              <span className="font-bold">SVGViewer</span>
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