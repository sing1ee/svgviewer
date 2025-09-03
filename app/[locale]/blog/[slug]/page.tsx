import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import matter from 'gray-matter';
import postsIndex from '@/posts/index.json';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { Link } from '@/i18n/navigation';
import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { siteConfig } from '@/config/site';

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // 使用索引文件生成静态参数，性能更好
  return postsIndex.posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const {
    locale,
    slug
  } = params;

  // 从索引文件中获取博客信息
  const post = postsIndex.posts.find(p => p.slug === slug);
  
  if (!post) {
    // 如果找不到博客文章，返回默认元数据
    const t = await getTranslations({ locale, namespace: 'Metadata-blog' });
    return {
      title: t('title'),
      description: t('description'),
    };
  }

  const t = await getTranslations({ locale, namespace: 'Metadata-blog' });

  const title = post.title;
  const description = post.description;
  const ogTitle = t('ogTitle') || title;
  const ogDescription = description;
  const twitterTitle = t('twitterTitle') || title;
  const twitterDescription = description;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    icons: {
      icon: siteConfig.favicon,
    },
    alternates: {
      canonical: locale === 'en' ? '/blog/${slug}' : `/${locale}/blog/${slug}`,
      languages: {
        'en': `/blog/${slug}`,
        'zh': `/zh/blog/${slug}`,
        'zh-TW': `/zh-TW/blog/${slug}`,
        'ja': `/ja/blog/${slug}`,
        'ru': `/ru/blog/${slug}`,
        'pt': `/pt/blog/${slug}`,
        'es': `/es/blog/${slug}`,
        'ko': `/ko/blog/${slug}`,
        'ar': `/ar/blog/${slug}`,
        'hi': `/hi/blog/${slug}`,
        'fr': `/fr/blog/${slug}`,
        'de': `/de/blog/${slug}`,
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

export default async function BlogPost(props: Props) {
  const params = await props.params;

  const {
    locale,
    slug
  } = params;

  const t = await getTranslations({ locale, namespace: 'blog' });
  setRequestLocale(locale);

  // 首先检查博客是否存在于索引中
  const post = postsIndex.posts.find(p => p.slug === slug);
  if (!post) {
    notFound();
  }

  const postsDirectory = path.join(process.cwd(), 'posts');
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(content);
    const contentHtml = processedContent.toString();

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
        <Header />

        <main className="flex-1 container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm mb-8">
              <Link href="/" title='SVGViewer' className="text-foreground/70 hover:text-primary transition-all duration-300">
                {t('home')}
              </Link>
              <span className="text-foreground/40">/</span>
              <Link href="/blog" title='Blog' className="text-foreground/70 hover:text-primary transition-all duration-300">
                {t('blog')}
              </Link>
              <span className="text-foreground/40">/</span>
              <span className="text-foreground/90">{data.title}</span>
            </nav>

            {/* Article Content */}
            <article className="prose prose-zinc dark:prose-invert max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-sm border border-border/40">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {data.title}
                </h1>
                <div className="text-foreground/60 mb-8 text-sm">
                  {new Date(data.date).toLocaleDateString('zh-CN')}
                </div>
                <div 
                  className="prose-headings:text-foreground/90 prose-p:text-foreground/70 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground/90 prose-code:text-primary prose-pre:bg-background/50 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: contentHtml }} 
                />
              </div>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    notFound();
  }
}