import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SVG Blog - Tutorials on SVG',
  description: 'Learn about SVG files, optimization techniques, best practices, and more with our comprehensive blog articles and tutorials.',
  keywords: 'svg blog, svg tutorials, svg articles, vector graphics tips, svg coding, svg design',
  openGraph: {
    title: 'SVG Blog - Articles and Tutorials on SVG',
    description: 'Learn about SVG files, optimization techniques, best practices, and more with our comprehensive blog articles and tutorials.',
    url: 'https://svgviewer.app/blog',
    images: [
      {
        url: 'https://svgviewer.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SVG Blog',
      }
    ],
  },
  alternates: {
    canonical: 'https://svgviewer.app/blog',
  },
};

interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
}

function getPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '').toLowerCase();
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Learn about SVG files, optimization techniques, best practices, and more with our comprehensive blog articles and tutorials.
            </p>
          </div>
          
          <div className="grid gap-8">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} title={post.title}>
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
                      Read more
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