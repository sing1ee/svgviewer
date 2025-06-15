import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import SvgList from '@/components/svg-list';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { siteConfig } from '@/config/site';

interface Props {
  params: Promise<{
    locale: string;
    svgCategory: string;
  }>;
}

// 获取所有 SVG 文件
async function getSvgFiles(category: string) {
  const svgDir = path.join(process.cwd(), 'public', 'svgs', category);
  try {
    const files = await fs.promises.readdir(svgDir);
    return files
      .filter(file => file.endsWith('.svg'))
      .map(file => ({
        id: file.replace('.svg', ''),
        name: file,
        path: `/svgs/${category}/${file}`
      }));
  } catch (error) {
    return [];
  }
}

// 获取默认 SVG 内容
async function getDefaultSvgContent(category: string) {
  const svgFiles = await getSvgFiles(category);
  if (svgFiles.length === 0) return null;
  
  const firstSvg = svgFiles[0];
  const svgPath = path.join(process.cwd(), 'public', firstSvg.path);
  
  try {
    const content = await fs.promises.readFile(svgPath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
    svgCategory
  } = params;

  const t = await getTranslations({ locale, namespace: 'Metadata-svg-category' });

  const title = t('title');
  const description = t('description');
  const ogTitle = t('ogTitle') || title;
  const ogDescription = t('ogDescription') || description;
  const twitterTitle = t('twitterTitle') || title;
  const twitterDescription = t('twitterDescription') || description;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    icons: {
      icon: siteConfig.favicon,
    },
    alternates: {
      canonical: locale === 'en' ? `/category/${svgCategory}` : `/${locale}/category/${svgCategory}`,
      languages: {
        'en': `/category/${svgCategory}`,
        'zh': `/zh/category/${svgCategory}`,
        'zh-TW': `/zh-TW/category/${svgCategory}`,
        'ja': `/ja/category/${svgCategory}`,
        'ru': `/ru/category/${svgCategory}`,
        'pt': `/pt/category/${svgCategory}`,
        'es': `/es/category/${svgCategory}`,
        'ko': `/ko/category/${svgCategory}`,
        'ar': `/ar/category/${svgCategory}`,
        'hi': `/hi/category/${svgCategory}`,
        'fr': `/fr/category/${svgCategory}`,
        'de': `/de/category/${svgCategory}`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
  };
}

export default async function SvgCategoryPage(props: Props) {
  const params = await props.params;

  const {
    locale,
    svgCategory
  } = params;

  setRequestLocale(locale);
  const t = await getTranslations("svgCategory");
  const svgFiles = await getSvgFiles(svgCategory);
  const defaultSvgContent = await getDefaultSvgContent(svgCategory);
  if (svgFiles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* SVG 列表 */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <SvgList 
                  category={svgCategory}
                  svgFiles={svgFiles}
                  currentId={null}
                />
              </div>
            </div>
            
            {/* SVG 预览区域 */}
            <div className="md:col-span-3">
              <div className="relative rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                {defaultSvgContent ? (
                  <SvgConverter svgCodeParam={defaultSvgContent} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <p className="text-foreground/70 text-lg">
                      {t('selectSvg')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
      </main>
      <Footer />
    </div>
  );
} 