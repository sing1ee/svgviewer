// Note: S3Client types are still imported for upload scripts
// Runtime functions now use fetch instead of S3Client

// Get R2 public URL for fetching files
function getR2PublicUrl(): string {
  if (!process.env.R2_PUBLIC_URL) {
    throw new Error('R2_PUBLIC_URL environment variable is not set');
  }
  // Ensure URL ends with /
  const url = process.env.R2_PUBLIC_URL;
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export interface SvgFile {
  id: string;
  name: string;
  path: string;
  size?: number;
  lastModified?: Date;
}

// 获取指定分类下的所有 SVG 文件
export async function getSvgFiles(category: string): Promise<SvgFile[]> {
  try {
    const publicUrl = getR2PublicUrl();
    const indexUrl = `${publicUrl}/svgs/${category}/${category}_index.json`;
    
    const response = await fetch(indexUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Index file not found for category ${category}: ${indexUrl}`);
        return [];
      }
      throw new Error(`Failed to fetch index: ${response.status} ${response.statusText}`);
    }

    const fileNames: string[] = await response.json();

    if (!Array.isArray(fileNames)) {
      console.error(`Invalid index.json format for category ${category}`);
      return [];
    }

    const svgFiles: SvgFile[] = fileNames
      .filter(fileName => fileName.endsWith('.svg'))
      .map(fileName => {
        const id = fileName.replace('.svg', '');
        const path = `/svgs/${category}/${fileName}`;
        
        return {
          id,
          name: fileName,
          path,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // 按文件名排序

    return svgFiles;
  } catch (error) {
    console.error(`Error fetching SVG files for category ${category}:`, error);
    return [];
  }
}

// 获取单个 SVG 文件内容
export async function getSvgContent(category: string, id: string): Promise<string | null> {
  try {
    const publicUrl = getR2PublicUrl();
    const svgUrl = `${publicUrl}/svgs/${category}/${id}.svg`;
    
    const response = await fetch(svgUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`SVG file not found: ${svgUrl}`);
        return null;
      }
      throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    return content;
  } catch (error) {
    console.error(`Error fetching SVG content for ${category}/${id}:`, error);
    return null;
  }
}

// 获取 SVG 文件的公开 URL
export function getSvgPublicUrl(key: string): string {
  if (process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}${key}`;
  }
  
  // 如果没有公开URL，返回一个占位符
  return `/api/svg?key=${encodeURIComponent(key)}`;
}

// 检查 SVG 文件是否存在
export async function svgExists(category: string, id: string): Promise<boolean> {
  try {
    const publicUrl = getR2PublicUrl();
    const svgUrl = `${publicUrl}/svgs/${category}/${id}.svg`;
    
    const response = await fetch(svgUrl, {
      method: 'HEAD',
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

// 获取 SVG 分类列表
export async function getSvgCategories(): Promise<string[]> {
  try {
    const publicUrl = getR2PublicUrl();
    const indexUrl = `${publicUrl}/svgs/svgs_index.json`;
    
    const response = await fetch(indexUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Categories index file not found: ${indexUrl}`);
        return [];
      }
      throw new Error(`Failed to fetch categories index: ${response.status} ${response.statusText}`);
    }

    const categories: string[] = await response.json();

    if (!Array.isArray(categories)) {
      console.error('Invalid svgs_index.json format');
      return [];
    }

    return categories.sort();
  } catch (error) {
    console.error('Error fetching SVG categories:', error);
    return [];
  }
} 