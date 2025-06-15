const fs = require('fs');
const path = require('path');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// 创建环境变量配置文件模板
function createEnvTemplate() {
  const envTemplate = `# Cloudflare R2 配置
# 请根据您的实际信息填写以下配置

# Cloudflare 账户 ID (可在 Cloudflare Dashboard 右侧边栏找到)
R2_ACCOUNT_ID=your_account_id_here

# R2 API Token (需要创建一个具有 R2 读写权限的 API Token)
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here

# R2 存储桶名称
R2_BUCKET_NAME=your_bucket_name_here

# R2 端点 URL (格式：https://your_account_id.r2.cloudflarestorage.com)
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

# R2 公开访问 URL (可选，如果您设置了自定义域名或使用 R2.dev 子域名)
# 格式可能是：https://your-bucket.your_account_id.r2.cloudflarestorage.com
# 或者您的自定义域名：https://your-custom-domain.com
R2_PUBLIC_URL=https://your_custom_domain_or_public_url
`;

  const envPath = path.join(__dirname, '../.env.r2');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.r2 文件已存在，跳过创建');
    return envPath;
  }

  try {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ 已创建 .env.r2 配置文件模板');
    console.log(`📝 请编辑 ${envPath} 文件，填入您的 Cloudflare R2 配置信息`);
    return envPath;
  } catch (error) {
    console.error('❌ 创建配置文件失败:', error.message);
    return null;
  }
}

// 测试 R2 连接
async function testR2Connection() {
  console.log('🔍 正在测试 R2 连接...');
  
  require('dotenv').config({ path: '.env.r2' });

  // 检查必需的环境变量
  const requiredVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME', 'R2_ENDPOINT'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ 缺少必需的环境变量:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📝 请在 .env.r2 文件中配置这些变量');
    return false;
  }

  // 配置 R2 客户端
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

  try {
    // 尝试列出存储桶中的对象
    const listParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      MaxKeys: 1,
    };

    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);

    console.log('✅ R2 连接测试成功！');
    console.log(`📦 存储桶: ${process.env.R2_BUCKET_NAME}`);
    console.log(`🗂️  当前存储桶中有 ${response.KeyCount || 0} 个对象`);
    
    if (process.env.R2_PUBLIC_URL) {
      console.log(`🌐 公开访问地址: ${process.env.R2_PUBLIC_URL}`);
    }

    return true;
  } catch (error) {
    console.error('❌ R2 连接测试失败:');
    console.error(`   错误: ${error.message}`);
    
    if (error.name === 'NoSuchBucket') {
      console.error('   🪣 存储桶不存在，请检查 R2_BUCKET_NAME 配置');
    } else if (error.name === 'InvalidAccessKeyId') {
      console.error('   🔑 访问密钥无效，请检查 R2_ACCESS_KEY_ID 配置');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('   🔐 密钥签名不匹配，请检查 R2_SECRET_ACCESS_KEY 配置');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   🌐 端点地址无法访问，请检查 R2_ENDPOINT 配置');
    }

    console.error('\n📚 配置帮助: 请查看 scripts/R2_CONFIG.md 文件');
    return false;
  }
}

// 显示项目文件统计
function showFileStats() {
  const svgDir = path.join(__dirname, '../public/svgs');
  
  if (!fs.existsSync(svgDir)) {
    console.log('❌ SVG 目录不存在:', svgDir);
    return;
  }

  console.log('\n📊 本地文件统计:');
  console.log(`📁 SVG 目录: ${svgDir}`);

  // 获取所有 SVG 文件
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

  const allFiles = getAllFiles(svgDir);
  const svgFiles = allFiles.filter(file => path.extname(file).toLowerCase() === '.svg');
  const imageFiles = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
  });

  // 计算总大小
  let totalSize = 0;
  svgFiles.forEach(file => {
    totalSize += fs.statSync(file).size;
  });

  console.log(`🗂️  总文件数: ${allFiles.length}`);
  console.log(`🎨 SVG 文件数: ${svgFiles.length}`);
  console.log(`🖼️  图片文件数: ${imageFiles.length}`);
  console.log(`💾 SVG 总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  // 显示目录结构
  const directories = new Set();
  svgFiles.forEach(file => {
    const relativePath = path.relative(svgDir, file);
    const dir = path.dirname(relativePath);
    if (dir !== '.') {
      directories.add(dir);
    }
  });

  if (directories.size > 0) {
    console.log('\n📂 目录结构:');
    Array.from(directories).sort().forEach(dir => {
      const dirPath = path.join(svgDir, dir);
      const filesInDir = svgFiles.filter(file => {
        const relativePath = path.relative(svgDir, file);
        return path.dirname(relativePath) === dir;
      });
      console.log(`   ${dir}/ (${filesInDir.length} 个文件)`);
    });
  }
}

// 主函数
async function main() {
  console.log('🚀 Cloudflare R2 配置和测试工具');
  console.log('─'.repeat(50));

  // 1. 创建配置文件模板
  console.log('\n1️⃣ 创建配置文件...');
  const envPath = createEnvTemplate();
  
  if (!envPath) {
    return;
  }

  // 2. 显示文件统计
  console.log('\n2️⃣ 扫描本地文件...');
  showFileStats();

  // 3. 测试连接
  console.log('\n3️⃣ 测试 R2 连接...');
  const connectionSuccessful = await testR2Connection();

  // 4. 显示下一步操作
  console.log('\n─'.repeat(50));
  console.log('📋 下一步操作:');
  
  if (!connectionSuccessful) {
    console.log('❌ R2 连接失败，请先完成以下步骤:');
    console.log('   1. 编辑 .env.r2 文件，填入正确的配置信息');
    console.log('   2. 重新运行此脚本测试连接: bun run node scripts/setup-r2.js');
    console.log('   3. 查看配置说明: scripts/R2_CONFIG.md');
  } else {
    console.log('✅ R2 连接成功！您现在可以开始上传文件:');
    console.log('   📋 查看所有上传选项: scripts/R2_CONFIG.md');
    console.log('   🧪 试运行上传: bun run upload-svgs-dry-run');
    console.log('   📤 开始上传: bun run upload-svgs-advanced');
    console.log('   💪 强制上传所有文件: node scripts/upload-to-r2-advanced.js --force');
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 运行过程中发生错误:', error);
  process.exit(1);
}); 