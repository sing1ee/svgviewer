import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 配置
const r2Config = {
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
};

const s3Client = new S3Client(r2Config);
const bucketName = process.env.R2_BUCKET_NAME!;

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
    const listParams = {
      Bucket: bucketName,
      Prefix: `svgs/${category}/`,
      Delimiter: '/', // 只获取当前目录下的文件，不递归子目录
    };

    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);

    if (!response.Contents) {
      return [];
    }

    const svgFiles = response.Contents
      .filter(obj => obj.Key && obj.Key.endsWith('.svg'))
      .map(obj => {
        const key = obj.Key!;
        const fileName = key.split('/').pop()!;
        const id = fileName.replace('.svg', '');
        
        return {
          id,
          name: fileName,
          path: `/${key}`, // 返回完整路径，用于R2访问
          size: obj.Size,
          lastModified: obj.LastModified,
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
    const key = `svgs/${category}/${id}.svg`;
    
    const getParams = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(getParams);
    const response = await s3Client.send(command);

    if (!response.Body) {
      return null;
    }

    // 将响应体转换为字符串，处理不同类型的响应体
    const bodyToString = async (body: any): Promise<string> => {
      // 如果是 Buffer 或 Uint8Array
      if (body instanceof Buffer || body instanceof Uint8Array) {
        return body.toString('utf-8');
      }
      
      // 如果是字符串
      if (typeof body === 'string') {
        return body;
      }
      
      // 如果是 Web ReadableStream (Edge Runtime)
      if (body && typeof body.getReader === 'function') {
        const reader = body.getReader();
        const chunks: Uint8Array[] = [];
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
          const buffer = Buffer.concat(chunks);
          return buffer.toString('utf-8');
        } finally {
          reader.releaseLock();
        }
      }
      
      // 如果是 Node.js Readable 流
      if (body && typeof body.on === 'function') {
        const chunks: Uint8Array[] = [];
        
        return new Promise((resolve, reject) => {
          body.on('data', (chunk: Uint8Array) => chunks.push(chunk));
          body.on('error', reject);
          body.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer.toString('utf-8'));
          });
        });
      }
      
      // 最后尝试将其转换为字符串
      return String(body);
    };

    return await bodyToString(response.Body);
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
    const key = `svgs/${category}/${id}.svg`;
    
    const getParams = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(getParams);
    await s3Client.send(command);
    
    return true;
  } catch (error) {
    return false;
  }
}

// 获取 SVG 分类列表
export async function getSvgCategories(): Promise<string[]> {
  try {
    const listParams = {
      Bucket: bucketName,
      Prefix: 'svgs/',
      Delimiter: '/',
    };

    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);

    if (!response.CommonPrefixes) {
      return [];
    }

    const categories = response.CommonPrefixes
      .map(prefix => {
        const key = prefix.Prefix!;
        // 提取分类名称：svgs/category/ -> category
        return key.replace('svgs/', '').replace('/', '');
      })
      .filter(category => category.length > 0)
      .sort();

    return categories;
  } catch (error) {
    console.error('Error fetching SVG categories:', error);
    return [];
  }
} 