# Cloudflare R2 配置说明

## 环境变量配置

请在项目根目录创建 `.env.r2` 文件，并配置以下环境变量：

```bash
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
```

## 获取 Cloudflare R2 配置信息

### 1. 获取账户 ID
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 在右侧边栏可以看到您的账户 ID

### 2. 创建 R2 API Token
1. 前往 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 选择 "Custom token"
4. 配置权限：
   - Zone: Zone:Read (如果需要)
   - Account: Cloudflare R2:Edit
5. 生成 Token 后，将其作为 `R2_ACCESS_KEY_ID` 和 `R2_SECRET_ACCESS_KEY`

### 3. 创建 R2 存储桶
1. 在 Cloudflare Dashboard 中前往 R2 Object Storage
2. 创建一个新的存储桶
3. 记录存储桶名称作为 `R2_BUCKET_NAME`

### 4. 配置公开访问 (可选)
如果需要公开访问文件，您可以：
1. 使用 R2.dev 子域名（格式：`https://your-bucket.your_account_id.r2.cloudflarestorage.com`）
2. 或者配置自定义域名

## 使用方法

### 基础版本脚本

#### 基本上传（只上传不存在的文件）
```bash
bun run upload-svgs
# 或
node scripts/upload-to-r2.js
```

#### 强制上传（覆盖已存在的文件）
```bash
bun run upload-svgs-force
# 或
node scripts/upload-to-r2.js --force
```

### 高级版本脚本（推荐）

#### 基本上传（支持并发、进度显示、重试）
```bash
bun run upload-svgs-advanced
# 或
node scripts/upload-to-r2-advanced.js
```

#### 试运行模式（预览将要上传的文件，不实际上传）
```bash
bun run upload-svgs-dry-run
# 或
node scripts/upload-to-r2-advanced.js --dry-run
```

#### 强制上传（覆盖已存在的文件）
```bash
node scripts/upload-to-r2-advanced.js --force
```

#### 上传所有图片类型（SVG、PNG、JPG、GIF、WebP）
```bash
bun run upload-all-images
# 或
node scripts/upload-to-r2-advanced.js --include-images
```

#### 组合参数使用
```bash
# 试运行 + 包含所有图片类型
node scripts/upload-to-r2-advanced.js --dry-run --include-images

# 强制上传 + 包含所有图片类型
node scripts/upload-to-r2-advanced.js --force --include-images
```

### 高级脚本功能特点

- ✅ **并发上传**: 支持最多 5 个文件同时上传，提高效率
- ✅ **进度显示**: 实时显示上传进度和 ETA
- ✅ **智能跳过**: 检查文件大小，跳过已存在且未修改的文件
- ✅ **自动重试**: 上传失败时自动重试最多 3 次
- ✅ **试运行模式**: 预览将要上传的文件而不实际上传
- ✅ **多文件类型**: 支持 SVG、PNG、JPG、GIF、WebP 等图片格式
- ✅ **详细统计**: 显示上传成功、跳过、失败的文件数量和总大小
- ✅ **错误报告**: 列出所有上传失败的文件和错误原因

## 文件结构

脚本会将 `public/svgs` 目录下的所有 SVG 文件上传到 R2，保持目录结构：

```
本地: public/svgs/japanese-culture/sakura.svg
R2:   svgs/japanese-culture/sakura.svg
```

上传后的文件可以通过以下 URL 访问：
```
https://your-domain.com/svgs/japanese-culture/sakura.svg
```

## 页面集成

项目已经集成了 R2 客户端，页面会自动从 R2 获取 SVG 文件：

### 自动功能
- ✅ **分类页面**: 自动从 R2 获取指定分类下的所有 SVG 文件
- ✅ **文件预览**: 直接从 R2 获取 SVG 文件内容进行预览
- ✅ **智能缓存**: 支持边缘运行时和缓存优化
- ✅ **错误处理**: 自动处理文件不存在等错误情况

### 文件访问方式
1. **公开 URL**: 如果配置了 `R2_PUBLIC_URL`，直接通过公开 URL 访问
2. **API 路由**: 如果没有公开 URL，通过 `/api/svg?key=...` 路由访问

### 环境配置
页面功能需要在 `next.config.js` 中配置环境变量，已自动处理：
```javascript
env: {
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
}
``` 