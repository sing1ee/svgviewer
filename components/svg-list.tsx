import {Link} from "@/i18n/navigation";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSvgPublicUrl } from "@/lib/r2-client";

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
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-lg font-semibold">
          {category.charAt(0).toUpperCase() + category.slice(1)} SVGs
        </h1>
      </div>
      <ScrollArea className="h-[1000px]">
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {svgFiles.map((file) => {
              const isActive = currentId === file.id;
              const href = `/category/${category}/${file.id}`;
              const svgUrl = getSvgPublicUrl(file.path);
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
                        src={svgUrl}
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