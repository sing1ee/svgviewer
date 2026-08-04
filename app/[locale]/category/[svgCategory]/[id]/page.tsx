import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SvgList from '@/components/svg-list';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';
import { getSvgFiles as fetchSvgFiles, getSvgContent as fetchSvgContent } from '@/lib/r2-client';
import { setRequestLocale } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { localeAlternates } from '@/i18n/locales';

interface Props {
  params: Promise<{
    locale: string;
    svgCategory: string;
    id: string;
  }>;
}

// 生成元数据
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale, svgCategory, id } = params;

  const title = `${svgCategory} SVG: ${id}`;
  const description = `Preview and download the ${id} SVG from our ${svgCategory} collection.`;
  const path = `/category/${svgCategory}/${id}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: locale === 'en' ? path : `/${locale}${path}`,
      languages: localeAlternates(path),
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      site: '@czsinglestar',
      description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function SvgPreviewPage(props: Props) {
  const params = await props.params;
  const { locale, svgCategory, id } = params;

  setRequestLocale(locale);

  const [svgFiles, svgContent] = await Promise.all([
    fetchSvgFiles(svgCategory),
    fetchSvgContent(svgCategory, id),
  ]);

  if (!svgContent || svgFiles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* SVG 列表 */}
            <div className="md:col-span-1">
              <SvgList
                category={svgCategory}
                svgFiles={svgFiles}
                currentId={id}
              />
            </div>

            {/* SVG 预览区域 */}
            <div className="md:col-span-3">
              <div className="relative rounded-lg border bg-card">
                <SvgConverter svgCodeParam={svgContent}/>
              </div>
            </div>
          </div>
      </main>
      <Footer />
    </div>
  );
}
