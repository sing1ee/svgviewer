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
async function uploadFile(localFilePath, remoteKey) {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const mimeType = getMimeType(localFilePath);
    
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

// 检查远程文件是否存在
async function fileExistsInR2(key) {
  try {
    const listParams = {
      Bucket: bucketName,
      Prefix: key,
      MaxKeys: 1,
    };
    
    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);
    
    return response.Contents && response.Contents.some(obj => obj.Key === key);
  } catch (error) {
    return false;
  }
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

  let uploadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const localFilePath of svgFiles) {
    // 生成远程存储的 key（相对路径）
    const relativePath = path.relative(localSvgDir, localFilePath);
    const remoteKey = `svgs/${relativePath.replace(/\\/g, '/')}`; // 确保使用正斜杠

    // 检查文件是否已存在
    if (skipExisting && await fileExistsInR2(remoteKey)) {
      console.log(`⏭️  跳过已存在: ${remoteKey}`);
      skippedCount++;
      continue;
    }

    // 上传文件
    const success = await uploadFile(localFilePath, remoteKey);
    if (success) {
      uploadedCount++;
    } else {
      failedCount++;
    }

    // 添加小延迟避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('─'.repeat(50));
  console.log('📈 上传统计:');
  console.log(`✅ 成功上传: ${uploadedCount} 个文件`);
  console.log(`⏭️  跳过文件: ${skippedCount} 个文件`);
  console.log(`❌ 上传失败: ${failedCount} 个文件`);
  console.log(`📊 总计文件: ${svgFiles.length} 个文件`);
  
  if (process.env.R2_PUBLIC_URL) {
    console.log('─'.repeat(50));
    console.log(`🌐 文件访问示例: ${process.env.R2_PUBLIC_URL}/svgs/japanese-culture/sakura.svg`);
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
const forceUpload = args.includes('--force') || args.includes('-f');

// 检查环境变量
if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
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