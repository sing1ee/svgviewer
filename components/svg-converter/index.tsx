"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, XIcon, ClipboardPasteIcon, AlignJustifyIcon, DownloadIcon, UploadIcon, SparklesIcon } from 'lucide-react';
import CodeEditor from '@/components/code-editor';
import SvgPreview from '@/components/svg-preview';
import { GridBackground } from '@/components/grid-background';
import { beautifySVG } from '@/lib/utils';
import { optimizeSvg } from '@/lib/svg-optimizer';
import ConversionControls from './ConversionControls';
import { homeDefaultSvg } from '@/lib/default-svgs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SvgConverterProps {
  svgCodeParam?: string;
  defaultFormat?: string;
}

export default function SvgConverter({ defaultFormat = 'svg', svgCodeParam }: SvgConverterProps) {
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [svgCode, setSvgCode] = useState<string>(svgCodeParam || homeDefaultSvg);
  
  const { toast } = useToast();

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
    }
  }, [svgCode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "SVG code has been copied to your clipboard",
    });
  };

  const handleFormat = () => {
    const formattedSvg = beautifySVG(svgCode);
    setSvgCode(formattedSvg);
    toast({
      title: "SVG Formatted",
      description: "SVG code has been formatted",
    });
  };

  const handleOptimize = () => {
    const optimizedSvg = optimizeSvg(svgCode);
    setSvgCode(optimizedSvg);
    toast({
      title: "SVG Optimized",
      description: "SVG code has been optimized",
    });
  };

  const handleClear = () => {
    setSvgCode('');
    toast({
      title: "Cleared",
      description: "SVG code has been cleared",
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSvgCode(text);
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

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgCode(content);
        toast({
          title: "SVG uploaded",
          description: "SVG file has been uploaded successfully",
        });
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSvg = () => {
    if (!svgCode) return;
    
    const a = document.createElement('a');
    a.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgCode)}`;
    a.download = `svgviewer.app.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "SVG Downloaded",
      description: "SVG has been downloaded successfully",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card p-4 rounded-lg shadow-sm gradient-border mb-4">
        <ConversionControls
          svgCode={svgCode}
          disabled={!svgCode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">SVG Code</h2>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFormat}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <AlignJustifyIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Format SVG</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleOptimize}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <SparklesIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Optimize SVG</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(svgCode)}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <CopyIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePaste}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <ClipboardPasteIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Paste</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDownloadSvg}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <DownloadIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download SVG</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <label htmlFor="svg-upload" className="cursor-pointer">
                        <UploadIcon className="h-3.5 w-3.5" />
                        <input
                          id="svg-upload"
                          type="file"
                          accept=".svg"
                          className="hidden"
                          onChange={handleUpload}
                        />
                      </label>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload SVG</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex-1 min-h-0 border rounded-lg overflow-hidden shadow-md gradient-border">
            <CodeEditor 
              value={svgCode} 
              onChange={setSvgCode} 
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
            />
          </div>
        </div>
      </div>
    </div>
  );
} 