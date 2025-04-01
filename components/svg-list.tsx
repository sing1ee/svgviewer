"use client";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SvgFile {
  id: string;
  name: string;
  path: string;
}

interface SvgListProps {
  category: string;
  svgFiles: SvgFile[];
  currentId: string | null;
}

export default function SvgList({ category, svgFiles, currentId }: SvgListProps) {
  const currentSvg = svgFiles.find(file => file.id === currentId);

  const handleDownload = () => {
    if (!currentSvg) return;
    
    const link = document.createElement('a');
    link.href = currentSvg.path;
    link.download = `${currentSvg.name}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {category.charAt(0).toUpperCase() + category.slice(1)} SVGs
        </h2>
        {currentSvg && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8"
            title="Download SVG"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="h-[1000px]">
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {svgFiles.map((file) => {
              const isActive = currentId === file.id;
              const href = `/category/${category}/${file.id}`;

              return (
                <div
                  key={file.id}
                  className={cn(
                    "group relative flex flex-col items-center p-2 rounded-lg border hover:border-primary transition-colors",
                    isActive && "border-primary bg-accent"
                  )}
                >
                  <Link href={href} className="w-full" title={`${category} SVG: ${file.name}`}>
                    <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center p-1">
                      <img
                        src={file.path}
                        alt={`${category} SVG`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 