"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, DownloadIcon, UploadIcon, ZapIcon, XIcon, ClipboardPasteIcon, AlignJustifyIcon } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { optimizeSvg } from '@/lib/svg-optimizer';
import { GridBackground } from '@/components/grid-background';
import NextImage from 'next/image';
import { MobileNav } from '@/components/mobile-nav';
import OptimizerFaq from '@/components/faq/optimizer-faq';
import { beautifySVG } from '@/lib/utils';
export default function OptimizerPage() {
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

  const handleClear = () => {
    setSvgCode('');
    setOptimizedCode('');
    setOptimizedSize(0);
    toast({
      title: "Cleared",
      description: "SVG code has been cleared",
    });
  };
  const handleFormat = () => {
    setSvgCode(beautifySVG(svgCode));
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" title='SVGViewer' className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={32} height={32} className="rounded-md" />
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVGViewer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" title='SVGViewer' className="text-sm font-medium hover:text-primary transition-colors">
              Viewer
            </Link>
            <Link href="/svg-optimizer" title='SVG Optimizer' className="text-sm font-medium text-primary">
              Optimizer
            </Link>
            <Link href="/svg-converter" title='SVG Converter' className="text-sm font-medium hover:text-primary transition-colors">
              Converter
            </Link>
          </nav>
          <MobileNav />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-8.5rem)]">
        <div className="flex flex-col gap-6 h-full">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG Optimizer</h1>
            <p className="text-muted-foreground text-lg">Reduce your SVG file size while maintaining quality.</p>
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
                onClick={handleOptimize}
              >
                <ZapIcon className="h-4 w-4" />
                Optimize
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

          <div className="flex items-center justify-between bg-card/50 p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">Original:</span> {originalSize} bytes
              </div>
              <div className="text-sm">
                <span className="font-medium">Optimized:</span> {optimizedSize} bytes
              </div>
              {optimizedSize !== originalSize && (
                <div className={`text-sm ${optimizedSize < originalSize ? 'text-green-500' : 'text-red-500'} font-medium`}>
                  {optimizedSize < originalSize ? 'Saved:' : 'Increased:'} {Math.abs(Math.round((1 - optimizedSize / originalSize) * 100))}%
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="optimized">Optimized</TabsTrigger>
            </TabsList>
            <TabsContent value="original" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 flex-1">
              <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Original SVG Code</h2>
                  <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFormat}
                    className="hover:bg-primary/10 h-7 px-2"
                  >
                    <AlignJustifyIcon className="h-3.5 w-3.5 mr-1" />
                    Format
                  </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="hover:bg-primary/10"
                    >
                      <XIcon className="h-3.5 w-3.5 mr-1" />
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(svgCode)}
                      className="hover:bg-primary/10"
                    >
                      <CopyIcon className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePaste}
                      className="hover:bg-primary/10"
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
                  <h2 className="text-xl font-semibold">Original Preview</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Size: {originalSize} bytes</span>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden relative flex-1 flex items-center justify-center shadow-md gradient-border bg-white dark:bg-black">
                  <GridBackground />
                  <SvgPreview 
                    svgCode={svgCode} 
                    zoom={zoom} 
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="optimized" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 flex-1">
              <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Optimized SVG Code</h2>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(optimizedCode)}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <CopyIcon className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden flex-1 shadow-md gradient-border">
                  <CodeEditor value={optimizedCode} onChange={setOptimizedCode} readOnly />
                </div>
              </div>

              <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Optimized Preview</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Size: {optimizedSize} bytes</span>
                    {optimizedSize !== originalSize && (
                      <span className={`ml-2 ${optimizedSize < originalSize ? 'text-green-500' : 'text-red-500'}`}>
                        ({optimizedSize < originalSize ? '-' : '+'}
                        {Math.abs(Math.round((1 - optimizedSize / originalSize) * 100))}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden relative flex-1 flex items-center justify-center shadow-md gradient-border bg-white dark:bg-black">
                  <GridBackground />
                  <SvgPreview 
                    svgCode={optimizedCode} 
                    zoom={zoom} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
            <Button 
              variant="outline" 
              className="gap-2 shadow-sm" 
              onClick={() => handleDownload(activeTab === 'original' ? svgCode : optimizedCode, 'optimized.svg')}
            >
              <DownloadIcon className="h-4 w-4" />
              Download SVG
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 shadow-sm" 
              onClick={() => handleCopy(activeTab === 'original' ? svgCode : optimizedCode)}
            >
              <CopyIcon className="h-4 w-4" />
              Copy SVG
            </Button>
          </div>
        </div>
        
        <OptimizerFaq />
      </main>

      <footer className="border-t py-6 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={28} height={28} className="rounded-md" />
              <span className="font-poppins font-bold text-xl">SVGViewer</span>
            </div>
            <div className="flex gap-8">
              <Link href="/" title='SVGViewer' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Viewer
              </Link>
              <Link href="/svg-optimizer" title='SVG Optimizer' className="text-sm text-primary hover:text-primary transition-colors">
                Optimizer
              </Link>
              <Link href="/svg-converter" title='SVG Converter' className="text-sm text-primary hover:text-primary transition-colors">
                Converter
              </Link>
              <Link href="/blog" title='Blog' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
              <a href="/privacy.html" title='Privacy Policy' className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="/terms.html" title='Terms of Service' className="text-sm text-muted-foreground hover:text-primary transition-colors">
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