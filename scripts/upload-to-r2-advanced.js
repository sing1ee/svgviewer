const { S3Client, PutObjectCommand, ListObjectsV2Command, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.r2' });

// Cloudflare R2 配置
const r2Config = {
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
};

const s3Client = new S3Client(r2Config);
const bucketName = process.env.R2_BUCKET_NAME;
const localSvgDir = path.join(__dirname, '../public/svgs');

// 配置选项
const CONFIG = {
  maxConcurrent: 5, // 最大并发上传数
  retryAttempts: 3, // 重试次数
  retryDelay: 1000, // 重试延迟 (ms)
  chunkSize: 1024 * 1024, // 1MB 块大小用于大文件
};

// 进度跟踪
class ProgressTracker {
  constructor(total) {
    this.total = total;
    this.completed = 0;
    this.skipped = 0;
    this.failed = 0;
    this.startTime = Date.now();
  }

  update(type) {
    this[type]++;
    this.printProgress();
  }

  printProgress() {
    const processed = this.completed + this.skipped + this.failed;
    const percentage = ((processed / this.total) * 100).toFixed(1);
    const elapsed = (Date.now() - this.startTime) / 1000;
    const eta = processed > 0 ? ((this.total - processed) * elapsed / processed).toFixed(0) : 'N/A';
    
    process.stdout.write(`\r📊 进度: ${percentage}% (${processed}/${this.total}) ` +
      `✅${this.completed} ⏭️${this.skipped} ❌${this.failed} ` +
      `⏱️${elapsed.toFixed(0)}s ETA:${eta}s`);
  }

  finish() {
    console.log('\n');
  }
}

// 获取文件哈希用于比较
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(fileBuffer).digest('hex');
}

// 获取 MIME 类型
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
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

// 检查远程文件是否存在且内容相同
async function shouldUploadFile(localFilePath, remoteKey) {
  try {
    const headParams = {
      Bucket: bucketName,
      Key: remoteKey,
    };
    
    const command = new HeadObjectCommand(headParams);
    const response = await s3Client.send(command);
    
    // 如果远程文件存在，比较文件大小
    const localStats = fs.statSync(localFilePath);
    const remoteSize = response.ContentLength;
    
    if (localStats.size !== remoteSize) {
      return true; // 大小不同，需要上传
    }
    
    // 如果有 ETag，可以进一步比较
    // 注意：R2 的 ETag 可能与本地文件的 MD5 不同
    return false; // 文件大小相同，跳过上传
    
  } catch (error) {
    if (error.name === 'NotFound') {
      return true; // 文件不存在，需要上传
    }
    console.error(`检查文件时出错 ${remoteKey}:`, error.message);
    return true; // 出错时默认上传
  }
}

// 带重试的上传函数
async function uploadFileWithRetry(localFilePath, remoteKey, attempt = 1) {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const mimeType = getMimeType(localFilePath);
    const stats = fs.statSync(localFilePath);
    
    const uploadParams = {
      Bucket: bucketName,
      Key: remoteKey,
      Body: fileContent,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000', // 缓存一年
      Metadata: {
        'upload-timestamp': Date.now().toString(),
        'original-size': stats.size.toString(),
      },
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    return { success: true, attempt };
  } catch (error) {
    if (attempt < CONFIG.retryAttempts) {
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay * attempt));
      return uploadFileWithRetry(localFilePath, remoteKey, attempt + 1);
    }
    
    return { 
      success: false, 
      error: error.message, 
      attempt 
    };
  }
}

