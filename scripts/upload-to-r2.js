const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.r2' });

// Cloudflare R2 配置
const r2Config = {
  region: 'auto', // Cloudflare R2 使用 'auto' region
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // 重要：R2 需要路径风格的访问
};

const s3Client = new S3Client(r2Config);
const bucketName = process.env.R2_BUCKET_NAME;
const localSvgDir = path.join(__dirname, '../public/svgs');

// 获取文件的 MIME 类型
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

// 递归获取目录中的所有文件
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// 上传单个文件
async function uploadFile(localFilePath, remoteKey, contentType = null) {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const mimeType = contentType || getMimeType(localFilePath);
    
    const uploadParams = {
      Bucket: bucketName,
      Key: remoteKey,
      Body: fileContent,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000', // 缓存一年
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    console.log(`✅ 上传成功: ${remoteKey}`);
    return true;
  } catch (error) {
    console.error(`❌ 上传失败 ${remoteKey}:`, error.message);
    return false;
  }
}

// 上传 JSON 内容
async function uploadJsonContent(jsonContent, remoteKey) {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Key: remoteKey,
      Body: JSON.stringify(jsonContent, null, 2),
      ContentType: 'application/json',
      CacheControl: 'public, max-age=3600', // 缓存1小时
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    console.log(`✅ 上传成功: ${remoteKey}`);
    return true;
  } catch (error) {
    console.error(`❌ 上传失败 ${remoteKey}:`, error.message);
    return false;
  }
}

// 分页获取桶内所有现有文件 key（一次性拉取，避免逐文件查询）
async function listAllExistingKeys() {
  const keys = new Set();
  let continuationToken;
  do {
    const listParams = {
      Bucket: bucketName,
      Prefix: 'svgs/',
      MaxKeys: 1000,
    };
    if (continuationToken) {
      listParams.ContinuationToken = continuationToken;
    }

    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);

    if (response.Contents) {
      response.Contents.forEach(obj => {
        if (obj.Key) keys.add(obj.Key);
      });
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
  return keys;
}

// 主上传函数
async function uploadSvgFiles(skipExisting = true) {
  console.log('🚀 开始上传 SVG 文件到 Cloudflare R2...');
  console.log(`📁 本地目录: ${localSvgDir}`);
  console.log(`🪣 目标存储桶: ${bucketName}`);
  console.log(`⚙️  跳过已存在文件: ${skipExisting ? '是' : '否'}`);
  console.log('─'.repeat(50));

  if (!fs.existsSync(localSvgDir)) {
    console.error(`❌ 本地目录不存在: ${localSvgDir}`);
    return;
  }

  // 获取所有 SVG 文件
  const allFiles = getAllFiles(localSvgDir);
  const svgFiles = allFiles.filter(file => path.extname(file).toLowerCase() === '.svg');

  if (svgFiles.length === 0) {
    console.log('❌ 没有找到 SVG 文件');
    return;
  }

  console.log(`📊 找到 ${svgFiles.length} 个 SVG 文件`);

  // 一次性获取桶内已有 key，避免对每个文件单独发起查询
  const existingKeys = skipExisting ? await listAllExistingKeys() : new Set();
  if (skipExisting) {
    console.log(`🔍 桶内已有 ${existingKeys.size} 个文件，将跳过已存在的`);
  }

  let uploadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  // 按分类组织文件
  const filesByCategory = {};

  for (const localFilePath of svgFiles) {
    // 生成远程存储的 key（相对路径）
    const relativePath = path.relative(localSvgDir, localFilePath);
    const remoteKey = `svgs/${relativePath.replace(/\\/g, '/')}`; // 确保使用正斜杠

    // 提取分类名称（第一个目录名）
    const pathParts = relativePath.split(path.sep);
    const category = pathParts[0];

    // 初始化分类数组
    if (!filesByCategory[category]) {
      filesByCategory[category] = [];
    }

    // 检查文件是否已存在
    if (skipExisting && existingKeys.has(remoteKey)) {
      console.log(`⏭️  跳过已存在: ${remoteKey}`);
      skippedCount++;
      // 即使跳过上传，也要记录文件名用于生成 index.json
      const fileName = path.basename(relativePath);
      if (!filesByCategory[category].includes(fileName)) {
        filesByCategory[category].push(fileName);
      }
      continue;
    }

    // 上传文件
    const success = await uploadFile(localFilePath, remoteKey);
    if (success) {
      uploadedCount++;
      // 记录文件名用于生成 index.json
      const fileName = path.basename(relativePath);
      if (!filesByCategory[category].includes(fileName)) {
        filesByCategory[category].push(fileName);
      }
    } else {
      failedCount++;
    }

    // 添加小延迟避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('─'.repeat(50));
  console.log('📈 SVG 文件上传统计:');
  console.log(`✅ 成功上传: ${uploadedCount} 个文件`);
  console.log(`⏭️  跳过文件: ${skippedCount} 个文件`);
  console.log(`❌ 上传失败: ${failedCount} 个文件`);
  console.log(`📊 总计文件: ${svgFiles.length} 个文件`);

  // 生成并上传每个分类的 index.json
  console.log('─'.repeat(50));
  console.log('📝 开始生成并上传 index.json 文件...');
  
  let indexUploadedCount = 0;
  let indexFailedCount = 0;
  const categories = Object.keys(filesByCategory).sort();

  for (const category of categories) {
    const fileNames = filesByCategory[category]
      .filter(fileName => fileName.endsWith('.svg'))
      .sort();
    
    const indexKey = `svgs/${category}/${category}_index.json`;
    
    const success = await uploadJsonContent(fileNames, indexKey);
    if (success) {
      indexUploadedCount++;
    } else {
      indexFailedCount++;
    }
    
    // 添加小延迟
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 生成并上传总的分类列表 index.json
  if (categories.length > 0) {
    const categoriesIndexKey = 'svgs/svgs_index.json';
    const success = await uploadJsonContent(categories, categoriesIndexKey);
    if (success) {
      indexUploadedCount++;
      console.log(`✅ 上传分类列表索引: ${categoriesIndexKey}`);
    } else {
      indexFailedCount++;
    }
  }

  console.log('─'.repeat(50));
  console.log('📈 Index.json 上传统计:');
  console.log(`✅ 成功上传: ${indexUploadedCount} 个索引文件`);
  console.log(`❌ 上传失败: ${indexFailedCount} 个索引文件`);
  console.log(`📊 分类数量: ${categories.length} 个`);
  
  if (process.env.R2_PUBLIC_URL) {
    console.log('─'.repeat(50));
    console.log(`🌐 文件访问示例: ${process.env.R2_PUBLIC_URL}/svgs/japanese-culture/sakura.svg`);
    console.log(`🌐 索引文件示例: ${process.env.R2_PUBLIC_URL}/svgs/japanese-culture/japanese-culture_index.json`);
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
const forceUpload = args.includes('--force') || args.includes('-f');

// 检查环境变量
if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME || !process.env.R2_ENDPOINT) {
  console.error('❌ 请先配置环境变量在 .env.r2 文件中:');
  console.error('   R2_ACCOUNT_ID');
  console.error('   R2_ACCESS_KEY_ID');
  console.error('   R2_SECRET_ACCESS_KEY');
  console.error('   R2_BUCKET_NAME');
  console.error('   R2_ENDPOINT');
  console.error('   R2_PUBLIC_URL (可选)');
  process.exit(1);
}

// 开始上传
uploadSvgFiles(!forceUpload).catch(error => {
  console.error('❌ 上传过程中发生错误:', error);
  process.exit(1);
}); 