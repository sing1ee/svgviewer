import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SvgList from '@/components/svg-list';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';
import { getSvgFiles as fetchSvgFiles, getSvgContent as fetchSvgContent } from '@/lib/r2-client';

export const revalidate = 60;
export const dynamic = "force-static";

interface Props {
  params: Promise<{
    svgCategory: string;
    id: string;
  }>;
}

// 这些函数现在由 R2 客户端提供

// 生成元数据
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { svgCategory, id } = params;

  const title = `${svgCategory} SVG: ${id}`;

  return {
    title,
    description: `Preview and download the ${id} SVG from our ${svgCategory} collection.`,
    openGraph: {
      title,
      description: `Preview and download the ${id} SVG from our ${svgCategory} collection.`,
      type: 'website',
      url: `https://svgviewer.app/category/${svgCategory}/${id}`,
      images: [
        { url: `https://svgviewer.app/${svgCategory}-og-image.png` },
      ],
    },
    alternates: {
      canonical: `/category/${svgCategory}/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      site: '@czsinglestar',
      description: `Preview and download the ${id} SVG from our ${svgCategory} collection.`,
      images: [
        { url: `https://svgviewer.app/${svgCategory}-og-image.png` },
      ],
    },
    // robots: {
    //   index: true,
    //   follow: true,
    //   noimageindex: true,
    //   noarchive: true,
    //   nosnippet: true,
    // },
  };
}

export default async function SvgPreviewPage(props: Props) {
  const params = await props.params;
  const { svgCategory, id } = params;
  const svgFiles = await fetchSvgFiles(svgCategory);
  const svgContent = await fetchSvgContent(svgCategory, id);

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

export const runtime = 'edge';