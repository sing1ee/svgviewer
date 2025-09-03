#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * 生成博客文章索引文件
 * 扫描 posts 目录下的所有 .md 文件，提取 frontmatter 数据，
 * 生成 index.json 文件包含所有博客的元信息
 */
function generatePostsIndex() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const outputPath = path.join(postsDirectory, 'index.json');
  
  console.log('📝 开始扫描博客文件...');
  console.log('Posts 目录:', postsDirectory);

  // 检查 posts 目录是否存在
  if (!fs.existsSync(postsDirectory)) {
    console.error('❌ Posts 目录不存在:', postsDirectory);
    process.exit(1);
  }

  try {
    // 读取 posts 目录下的所有文件
    const fileNames = fs.readdirSync(postsDirectory);
    console.log('发现文件:', fileNames);

    // 过滤并处理 .md 文件
    const posts = fileNames
      .filter(fileName => {
        const isMarkdown = fileName.endsWith('.md');
        const isNotIndex = fileName !== 'index.json';
        const isNotReadme = fileName.toLowerCase() !== 'readme.md';
        return isMarkdown && isNotIndex && isNotReadme;
      })
      .map(fileName => {
        console.log(`📄 处理文件: ${fileName}`);
        
        const slug = fileName.replace(/\.md$/, '').toLowerCase();
        const fullPath = path.join(postsDirectory, fileName);
        
        try {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);

          // 验证必需的字段
          if (!data.title) {
            console.warn(`⚠️  文件 ${fileName} 缺少 title 字段`);
          }
          if (!data.date) {
            console.warn(`⚠️  文件 ${fileName} 缺少 date 字段`);
          }
          if (!data.description) {
            console.warn(`⚠️  文件 ${fileName} 缺少 description 字段`);
          }

          const post = {
            slug,
            title: data.title || fileName,
            date: data.date || new Date().toISOString().split('T')[0],
            description: data.description || ''
          };

          console.log(`✅ 成功处理: ${post.title}`);
          return post;
        } catch (error) {
          console.error(`❌ 处理文件 ${fileName} 时出错:`, error.message);
          return null;
        }
      })
      .filter(post => post !== null) // 过滤掉处理失败的文件
      .sort((a, b) => {
        // 按日期降序排列（最新的在前）
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    console.log(`\n📊 统计信息:`);
    console.log(`- 总文件数: ${fileNames.length}`);
    console.log(`- Markdown 文件数: ${fileNames.filter(f => f.endsWith('.md')).length}`);
    console.log(`- 成功处理的博客数: ${posts.length}`);

    // 生成 index.json
    const indexData = {
      generated: new Date().toISOString(),
      count: posts.length,
      posts: posts
    };

    // 生成带类型注释的 JSON 内容
    const jsonContent = JSON.stringify(indexData, null, 2);
    
    fs.writeFileSync(outputPath, jsonContent, 'utf8');
    
    console.log(`\n🎉 成功生成博客索引文件!`);
    console.log(`📁 输出路径: ${outputPath}`);
    console.log(`📝 包含 ${posts.length} 篇博客文章`);
    
    // 显示生成的博客列表
    console.log(`\n📚 博客列表:`);
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.date})`);
    });

  } catch (error) {
    console.error('❌ 生成索引文件时出错:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本则执行
if (require.main === module) {
  generatePostsIndex();
}

module.exports = { generatePostsIndex };
