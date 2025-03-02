"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import Link from 'next/link';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { GridBackground } from '@/components/grid-background';
import NextImage from 'next/image';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

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
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-8.5rem)]">
        <div className="flex flex-col gap-6 h-full">
          <div className="text-center max-w-3xl mx-auto mb-4">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">SVG Converter</h1>
            <p className="text-muted-foreground text-lg">Convert your SVG files to PNG, JPEG, or WebP formats.</p>
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
                <div className="flex items-center gap-2">
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
              <div className="border rounded-lg overflow-hidden relative flex-1 flex items-center justify-center shadow-md gradient-border bg-white dark:bg-black">
                <GridBackground />
                {format === 'svg' ? (
                  <SvgPreview 
                    svgCode={svgCode} 
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
                        transform: `scale(${zoom / 100})`,
                        transition: 'transform 0.2s ease-out',
                        filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.1))'
                      }} 
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm gradient-border">
            <h2 className="text-xl font-semibold mb-4">Conversion Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
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
                  </SelectContent>
                </Select>
              </div>
              <div>
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
        
        {/* SVG Converter FAQ Section */}
        <section className="my-16 bg-card p-8 rounded-xl shadow-lg gradient-border">
          <h2 className="text-3xl font-bold mb-6 text-center">SVG Converter FAQ</h2>
          <p className="mb-8 text-center text-lg max-w-3xl mx-auto text-muted-foreground">
            Our SVG converter tool allows you to convert SVG files to various image formats including PNG, JPEG, and WebP. The SVG converter maintains high quality while transforming vector graphics to raster images.
          </p>
          
          <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6">SVG Converter Frequently Asked Questions</h3>
            
            <Accordion type="single" collapsible className="w-full mb-12">
              <AccordionItem value="item-1" className="border-b">
                <AccordionTrigger className="text-lg font-medium">What is an SVG converter?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  An SVG converter is a tool that transforms SVG (Scalable Vector Graphics) files into raster image formats like PNG, JPEG, or WebP. Our SVG converter works by rendering the vector graphics and capturing the result as a bitmap image. The SVG converter is essential when you need to use your vector graphics in contexts that don't support SVG format, such as certain social media platforms, older applications, or when specific raster formats are required.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b">
                <AccordionTrigger className="text-lg font-medium">How does this SVG converter work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our SVG converter renders your SVG file in the browser and then captures the output as a raster image. The SVG converter allows you to choose from different output formats (PNG, JPEG, WebP) and set the scale factor to control the resolution of the converted image. Simply paste your SVG code or upload an SVG file, select your desired format and settings, and our SVG converter will generate a high-quality image that you can download.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b">
                <AccordionTrigger className="text-lg font-medium">Why would I need to convert SVG to PNG?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Converting SVG to PNG is useful in many scenarios. PNG supports transparency like SVG but works in environments where SVG isn't supported. Our SVG to PNG converter creates high-quality transparent PNG images that maintain the crispness of your original SVG. The SVG to PNG conversion is perfect for using vector graphics in applications, websites, or platforms that don't support SVG format but do support PNG. Additionally, PNG is widely compatible across all devices and browsers.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b">
                <AccordionTrigger className="text-lg font-medium">When should I convert SVG to JPEG?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Converting SVG to JPEG is ideal when file size is a priority and your image doesn't require transparency. Our SVG to JPEG converter creates compressed images that are perfect for web pages where loading speed is crucial. The SVG to JPEG conversion is particularly useful for photographs or complex illustrations with many colors. Keep in mind that JPEG doesn't support transparency, so any transparent areas in your SVG will be converted to a solid background color.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b">
                <AccordionTrigger className="text-lg font-medium">What are the benefits of converting SVG to WebP?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  WebP is a modern image format that offers superior compression and quality compared to both PNG and JPEG. Our SVG to WebP converter creates images that are typically 25-35% smaller than PNG and JPEG equivalents while maintaining similar visual quality. The SVG to WebP conversion is perfect for web optimization, as WebP supports both lossless compression (like PNG) and transparency, but with much smaller file sizes. Most modern browsers now support WebP, making it an excellent choice for web graphics.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border-b">
                <AccordionTrigger className="text-lg font-medium">Is this SVG converter free to use?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, our SVG converter is completely free to use. You can use the SVG converter to transform as many SVG files as you need to PNG, JPEG, or WebP without any cost. The SVG converter works directly in your browser, so there's no need to download or install any software. Our SVG converter is designed to be accessible to everyone, from professional designers to casual users.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-medium">How do I get the best quality when converting SVG to raster formats?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  To get the best quality when using our SVG converter, adjust the scale factor to create a higher resolution output. For SVG to PNG conversion, a higher scale factor will result in a crisper image, especially important if you plan to display the image at a large size. For SVG to JPEG or SVG to WebP conversion, balance between quality and file size based on your needs. Our SVG converter preview shows you exactly how your converted image will look before you download it.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8" className="border-b">
                <AccordionTrigger className="text-lg font-medium">Can the SVG converter handle complex SVG files?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, our SVG converter is designed to handle SVGs of varying complexity. For complex SVGs with many elements, gradients, or effects, our SVG converter ensures accurate rendering in the output format. The SVG converter may take slightly longer to process very complex files, especially at higher scale factors. For best results with complex SVGs, we recommend using PNG or WebP formats which better preserve fine details compared to JPEG.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <h3 className="text-2xl font-semibold mb-6">SVG Converter Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-xl mb-3 text-primary">Multiple Format Support</h4>
                <p className="text-muted-foreground">Our SVG converter supports conversion to PNG, JPEG, and WebP formats to suit your specific needs.</p>
              </div>
              <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-xl mb-3 text-primary">Adjustable Resolution</h4>
                <p className="text-muted-foreground">Control the quality of your converted images with our SVG converter's scale factor adjustment.</p>
              </div>
              <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-xl mb-3 text-primary">Real-time Preview</h4>
                <p className="text-muted-foreground">See exactly how your converted image will look before downloading with our SVG converter preview.</p>
              </div>
              <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-xl mb-3 text-primary">High-Quality Conversion</h4>
                <p className="text-muted-foreground">Our SVG to PNG, SVG to JPEG, and SVG to WebP conversions maintain excellent visual quality.</p>
              </div>
              <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow gradient-border">
                <h4 className="font-semibold text-xl mb-3 text-primary">Browser-Based Processing</h4>
                <p className="text-muted-foreground">The SVG converter works entirely in your browser - no uploads to servers or privacy concerns.</p>
              </div>
            </div>
          </div>
        </section>
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