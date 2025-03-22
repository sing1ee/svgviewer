import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
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
  const fullPath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-6">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" title='SVGViewer' className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" title='Blog' className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground">{post.title}</span>
          </nav>
        </div>
        <article className="prose prose-zinc dark:prose-invert max-w-4xl mx-auto">
          <h1>{post.title}</h1>
          <div className="text-muted-foreground mb-8">
            {new Date(post.date).toLocaleDateString('zh-CN')}
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
      </main>

      <Footer />
    </div>
  );
} 