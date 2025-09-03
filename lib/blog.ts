import postsIndex from '@/posts/index.json';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export interface BlogIndex {
  generated: string;
  count: number;
  posts: BlogPost[];
}

/**
 * 获取所有博客文章
 * @returns 按日期降序排列的博客文章数组
 */
export function getAllPosts(): BlogPost[] {
  return postsIndex.posts;
}

/**
 * 根据 slug 获取单个博客文章
 * @param slug 博客文章的 slug
 * @returns 博客文章对象，如果未找到则返回 undefined
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return postsIndex.posts.find(post => post.slug === slug);
}

/**
 * 获取博客索引信息
 * @returns 包含生成时间和文章数量的索引信息
 */
export function getBlogIndexInfo(): Pick<BlogIndex, 'generated' | 'count'> {
  return {
    generated: postsIndex.generated,
    count: postsIndex.count,
  };
}

/**
 * 获取所有博客的 slug，用于静态路由生成
 * @returns slug 数组
 */
export function getAllPostSlugs(): string[] {
  return postsIndex.posts.map(post => post.slug);
}

/**
 * 检查博客文章是否存在
 * @param slug 博客文章的 slug
 * @returns 是否存在该博客文章
 */
export function postExists(slug: string): boolean {
  return postsIndex.posts.some(post => post.slug === slug);
}

/**
 * 获取最新的 N 篇博客文章
 * @param count 要获取的文章数量
 * @returns 最新的博客文章数组
 */
export function getLatestPosts(count: number): BlogPost[] {
  return postsIndex.posts.slice(0, count);
}

/**
 * 根据关键词搜索博客文章
 * @param keyword 搜索关键词
 * @returns 匹配的博客文章数组
 */
export function searchPosts(keyword: string): BlogPost[] {
  const lowerKeyword = keyword.toLowerCase();
  return postsIndex.posts.filter(post => 
    post.title.toLowerCase().includes(lowerKeyword) ||
    post.description.toLowerCase().includes(lowerKeyword)
  );
}
