"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { FileIcon, CopyIcon, DownloadIcon, UploadIcon, ZapIcon, Code2Icon, ImageIcon, MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { optimizeSvg } from '@/lib/svg-optimizer';
import NextImage from 'next/image';
import { GridBackground } from '@/components/grid-background';
import Head from 'next/head';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from '@/components/mobile-nav';

export default function Home() {
  const [svgCode, setSvgCode] = useState<string>('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">\n  <rect width="400" height="400" rx="200" fill="#2563eb"/>\n  <circle cx="200" cy="200" r="80" fill="black"/>\n  <rect x="240" y="240" width="120" height="120" rx="20" fill="white" transform="rotate(-45 240 240)"/>\n</svg>');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [optimizedCode, setOptimizedCode] = useState<string>('');
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 400, height: 400 });
  const [zoom, setZoom] = useState<number>(100);
  const [mobileView, setMobileView] = useState<'code' | 'preview'>('preview');
  
  const { toast } = useToast();

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
      const optimized = optimizeSvg(svgCode);
      setOptimizedCode(optimized);
      setOptimizedSize(new Blob([optimized]).size);
    }
  }, [svgCode]);

  useEffect(() => {
    // Add viewport resize listener to adjust UI for mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Default to preview on small screens
        setMobileView('preview');
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    toast({
      title: "Cleared",
      description: "SVG code has been cleared",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Head>
        <title>SVG Viewer - Free Online Tool to View and Edit SVG Files</title>
        <meta name="description" content="Free online SVG viewer tool to view, edit, optimize and convert SVG files. Our SVG viewer helps you visualize and manipulate SVG code in real-time." />
        <meta name="keywords" content="svg viewer, svg editor, svg optimizer, svg converter, svg code, svg online tool" />
        <meta property="og:title" content="SVG Viewer - Free Online Tool to View and Edit SVG Files" />
        <meta property="og:description" content="Free online SVG viewer tool to view, edit, optimize and convert SVG files. Our SVG viewer helps you visualize and manipulate SVG code in real-time." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://svgviewer.app" />
        <meta property="og:image" content="https://svgviewer.app/og-image.png" />
        <link rel="canonical" href="https://svgviewer.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <header className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={32} height={32} className="rounded-md" />
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVGViewer</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Viewer
            </Link>
            <Link href="/svg-optimizer" className="text-sm font-medium hover:text-primary transition-colors">
              Optimizer
            </Link>
            <Link href="/svg-converter" className="text-sm font-medium hover:text-primary transition-colors">
              Converter
            </Link>
          </nav>
          
          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-8.5rem)]">
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
              <Button
                variant="outline"
                className="gap-2 shadow-sm text-sm h-9"
                onClick={() => handleDownload(svgCode, 'download.svg')}
              >
                <DownloadIcon className="h-4 w-4" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mt-3 md:mt-0 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Zoom:</span>
                <Slider
                  value={[zoom]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={(value) => setZoom(value[0])}
                  className="w-full md:w-32"
                />
                <span className="text-sm w-12">{zoom}%</span>
              </div>
            </div>
          </div>

          {/* Mobile View Switcher */}
          {/* <div className="md:hidden mb-2">
            <Tabs defaultValue={mobileView} onValueChange={(value) => setMobileView(value as 'code' | 'preview')} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div> */}

          {/* 使用响应式布局 */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Code Editor */}
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">SVG Code</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="hover:bg-primary/10"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(svgCode)}
                    className="hover:bg-primary/10"
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden flex-1 min-h-0 shadow-md gradient-border">
                <CodeEditor value={svgCode} onChange={setSvgCode} />
              </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Size: {originalSize} bytes</span>
                  {optimizedSize !== originalSize && (
                    <span className={`ml-2 ${optimizedSize < originalSize ? 'text-green-500' : 'text-red-500'}`}>
                      ({optimizedSize < originalSize ? '-' : '+'}
                      {Math.abs(Math.round((1 - optimizedSize / originalSize) * 100))}%)
                    </span>
                  )}
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

          <div className="flex flex-wrap gap-3 justify-center my-6">
            <Button variant="default" className="gap-2 shadow-md text-sm h-9" onClick={() => handleDownload(svgCode, 'download.svg')}>
              <DownloadIcon className="h-4 w-4" />
              Download SVG
            </Button>
            <Button variant="outline" className="gap-2 shadow-sm text-sm h-9" onClick={() => handleCopy(svgCode)}>
              <CopyIcon className="h-4 w-4" />
              Copy SVG
            </Button>
            <Button asChild variant="outline" className="gap-2 shadow-sm text-sm h-9">
              <Link href="/svg-optimizer">
                <ZapIcon className="h-4 w-4" />
                Optimize SVG
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 shadow-sm text-sm h-9">
              <Link href="/svg-converter">
                <ImageIcon className="h-4 w-4" />
                Convert SVG
              </Link>
            </Button>
          </div>
        </div>
        
        {/* SVG Viewer FAQ Section */}
        <section className="my-8 md:my-16 bg-card p-6 md:p-8 rounded-xl shadow-lg gradient-border">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">SVG Viewer FAQ</h2>
          <p className="mb-6 md:mb-8 text-center text-base md:text-lg max-w-3xl mx-auto text-muted-foreground">
            Our SVG viewer tool is designed to help you work with SVG files efficiently. The SVG viewer allows you to visualize, edit, and optimize your SVG graphics in real-time.
          </p>
          
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">SVG Viewer Frequently Asked Questions</h3>
            
            <Accordion type="single" collapsible className="w-full mb-8 md:mb-12">
              <AccordionItem value="item-1" className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-medium">What is an SVG viewer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  An SVG viewer is a tool that allows you to open, view, and interact with SVG (Scalable Vector Graphics) files. Our online SVG viewer provides a convenient way to visualize SVG code without installing any software. With our SVG viewer, you can see how your SVG looks, edit the code, and optimize it for better performance.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-medium">How do I use this SVG viewer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Using our SVG viewer is simple: paste your SVG code into the editor or upload an SVG file. The SVG viewer will instantly render the graphic in the preview panel. You can edit the code in real-time and see the changes immediately in the SVG viewer preview. Adjust the canvas size and zoom level to get a better view of your SVG.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-medium">Can I edit SVG files with this SVG viewer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, our SVG viewer includes a code editor that allows you to modify the SVG code directly. As you type, the SVG viewer updates the preview in real-time. This makes our SVG viewer perfect for quick edits and adjustments to your SVG files without needing specialized graphic design software.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-medium">Is this SVG viewer free to use?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, our SVG viewer is completely free to use. You can use the SVG viewer to open, view, edit, and download SVG files without any cost. The SVG viewer works directly in your browser, so there's no need to download or install any software.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-medium">Can I optimize SVG files with this SVG viewer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  While our main SVG viewer focuses on viewing and editing, we also offer an SVG optimizer tool that works alongside the SVG viewer. The optimizer can reduce the file size of your SVG while maintaining visual quality. The SVG viewer shows you both the original and optimized file sizes so you can see the difference.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-medium">How does the SVG viewer handle large files?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our SVG viewer is designed to handle SVG files of various sizes efficiently. However, very complex SVGs with thousands of elements might affect performance. The SVG viewer provides zoom and canvas size controls to help you work with SVGs of any dimension.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-base md:text-lg font-medium">Can I convert SVGs to other formats with this SVG viewer?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  While the primary SVG viewer focuses on viewing and editing SVGs, we offer a companion SVG converter tool. From the SVG viewer, you can easily navigate to our converter to transform your SVG files into formats like PNG, JPG, or PDF after previewing them in the SVG viewer.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="border-b">
                <AccordionTrigger className="text-base md:text-lg font-medium">How can this SVG viewer help with AI-generated SVG code?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  With the rise of AI assistants like ChatGPT, Claude, and DeepSeek, more users are generating SVG code through AI. Our SVG viewer is the perfect companion tool for AI-generated SVGs, allowing you to instantly visualize, refine, and optimize code produced by AI. The SVG viewer helps bridge the gap between AI generation and production-ready graphics by providing real-time feedback on how the SVG actually renders, helping you spot and fix any issues in the AI-generated code. As AI continues to evolve in generating more complex vector graphics, our SVG viewer remains an essential tool for working with these AI outputs effectively.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">SVG Viewer Key Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-4">
              <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">Real-time SVG Viewer</h4>
                <p className="text-muted-foreground text-sm md:text-base">See your SVG changes instantly with our responsive SVG viewer that updates as you type.</p>
              </div>
              <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">Code Highlighting</h4>
                <p className="text-muted-foreground text-sm md:text-base">Our SVG viewer includes syntax highlighting to make editing SVG code easier and more intuitive.</p>
              </div>
              <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">Size Optimization</h4>
                <p className="text-muted-foreground text-sm md:text-base">The SVG viewer shows you file size information and optimization potential for your SVGs.</p>
              </div>
              <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">Adjustable Canvas</h4>
                <p className="text-muted-foreground text-sm md:text-base">Our SVG viewer lets you customize the canvas size and zoom level for perfect visualization.</p>
              </div>
              <div className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-lg md:text-xl mb-2 md:mb-3 text-primary">AI SVG Support</h4>
                <p className="text-muted-foreground text-sm md:text-base">Specially optimized for working with AI-generated SVG code from tools like ChatGPT, Claude, and DeepSeek.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-4 md:py-6 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <NextImage src="/logo.png" alt="SVGViewer Logo" width={28} height={28} className="rounded-md" />
              <span className="font-poppins font-bold text-xl">SVGViewer</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Viewer
              </Link>
              <Link href="/svg-optimizer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Optimizer
              </Link>
              <Link href="/svg-converter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Converter
              </Link>
              <a href="/privacy.html" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="/terms.html" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
            </div>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} SVGViewer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}