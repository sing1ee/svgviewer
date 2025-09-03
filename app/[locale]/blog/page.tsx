import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { getAllPosts, type BlogPost } from '@/lib/blog';

export const runtime = 'edge';

export async function generateMetadata(props: { params: Promise<{ locale: 'en' | 'zh' }> }): Promise<Metadata> {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: 'Metadata-blog' });

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
      canonical: locale === 'en' ? '/blog' : `/${locale}/blog`,
      languages: {
        'en': '/blog',
        'zh': '/zh/blog',
        'zh-TW': '/zh-TW/blog',
        'ja': '/ja/blog',
        'ru': '/ru/blog',
        'pt': '/pt/blog',
        'es': '/es/blog',
        'ko': '/ko/blog',
        'ar': '/ar/blog',
        'hi': '/hi/blog',
        'fr': '/fr/blog',
        'de': '/de/blog',
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


function getPosts(): BlogPost[] {
  try {
    // 使用统一的工具函数获取博客列表
    return getAllPosts();
  } catch (error) {
    console.error('❌ 读取博客索引数据时出错:', error);
    return [];
  }
}

export default async function BlogPage(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = getPosts();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
          
          <div className="grid gap-8">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} locale={locale} title={post.title}>
                <Card className="group hover:shadow-md transition-all duration-300 border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="space-y-2 p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl md:text-2xl font-semibold text-foreground/90 group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-foreground/60 whitespace-nowrap ml-4">
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-foreground/70 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-primary/80 group-hover:text-primary transition-colors duration-300">
                      {t('readMore')}
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}