"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';

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
  const pathname = usePathname();

  const handleDownload = async (svgPath: string, fileName: string) => {
    try {
      const response = await fetch(svgPath);
      const svgContent = await response.text();
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading SVG:', error);
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          {category.charAt(0).toUpperCase() + category.slice(1)} SVGs
        </h2>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="p-4 space-y-2">
          {svgFiles.map((file) => {
            const isActive = currentId === file.id;
            const href = `/category/${category}/${file.id}`;

            return (
              <div
                key={file.id}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-lg hover:bg-accent",
                  isActive && "bg-accent"
                )}
              >
                <Link
                  href={href}
                  className={cn(
                    "flex-1 truncate text-sm",
                    isActive ? "font-medium" : "text-muted-foreground"
                  )}
                >
                  {file.name}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  onClick={() => handleDownload(file.path, file.name)}
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
} 