import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DownloadIcon } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('svgConverter');
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
    if (!svgCode) return null;

    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '0';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      // 用 DOMParser 解析，避免 innerHTML 执行内联事件处理器（与预览组件保持一致）
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG markup');
      }

      const svgElement = svgDoc.documentElement;
      if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
        throw new Error('No SVG element found');
      }

      // 移除脚本节点与内联事件属性，避免渲染时执行
      svgElement.querySelectorAll('script').forEach(el => el.remove());
      const stripEventAttrs = (el: Element) => {
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
        });
      };
      stripEventAttrs(svgElement);
      svgElement.querySelectorAll('*').forEach(stripEventAttrs);

      // 解析固有尺寸：优先 width/height，回退 viewBox；都缺失则报错，避免 NaN 输出空白图
      const widthAttr = svgElement.getAttribute('width') || '';
      const heightAttr = svgElement.getAttribute('height') || '';
      let svgWidth = widthAttr && !widthAttr.includes('%') ? parseFloat(widthAttr) : 0;
      let svgHeight = heightAttr && !heightAttr.includes('%') ? parseFloat(heightAttr) : 0;

      if (!svgWidth || !svgHeight) {
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          // 兼容逗号分隔与多空格的情况
          const parts = viewBox.split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts.every(n => !Number.isNaN(n))) {
            svgWidth = parts[2];
            svgHeight = parts[3];
          }
        }
      }
      if (!svgWidth || !svgHeight) {
        throw new Error('SVG has no intrinsic size');
      }

      const outputWidth = format === 'ico' ? icoSize : svgWidth * scale;
      const outputHeight = format === 'ico' ? icoSize : svgHeight * scale;

      svgElement.setAttribute('width', outputWidth.toString());
      svgElement.setAttribute('height', outputHeight.toString());
      tempDiv.appendChild(svgElement);

      // 注意：不要传 x/y —— html2canvas 会把目标元素自身的位置（-9999）加到 x/y 上，
      // 传入偏移会导致渲染原点偏移两倍，输出空白图
      // scale 固定为 1：输出像素即 svgWidth * scale，避免与滑块倍率叠加导致实际尺寸翻倍
      const canvas = await html2canvas(tempDiv, {
        width: outputWidth,
        height: outputHeight,
        scale: 1,
        useCORS: true,
        // JPEG 无 alpha 通道，透明像素会合成到黑色上，因此给白底；其余格式保留透明
        backgroundColor: format === 'jpeg' ? '#ffffff' : null,
        logging: false,
      });

      return format === 'ico'
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.error('Error converting SVG:', error);
      toast({
        title: t('conversionFailed'),
        description: t('conversionFailedDescription'),
        variant: "destructive",
      });
      return null;
    } finally {
      // 任何路径都清理临时节点，避免失败时离屏 div 泄漏累积
      document.body.removeChild(tempDiv);
    }
  };

  const handleDownload = async (format: string) => {
    if (!svgCode) return;

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
        // AND mask：1 bit/像素，每行按 4 字节边界对齐（16/48 等非 32 倍数尺寸必须补齐）
        const andMaskRowBytes = Math.ceil(icoSize / 32) * 4;
        const andMaskSize = andMaskRowBytes * icoSize;
        const bmpDataSize = bmpInfoHeaderSize + pixelDataSize + andMaskSize;

        const bmpData = new ArrayBuffer(bmpDataSize);
        const bmpView = new DataView(bmpData);

        bmpView.setUint32(0, bmpInfoHeaderSize, true);
        bmpView.setInt32(4, icoSize, true);
        bmpView.setInt32(8, icoSize * 2, true);
        bmpView.setUint16(12, 1, true);
        bmpView.setUint16(14, bitsPerPixel, true);
        bmpView.setUint32(16, 0, true);
        bmpView.setUint32(20, pixelDataSize + andMaskSize, true);
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

        // AND mask：与 XOR 数据同样自底向上排列；alpha < 128 的像素置为透明（bit=1），
        // 否则旧解码器会把透明区域显示成黑色不透明块
        const andMaskOffset = bmpInfoHeaderSize + pixelDataSize;
        for (let y = 0; y < icoSize; y++) {
          const rowStart = andMaskOffset + (icoSize - y - 1) * andMaskRowBytes;
          for (let x = 0; x < icoSize; x++) {
            const srcIdx = (y * icoSize + x) * 4;
            if (imageData.data[srcIdx + 3] < 128) {
              const byteIdx = rowStart + (x >> 3);
              bmpView.setUint8(byteIdx, bmpView.getUint8(byteIdx) | (0x80 >> (x & 7)));
            }
          }
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
        a.download = `${fileNames[format] ?? format}.ico`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: t('icoDownloaded'),
          description: t('icoDownloadedDescription'),
        });
      } catch (error) {
        console.error("ICO format conversion failed:", error);
        toast({
          title: t('conversionFailed'),
          description: t('conversionFailedDescription'),
          variant: "destructive",
        });
      }
      return;
    }

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${fileNames[format] ?? format}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: t('imageDownloaded'),
      description: t('imageDownloadedDescription', { format: format.toUpperCase() }),
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {OUTPUT_FORMATS.map((option) => {
        const isIco = option.value === 'ico';

        return (
          <div
            key={option.value}
            className="flex flex-col gap-4 p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Format Header */}
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <h3 className="font-medium text-lg text-foreground/90">{option.label}</h3>
            </div>

            {/* Format Specific Controls */}
            <div className="flex flex-col gap-4">
              {isIco ? (
                <Select
                  value={icoSize.toString()}
                  onValueChange={(value) => setIcoSize(Number(value))}
                >
                  <SelectTrigger className="h-10 bg-background/50 border-border/40">
                    <SelectValue placeholder={t('selectSize')} />
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
                <div className="flex items-center gap-3">
                  <Slider
                    value={[scale]}
                    min={0.5}
                    max={6}
                    step={0.5}
                    onValueChange={(value) => setScale(value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-foreground/70 w-8">{scale}x</span>
                </div>
              )}

              {/* Filename Input */}
              <div className="flex items-center gap-2">
                <Input
                  value={fileNames[option.value]}
                  onChange={(e) => handleFileNameChange(option.value, e.target.value)}
                  placeholder={t('enterFileName')}
                  className="h-10 bg-background/50 border-border/40"
                />
                <span className="text-sm font-medium text-foreground/70 whitespace-nowrap">.{option.value}</span>
              </div>

              {/* Download Button */}
              <Button
                variant="default"
                size="default"
                onClick={() => handleDownload(option.value)}
                disabled={disabled}
                className="w-full h-10 bg-primary/90 hover:bg-primary transition-colors duration-200"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                {t('download', { format: option.label })}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}