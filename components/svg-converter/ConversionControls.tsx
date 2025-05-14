import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DownloadIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversionControlsProps {
  onFormatChange: (format: string) => void;
  onScaleChange: (scale: number) => void;
  onIcoSizeChange: (size: number) => void;
  onFileNameChange: (name: string) => void;
  onDownload: () => void;
  format: string;
  scale: number;
  icoSize: number;
  fileName: string;
  disabled?: boolean;
}

const OUTPUT_FORMATS = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
  { value: 'ico', label: 'ICO' }
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
  onFormatChange,
  onScaleChange,
  onIcoSizeChange,
  onFileNameChange,
  onDownload,
  format,
  scale,
  icoSize,
  fileName,
  disabled
}: ConversionControlsProps) {
  return (
    <div className="flex flex-col gap-4 p-3 bg-card rounded-lg">
      {/* Top Row - Format Selection */}
      <div className="grid grid-cols-5 sm:flex sm:items-center gap-1.5">
        {OUTPUT_FORMATS.map((option) => (
          <Button
            key={option.value}
            variant={format === option.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onFormatChange(option.value)}
            className={cn(
              "w-full h-8 px-2 sm:px-3",
              format === option.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Bottom Row - Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-3">
        {/* Scale/Size Control */}
        {format === 'ico' ? (
          <Select value={icoSize.toString()} onValueChange={(value) => onIcoSizeChange(Number(value))}>
            <SelectTrigger className="h-8 w-[200px]">
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
              onValueChange={(value) => onScaleChange(value[0])}
              className="flex-1 sm:w-32"
            />
            <span className="text-sm text-muted-foreground w-8">{scale}x</span>
          </div>
        )}

        {/* Filename Input */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Input
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="Enter file name"
            className="h-8"
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">.{format}</span>
        </div>

        {/* Download Button */}
        <Button
          variant="default"
          size="sm"
          onClick={onDownload}
          disabled={disabled}
          className="h-8 px-4 whitespace-nowrap"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download as {format.toUpperCase()}
        </Button>
      </div>
    </div>
  );
}