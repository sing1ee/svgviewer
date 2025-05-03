import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import SvgList from '@/components/svg-list';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/components/svg-converter';
import FaqSection from '@/components/faq-section';

interface Props {
  params: {
    svgCategory: string;
    id: string;
  };
}

// 获取所有 SVG 文件
async function getSvgFiles(category: string) {
  const svgDir = path.join(process.cwd(), 'public', 'svgs', category);
  console.log(svgDir);
  
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

// 获取单个 SVG 文件内容
async function getSvgContent(category: string, id: string) {
  const svgPath = path.join(process.cwd(), 'public', 'svgs', category, `${id}.svg`);
  console.log(svgPath);
  try {
    const content = await fs.promises.readFile(svgPath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}

// 生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function SvgPreviewPage({ params }: Props) {
  const { svgCategory, id } = params;
  const svgFiles = await getSvgFiles(svgCategory);
  const svgContent = await getSvgContent(svgCategory, id);

  if (!svgContent || svgFiles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="w-[90%] mx-auto">
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
                <SvgConverter svgCode={svgContent}/>
              </div>
            </div>
          </div>
          <FaqSection category={svgCategory} />
        </div>
      </main>
      <Footer />
    </div>
  );
} 