import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DownloadIcon } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface ConversionControlsProps {
  svgCode: string;
  disabled?: boolean;
}

const OUTPUT_FORMATS = [
  { value: 'png', label: 'PNG', defaultName: 'og-image' },
  { value: 'jpeg', label: 'JPEG', defaultName: 'og-image' },
  { value: 'webp', label: 'WebP', defaultName: 'svgtowebp' },
  { value: 'ico', label: 'ICO', defaultName: 'favicon' }
] as const;

const ICO_SIZES = [
  { value: 16, label: '16x16', description: 'Browser tabs, address bar' },
  { value: 32, label: '32x32', description: 'Taskbar, shortcuts' },
  { value: 48, label: '48x48', description: 'Desktop icons' },
  { value: 64, label: '64x64', description: 'High-resolution displays' },
  { value: 128, label: '128x128', description: 'App icons' },
  { value: 256, label: '256x256', description: 'Modern Windows icons' }
] as const;

export default function ConversionControls({
  svgCode,
  disabled
}: ConversionControlsProps) {
  const { toast } = useToast();
  const [scale, setScale] = useState(1);
  const [icoSize, setIcoSize] = useState(16);
  
  // 为每种格式创建独立的文件名状态
  const [fileNames, setFileNames] = useState<Record<string, string>>(() => {
    const initialNames: Record<string, string> = {};
    OUTPUT_FORMATS.forEach(format => {
      initialNames[format.value] = format.defaultName;
    });
    return initialNames;
  });

  const handleFileNameChange = (format: string, value: string) => {
    setFileNames(prev => ({
      ...prev,
      [format]: value
    }));
  };

  const convertSvgToImage = async (format: string) => {
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
      
      document.body.removeChild(tempDiv);
      return dataUrl;

    } catch (error) {
      console.error('Error converting SVG:', error);
      toast({
        title: "Conversion failed",
        description: "Failed to convert to target format",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleDownload = async (format: string) => {
    if (!svgCode) return;

    if (format === 'svg') {
      const a = document.createElement('a');
      a.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}`;
      a.download = `${fileNames[format]}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "SVG Downloaded",
        description: "SVG has been downloaded successfully",
      });
      return;
    }

    const dataUrl = await convertSvgToImage(format);
    if (!dataUrl) return;

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
        a.download = `${fileNames[format]}.ico`;
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
    a.href = dataUrl;
    a.download = `${fileNames[format]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Image Downloaded",
      description: `SVG has been converted to ${format.toUpperCase()} and downloaded`,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {OUTPUT_FORMATS.map((option) => {
        const isIco = option.value === 'ico';
        
        return (
          <div 
            key={option.value}
            className="flex flex-col gap-3 p-4 rounded-lg border border-border"
          >
            {/* Format Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{option.label}</h3>
            </div>

            {/* Format Specific Controls */}
            <div className="flex flex-col gap-3">
              {isIco ? (
                <Select 
                  value={icoSize.toString()} 
                  onValueChange={(value) => setIcoSize(Number(value))}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICO_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value.toString()}>
                        {size.label} - {size.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Slider
                    value={[scale]}
                    min={0.5}
                    max={3}
                    step={0.5}
                    onValueChange={(value) => setScale(value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-8">{scale}x</span>
                </div>
              )}

              {/* Filename Input */}
              <div className="flex items-center gap-2">
                <Input
                  value={fileNames[option.value]}
                  onChange={(e) => handleFileNameChange(option.value, e.target.value)}
                  placeholder="Enter file name"
                  className="h-8"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">.{option.value}</span>
              </div>

              {/* Download Button */}
              <Button
                variant="default"
                size="sm"
                onClick={() => handleDownload(option.value)}
                disabled={disabled}
                className="w-full h-8"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download {option.label}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}