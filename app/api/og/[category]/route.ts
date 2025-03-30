import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    
    // 读取 SVG 模板
    const templatePath = path.join(process.cwd(), 'public', 'og-template.svg');
    let svgContent = await fs.promises.readFile(templatePath, 'utf-8');
    
    // 替换模板中的变量
    svgContent = svgContent
      .replace(/{{category}}/g, category.charAt(0).toUpperCase() + category.slice(1));
    
    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', 'image/svg+xml');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    return new NextResponse(svgContent, {
      headers,
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new NextResponse('Error generating OG image', { status: 500 });
  }
} 