import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import SvgList from '@/components/svg-list';
import { GridBackground } from '@/components/grid-background';
import Header from '@/components/header';
import Footer from '@/components/footer';
import SvgConverter from '@/app/components/svg-converter';

interface Props {
  params: {
    svgCategory: string;
  };
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

// 生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.svgCategory;
  const title = category.charAt(0).toUpperCase() + category.slice(1) + ' SVG List | SVGViewer';

  return {
    title,
    description: `Browse and preview our collection of ${category} SVGs. Download and use them in your projects.`,
    openGraph: {
      title,
      description: `Browse and preview our collection of ${category} SVGs. Download and use them in your projects.`,
      type: 'website',
    },
  };
}

export default async function SvgCategoryPage({ params }: Props) {
  const category = params.svgCategory;
  const svgFiles = await getSvgFiles(category);
  const defaultSvgContent = await getDefaultSvgContent(category);
  if (svgFiles.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SVG 列表 */}
          <div className="md:col-span-1">
            <SvgList 
              category={category}
              svgFiles={svgFiles}
              currentId={null}
            />
          </div>
          
          {/* SVG 预览区域 */}
          <div className="md:col-span-3">
            <div className="relative h-[600px] rounded-lg border bg-card">
              <GridBackground />
              {defaultSvgContent ? (
                <SvgConverter svgCode={defaultSvgContent} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Select an SVG from the list to preview
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