// 并发控制器
class ConcurrencyController {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// 主上传函数
async function uploadSvgFiles(options = {}) {
  const {
    skipExisting = true,
    forceUpload = false,
    dryRun = false,
    fileTypes = ['.svg']
  } = options;

  console.log('🚀 Cloudflare R2 批量上传工具');
  console.log(`📁 本地目录: ${localSvgDir}`);
  console.log(`🪣 目标存储桶: ${bucketName}`);
  console.log(`⚙️  配置选项:`);
  console.log(`   - 跳过已存在文件: ${skipExisting ? '是' : '否'}`);
  console.log(`   - 强制上传: ${forceUpload ? '是' : '否'}`);
  console.log(`   - 试运行模式: ${dryRun ? '是' : '否'}`);
  console.log(`   - 最大并发数: ${CONFIG.maxConcurrent}`);
  console.log(`   - 支持文件类型: ${fileTypes.join(', ')}`);
  console.log('─'.repeat(60));

  if (!fs.existsSync(localSvgDir)) {
    console.error(`❌ 本地目录不存在: ${localSvgDir}`);
    return;
  }

  // 获取所有文件
  const allFiles = getAllFiles(localSvgDir);
  const targetFiles = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return fileTypes.includes(ext);
  });

  if (targetFiles.length === 0) {
    console.log(`❌ 没有找到支持的文件类型: ${fileTypes.join(', ')}`);
    return;
  }

  console.log(`📊 找到 ${targetFiles.length} 个文件`);

  // 创建进度跟踪器
  const progress = new ProgressTracker(targetFiles.length);
  const concurrencyController = new ConcurrencyController(CONFIG.maxConcurrent);

  // 统计信息
  let totalSize = 0;
  const results = [];

  // 处理所有文件
  const tasks = targetFiles.map(localFilePath => {
    return () => processFile(localFilePath, {
      skipExisting: skipExisting && !forceUpload,
      dryRun,
      progress
    });
  });

  // 执行所有任务
  for (const task of tasks) {
    try {
      const result = await concurrencyController.add(task);
      results.push(result);
      totalSize += result.size || 0;
    } catch (error) {
      console.error('处理文件时出错:', error);
      results.push({ success: false, error: error.message });
    }
  }

  progress.finish();

  // 输出最终统计
  console.log('─'.repeat(60));
  console.log('📈 上传统计:');
  console.log(`✅ 成功: ${progress.completed} 个文件`);
  console.log(`⏭️  跳过: ${progress.skipped} 个文件`);
  console.log(`❌ 失败: ${progress.failed} 个文件`);
  console.log(`📊 总计: ${targetFiles.length} 个文件`);
  console.log(`💾 总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (process.env.R2_PUBLIC_URL && progress.completed > 0) {
    console.log('─'.repeat(60));
    console.log('🌐 文件访问示例:');
    const exampleFile = results.find(r => r.success && r.remoteKey);
    if (exampleFile) {
      console.log(`${process.env.R2_PUBLIC_URL}/${exampleFile.remoteKey}`);
    }
  }

  // 输出失败的文件
  const failedFiles = results.filter(r => !r.success);
  if (failedFiles.length > 0) {
    console.log('\n❌ 失败文件列表:');
    failedFiles.forEach(file => {
      console.log(`   ${file.localPath}: ${file.error}`);
    });
  }
}

// 处理单个文件
async function processFile(localFilePath, options) {
  const { skipExisting, dryRun, progress } = options;
  
  // 生成远程存储的 key
  const relativePath = path.relative(localSvgDir, localFilePath);
  const remoteKey = `svgs/${relativePath.replace(/\\/g, '/')}`;
  
  const stats = fs.statSync(localFilePath);
  const result = {
    localPath: localFilePath,
    remoteKey,
    size: stats.size,
    success: false
  };

  try {
    // 检查是否需要上传
    if (skipExisting && !dryRun) {
      const shouldUpload = await shouldUploadFile(localFilePath, remoteKey);
      if (!shouldUpload) {
        progress.update('skipped');
        return { ...result, success: true, skipped: true };
      }
    }

    if (dryRun) {
      console.log(`[DRY RUN] 将上传: ${remoteKey}`);
      progress.update('completed');
      return { ...result, success: true, dryRun: true };
    }

    // 执行上传
    const uploadResult = await uploadFileWithRetry(localFilePath, remoteKey);
    
    if (uploadResult.success) {
      progress.update('completed');
      return { ...result, success: true, attempts: uploadResult.attempt };
    } else {
      progress.update('failed');
      return { ...result, success: false, error: uploadResult.error };
    }

  } catch (error) {
    progress.update('failed');
    return { ...result, success: false, error: error.message };
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
const forceUpload = args.includes('--force') || args.includes('-f');
const dryRun = args.includes('--dry-run') || args.includes('-d');
const includeImages = args.includes('--include-images') || args.includes('-i');

// 检查环境变量
if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
  console.error('❌ 请先配置环境变量在 .env.r2 文件中');
  console.error('   详细配置说明请查看: scripts/R2_CONFIG.md');
  process.exit(1);
}

// 配置文件类型
const fileTypes = includeImages 
  ? ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp']
  : ['.svg'];

// 开始上传
const options = {
  skipExisting: !forceUpload,
  forceUpload,
  dryRun,
  fileTypes
};

uploadSvgFiles(options).catch(error => {
  console.error('❌ 上传过程中发生错误:', error);
  process.exit(1);
}); 