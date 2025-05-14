import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ''),
  }));
}

async function getPost(slug: string) {
  const fullPath = path.join(process.cwd(), 'posts', `${slug.toLowerCase()}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    title: data.title,
    date: data.date,
    description: data.description,
    contentHtml,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://svgviewer.app/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    alternates: {
      canonical: `https://svgviewer.app/blog/${params.slug}`,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link href="/" title='SVGViewer' className="text-foreground/70 hover:text-primary transition-all duration-300">
              Home
            </Link>
            <span className="text-foreground/40">/</span>
            <Link href="/blog" title='Blog' className="text-foreground/70 hover:text-primary transition-all duration-300">
              Blog
            </Link>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground/90">{post.title}</span>
          </nav>

          {/* Article Content */}
          <article className="prose prose-zinc dark:prose-invert max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-sm border border-border/40">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {post.title}
              </h1>
              <div className="text-foreground/60 mb-8 text-sm">
                {new Date(post.date).toLocaleDateString('zh-CN')}
              </div>
              <div 
                className="prose-headings:text-foreground/90 prose-p:text-foreground/70 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground/90 prose-code:text-primary prose-pre:bg-background/50 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
              />
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
} 