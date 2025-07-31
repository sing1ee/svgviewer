"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CopyIcon, XIcon, ClipboardPasteIcon, AlignJustifyIcon, DownloadIcon, UploadIcon, SparklesIcon, ShareIcon } from 'lucide-react';
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
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
interface SvgConverterProps {
  svgCodeParam?: string;
  defaultFormat?: string;
}

export default function SvgConverter({ defaultFormat = 'svg', svgCodeParam }: SvgConverterProps) {
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [svgCode, setSvgCode] = useState<string>(svgCodeParam || homeDefaultSvg);
  const t = useTranslations('svgConverter');
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    if (svgCode) {
      setOriginalSize(new Blob([svgCode]).size);
    }
  }, [svgCode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('copiedToClipboard'),
      description: t('copiedToClipboardDescription'),
    });
  };

  const handleFormat = () => {
    const formattedSvg = beautifySVG(svgCode);
    setSvgCode(formattedSvg);
    toast({
      title: t('formattedSvg'),
      description: t('formattedSvgDescription'),
    });
  };

  const handleOptimize = () => {
    const optimizedSvg = optimizeSvg(svgCode);
    setSvgCode(optimizedSvg);
    toast({
      title: t('optimizedSvg'),
      description: t('optimizedSvgDescription'),
    });
  };

  const handleClear = () => {
    setSvgCode('');
    toast({
      title: t('cleared'),
      description: t('clearedDescription'),
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSvgCode(text);
      toast({
        title: t('pastedFromClipboard'),
        description: t('pastedFromClipboardDescription'),
      });
    } catch (error) {
      toast({
        title: t('pasteFailed'),
        description: t('pasteFailedDescription'),
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
          title: t('uploaded'),
          description: t('uploadedDescription'),
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
      title: t('downloaded'),
      description: t('downloadedDescription'),
    });
  };

  const handleShare = () => {
    if (!svgCode) return;
    
    try {
      // 将SVG代码转换为base64编码
      const encodedSvg = btoa(encodeURIComponent(svgCode));
      // 构建分享链接
      const baseUrl = window.location.origin;
      const pathSegments = pathname.split('/').filter(Boolean);
      const firstSegment = pathSegments[0];
      
      // 检查第一个路径段是否为有效的 locale
      const isValidLocale = routing.locales.includes(firstSegment as any);
      const currentLocale = isValidLocale ? firstSegment : null;
      
      // 检查当前是否已经在 share 页面
      const isOnSharePage = pathSegments.includes('share');
      
      let shareUrl;
      if (isOnSharePage) {
        // 如果已经在 share 页面，直接更新 URL 参数
        shareUrl = `${baseUrl}${pathname.split('?')[0]}?code=${encodedSvg}`;
      } else {
        // 如果不在 share 页面，构建新的 share URL
        shareUrl = currentLocale && currentLocale !== 'en'
          ? `${baseUrl}/${currentLocale}/share?code=${encodedSvg}`
          : `${baseUrl}/share?code=${encodedSvg}`;
      }
      
      // 复制链接到剪贴板
      navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: t('shareLinkCopied'),
        description: t('shareLinkCopiedDescription'),
      });
    } catch (error) {
      console.error('Failed to create share link:', error);
      toast({
        title: t('pasteFailed'),
        description: t('pasteFailedDescription'),
        variant: "destructive",
      });
    }
   };

  return (
    <div className="h-full flex flex-col">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">{t('svgCode')}</h2>
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
                    <p>{t('formatSvg')}</p>
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
                    <p>{t('optimizeSvg')}</p>
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
                    <p>{t('clear')}</p>
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
                    <p>{t('copy')}</p>
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
                    <p>{t('paste')}</p>
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
                    <p>{t('downloadSvg')}</p>
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
                    <p>{t('uploadSvg')}</p>
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
            <h2 className="text-xl font-semibold">{t('preview')}</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t('size')}: {originalSize} bytes</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      disabled={!svgCode}
                      className="hover:bg-primary/10 h-7 px-2"
                    >
                      <ShareIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('share')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
      <ConversionControls
          svgCode={svgCode}
          disabled={!svgCode}
        />
    </div>
  );
}