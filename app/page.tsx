"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { FileIcon, CopyIcon, DownloadIcon, UploadIcon, ZapIcon, Code2Icon, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { optimizeSvg } from '@/lib/svg-optimizer';
import NextImage from 'next/image';
import { GridBackground } from '@/components/grid-background';
import Head from 'next/head';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Home() {
  const [svgCode, setSvgCode] = useState<string>('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">\n  <rect width="400" height="400" rx="200" fill="#2563eb"/>\n  <circle cx="200" cy="200" r="80" fill="black"/>\n  <rect x="240" y="240" width="120" height="120" rx="20" fill="white" transform="rotate(-45 240 240)"/>\n</svg>');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [optimizedCode, setOptimizedCode] = useState<string>('');
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 400, height: 400 });
  const [zoom, setZoom] = useState<number>(100);
  
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

  return (
    <div className="min-h-screen flex flex-col">
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
      </Head>

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
            <Link href="/svg-converter" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Converter
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-2 flex flex-col h-[calc(100vh-8.5rem)]">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
            <h1 className="text-2xl font-bold">SVG Viewer</h1>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
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
              <div className="border rounded-md overflow-hidden flex-1 min-h-0">
                <CodeEditor value={svgCode} onChange={setSvgCode} />
              </div>
            </div>

            <div className="flex flex-col gap-2 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Preview</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Size: {originalSize} bytes</span>
                  {optimizedSize !== originalSize && (
                    <span className={`ml-2 ${optimizedSize < originalSize ? 'text-green-500' : 'text-red-500'}`}>
                      ({optimizedSize < originalSize ? '-' : '+'}
                      {Math.abs(Math.round((1 - optimizedSize / originalSize) * 100))}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="border rounded-md overflow-hidden relative flex-1 min-h-0 flex items-center justify-center">
                <GridBackground />
                <SvgPreview 
                  svgCode={svgCode} 
                  width={canvasSize.width} 
                  height={canvasSize.height} 
                  zoom={zoom} 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center my-2 mt-auto">
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
            <Button asChild variant="outline" className="gap-2">
              <Link href="/svg-optimizer">
                <ZapIcon className="h-4 w-4" />
                Optimize SVG
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/svg-converter">
                <ImageIcon className="h-4 w-4" />
                Convert SVG
              </Link>
            </Button>
          </div>
        </div>
        
        {/* SVG Viewer FAQ Section */}
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4">SVG Viewer FAQ</h2>
          <p className="mb-4">Our SVG viewer tool is designed to help you work with SVG files efficiently. The SVG viewer allows you to visualize, edit, and optimize your SVG graphics in real-time.</p>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is an SVG viewer?</AccordionTrigger>
              <AccordionContent>
                An SVG viewer is a tool that allows you to open, view, and interact with SVG (Scalable Vector Graphics) files. Our online SVG viewer provides a convenient way to visualize SVG code without installing any software. With our SVG viewer, you can see how your SVG looks, edit the code, and optimize it for better performance.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I use this SVG viewer?</AccordionTrigger>
              <AccordionContent>
                Using our SVG viewer is simple: paste your SVG code into the editor or upload an SVG file. The SVG viewer will instantly render the graphic in the preview panel. You can edit the code in real-time and see the changes immediately in the SVG viewer preview. Adjust the canvas size and zoom level to get a better view of your SVG.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I edit SVG files with this SVG viewer?</AccordionTrigger>
              <AccordionContent>
                Yes, our SVG viewer includes a code editor that allows you to modify the SVG code directly. As you type, the SVG viewer updates the preview in real-time. This makes our SVG viewer perfect for quick edits and adjustments to your SVG files without needing specialized graphic design software.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Is this SVG viewer free to use?</AccordionTrigger>
              <AccordionContent>
                Yes, our SVG viewer is completely free to use. You can use the SVG viewer to open, view, edit, and download SVG files without any cost. The SVG viewer works directly in your browser, so there's no need to download or install any software.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Can I optimize SVG files with this SVG viewer?</AccordionTrigger>
              <AccordionContent>
                While our main SVG viewer focuses on viewing and editing, we also offer an SVG optimizer tool that works alongside the SVG viewer. The optimizer can reduce the file size of your SVG while maintaining visual quality. The SVG viewer shows you both the original and optimized file sizes so you can see the difference.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>How does the SVG viewer handle large files?</AccordionTrigger>
              <AccordionContent>
                Our SVG viewer is designed to handle SVG files of various sizes efficiently. However, very complex SVGs with thousands of elements might affect performance. The SVG viewer provides zoom and canvas size controls to help you work with SVGs of any dimension.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>Can I convert SVGs to other formats with this SVG viewer?</AccordionTrigger>
              <AccordionContent>
                While the primary SVG viewer focuses on viewing and editing SVGs, we offer a companion SVG converter tool. From the SVG viewer, you can easily navigate to our converter to transform your SVG files into formats like PNG, JPG, or PDF after previewing them in the SVG viewer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Why Choose Our SVG Viewer</h3>
            <p className="mb-4">Our SVG viewer stands out from other SVG viewers with its combination of powerful features and user-friendly interface. The SVG viewer provides real-time preview, code editing, optimization insights, and easy export options all in one place.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-md p-4">
                <h4 className="font-semibold mb-2">Real-time SVG Viewer</h4>
                <p>See your SVG changes instantly with our responsive SVG viewer that updates as you type.</p>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-semibold mb-2">Code Highlighting</h4>
                <p>Our SVG viewer includes syntax highlighting to make editing SVG code easier and more intuitive.</p>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-semibold mb-2">Size Optimization</h4>
                <p>The SVG viewer shows you file size information and optimization potential for your SVGs.</p>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-semibold mb-2">Adjustable Canvas</h4>
                <p>Our SVG viewer lets you customize the canvas size and zoom level for perfect visualization.</p>
              </div>
            </div>
          </div>
        </section>
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