"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, DownloadIcon, UploadIcon, XIcon, ClipboardPasteIcon, AlignJustifyIcon } from 'lucide-react';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { GridBackground } from '@/components/grid-background';
import html2canvas from 'html2canvas';
import { beautifySVG } from '@/lib/utils';

interface SvgConverterProps {
  svgCode: string;
  onSvgCodeChange?: (code: string) => void;
}

export default function SvgConverter({ svgCode, onSvgCodeChange }: SvgConverterProps) {
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(100);
  const [format, setFormat] = useState<string>("png");
  const [scale, setScale] = useState<number>(1);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [icoSize, setIcoSize] = useState<number>(16);
  const [fileName, setFileName] = useState<string>('');
  
  const { toast } = useToast();

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
    }
  }, [svgCode]);

  useEffect(() => {
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "SVG code has been copied to your clipboard",
    });
  };

  const handleFormat = () => {
    onSvgCodeChange?.(beautifySVG(svgCode));
  };

  const handleClear = () => {
    onSvgCodeChange?.('');
    toast({
      title: "Cleared",
      description: "SVG code has been cleared",
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onSvgCodeChange?.(text);
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
      
      if (format === 'ico') {
        outputWidth = icoSize;
        outputHeight = icoSize;
      }
      if (format === 'ico' && icoSize < svgWidth && icoSize < svgHeight) {
        svgElement.setAttribute('width', icoSize.toString());
        svgElement.setAttribute('height', icoSize.toString());
      }

      const canvas = await html2canvas(tempDiv, {
        width: outputWidth,
        height: outputHeight,
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = format === 'ico' 
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL(`image/${format}`);
      
      setDataUrl(dataUrl);

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

  const handleDownloadImage = async () => {
    if (!dataUrl && format !== 'svg') return;

    const downloadFileName = fileName || getDefaultFileName(format, format === 'ico' ? icoSize : undefined);
    
    if (format === 'ico') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = icoSize;
        canvas.height = icoSize;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }
        
        const img = new Image();
        img.src = dataUrl;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        ctx.drawImage(img, 0, 0, icoSize, icoSize);
        
        const imageData = ctx.getImageData(0, 0, icoSize, icoSize);
        
        const bmpInfoHeaderSize = 40;
        const bitsPerPixel = 32;
        const bytesPerPixel = bitsPerPixel / 8;
        
        const pixelDataSize = icoSize * icoSize * bytesPerPixel;
        const bmpDataSize = bmpInfoHeaderSize + pixelDataSize + (icoSize * icoSize / 8);
        
        const bmpData = new ArrayBuffer(bmpDataSize);
        const bmpView = new DataView(bmpData);
        
        bmpView.setUint32(0, bmpInfoHeaderSize, true);
        bmpView.setInt32(4, icoSize, true);
        bmpView.setInt32(8, icoSize * 2, true);
        bmpView.setUint16(12, 1, true);
        bmpView.setUint16(14, bitsPerPixel, true);
        bmpView.setUint32(16, 0, true);
        bmpView.setUint32(20, pixelDataSize, true);
        bmpView.setInt32(24, 0, true);
        bmpView.setInt32(28, 0, true);
        bmpView.setUint32(32, 0, true);
        bmpView.setUint32(36, 0, true);
        
        for (let y = 0; y < icoSize; y++) {
          for (let x = 0; x < icoSize; x++) {
            const srcIdx = (y * icoSize + x) * 4;
            const destIdx = bmpInfoHeaderSize + ((icoSize - y - 1) * icoSize + x) * bytesPerPixel;
            
            bmpView.setUint8(destIdx, imageData.data[srcIdx + 2]);
            bmpView.setUint8(destIdx + 1, imageData.data[srcIdx + 1]);
            bmpView.setUint8(destIdx + 2, imageData.data[srcIdx]);
            bmpView.setUint8(destIdx + 3, imageData.data[srcIdx + 3]);
          }
        }
        
        const andMaskOffset = bmpInfoHeaderSize + pixelDataSize;
        const andMaskSize = icoSize * icoSize / 8;
        for (let i = 0; i < andMaskSize; i++) {
          bmpView.setUint8(andMaskOffset + i, 0);
        }
        
        const iconHeaderSize = 6;
        const iconDirEntrySize = 16;
        const iconDirSize = iconHeaderSize + iconDirEntrySize;
        
        const iconData = new ArrayBuffer(iconDirSize + bmpDataSize);
        const iconView = new DataView(iconData);
        
        iconView.setUint16(0, 0, true);
        iconView.setUint16(2, 1, true);
        iconView.setUint16(4, 1, true);
        
        iconView.setUint8(6, icoSize >= 256 ? 0 : icoSize);
        iconView.setUint8(7, icoSize >= 256 ? 0 : icoSize);
        iconView.setUint8(8, 0);
        iconView.setUint8(9, 0);
        iconView.setUint16(10, 1, true);
        iconView.setUint16(12, bitsPerPixel, true);
        iconView.setUint32(14, bmpDataSize, true);
        iconView.setUint32(18, iconDirSize, true);
        
        new Uint8Array(iconData, iconDirSize).set(new Uint8Array(bmpData));
        
        const blob = new Blob([iconData], { type: 'image/x-icon' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${downloadFileName}.ico`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "ico downloaded",
          description: "SVG has been converted to ICO format and downloaded",
        });
      } catch (error) {
        console.error("ICO format conversion failed:", error);
        toast({
          title: "Conversion failed",
          description: "Failed to convert to ICO format",
          variant: "destructive",
        });
      }
      return;
    }
    
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

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card p-4 rounded-lg shadow-sm gradient-border mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-muted-foreground">Output Format</label>
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
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-muted-foreground">Icon Size</label>
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
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-muted-foreground">Scale Factor</label>
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
          
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-muted-foreground">File Name</label>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">SVG Code</h2>
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
          <div className="flex-1 min-h-0 border rounded-lg overflow-hidden shadow-md gradient-border">
            <CodeEditor 
              value={svgCode} 
              onChange={onSvgCodeChange || (() => {})} 
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Preview</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Size: {originalSize} bytes</span>
            </div>
          </div>
          <div className="flex-1 min-h-0 border rounded-lg overflow-hidden relative flex items-center justify-center shadow-md gradient-border bg-white dark:bg-black">
            <GridBackground />
            <SvgPreview 
              svgCode={svgCode} 
              zoom={zoom} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 