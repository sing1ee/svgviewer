"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, DownloadIcon, UploadIcon, ZapIcon, Code2Icon } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { optimizeSvg } from '@/lib/svg-optimizer';
import { GridBackground } from '@/components/grid-background';
import NextImage from 'next/image';

export default function OptimizerPage() {
  const [svgCode, setSvgCode] = useState<string>('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">\n  <rect width="400" height="400" rx="200" fill="#2563eb"/>\n  <circle cx="200" cy="200" r="80" fill="black"/>\n  <rect x="240" y="240" width="120" height="120" rx="20" fill="white" transform="rotate(-45 240 240)"/>\n</svg>');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [optimizedCode, setOptimizedCode] = useState<string>('');
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 400, height: 400 });
  const [zoom, setZoom] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<string>('original');
  
  const { toast } = useToast();

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
      const optimized = optimizeSvg(svgCode);
      setOptimizedCode(optimized);
      setOptimizedSize(new Blob([optimized]).size);
    }
  }, [svgCode]);

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

  const handleOptimize = () => {
    const optimized = optimizeSvg(svgCode);
    setOptimizedCode(optimized);
    setOptimizedSize(new Blob([optimized]).size);
    setActiveTab('optimized');
    
    toast({
      title: "SVG Optimized",
      description: `Reduced from ${originalSize} to ${new Blob([optimized]).size} bytes (${
        Math.round((1 - new Blob([optimized]).size / originalSize) * 100)
      }% reduction)`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={24} height={24} />
              <span className="font-bold text-xl">SVGViewer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/viewer" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Viewer
            </Link>
            <Link href="/optimizer" className="text-sm font-medium text-blue-600">
              Optimizer
            </Link>
            <Link href="/converter" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Converter
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <h1 className="text-2xl font-bold">SVG Optimizer</h1>
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">Original:</span> {originalSize} bytes
              </div>
              <div className="text-sm">
                <span className="font-medium">Optimized:</span> {optimizedSize} bytes
              </div>
              {optimizedSize !== originalSize && (
                <div className={`text-sm ${optimizedSize < originalSize ? 'text-green-500' : 'text-red-500'}`}>
                  {optimizedSize < originalSize ? 'Saved:' : 'Increased:'} {Math.abs(Math.round((1 - optimizedSize / originalSize) * 100))}%
                </div>
              )}
            </div>
            <Button 
              variant="default" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleOptimize}
            >
              <ZapIcon className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </div>

          <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="optimized">Optimized</TabsTrigger>
            </TabsList>
            <TabsContent value="original" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Original SVG Code</h2>
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
                <div className="border rounded-md overflow-hidden h-[500px]">
                  <CodeEditor value={svgCode} onChange={setSvgCode} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Original Preview</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Size: {originalSize} bytes</span>
                  </div>
                </div>
                <div className="border rounded-md overflow-hidden relative h-[500px] flex items-center justify-center">
                  <GridBackground />
                  <SvgPreview 
                    svgCode={svgCode} 
                    width={canvasSize.width} 
                    height={canvasSize.height} 
                    zoom={zoom} 
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="optimized" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Optimized SVG Code</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(optimizedCode)}
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md overflow-hidden h-[500px]">
                  <CodeEditor value={optimizedCode} onChange={setOptimizedCode} readOnly />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Optimized Preview</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Size: {optimizedSize} bytes</span>
                    {optimizedSize !== originalSize && (
                      <span className={`ml-2 ${optimizedSize < originalSize ? 'text-green-500' : 'text-red-500'}`}>
                        ({optimizedSize < originalSize ? '-' : '+'}
                        {Math.abs(Math.round((1 - optimizedSize / originalSize) * 100))}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="border rounded-md overflow-hidden relative h-[500px] flex items-center justify-center">
                  <GridBackground />
                  <SvgPreview 
                    svgCode={optimizedCode} 
                    width={canvasSize.width} 
                    height={canvasSize.height} 
                    zoom={zoom} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-4 justify-center mt-4">
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
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => handleDownload(activeTab === 'original' ? svgCode : optimizedCode, 'optimized.svg')}
            >
              <DownloadIcon className="h-4 w-4" />
              Download {activeTab === 'original' ? 'Original' : 'Optimized'} SVG
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => handleCopy(activeTab === 'original' ? svgCode : optimizedCode)}
            >
              <CopyIcon className="h-4 w-4" />
              Copy {activeTab === 'original' ? 'Original' : 'Optimized'} SVG
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
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