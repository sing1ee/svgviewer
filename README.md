# SVG Viewer

一个功能强大的SVG工具集，帮助开发者和设计师查看、优化和转换SVG文件。

![SVG Viewer](public/og-image.png)

## 功能特点

- **SVG查看器**：实时预览和编辑SVG代码
- **SVG优化器**：减小SVG文件大小，提高性能
- **SVG转换器**：将SVG转换为其他格式（如PNG、JPG等）
- **代码编辑器**：内置语法高亮的SVG代码编辑器
- **实时预览**：即时查看SVG编辑效果
- **缩放控制**：调整SVG预览大小
- **文件导入/导出**：上传SVG文件并下载优化后的结果
- **响应式设计**：适配各种设备屏幕

## 技术栈

- [Next.js](https://nextjs.org/) - React框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍UI组件
- [Prism.js](https://prismjs.com/) - 代码语法高亮
- [Lucide React](https://lucide.dev/) - 图标库

## 快速开始

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn 或 pnpm

### 安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/svg-viewer.git
cd svg-viewer
```

2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用指南

### SVG查看器

1. 在代码编辑器中输入或粘贴SVG代码
2. 实时查看右侧预览窗口中的SVG
3. 使用缩放滑块调整预览大小
4. 调整画布尺寸以适应不同的SVG

### SVG优化器

1. 上传SVG文件或在编辑器中输入SVG代码
2. 点击"优化"按钮
3. 查看优化前后的文件大小对比
4. 下载优化后的SVG文件

### SVG转换器

1. 上传SVG文件或在编辑器中输入SVG代码
2. 选择目标格式（PNG、JPG等）
3. 设置输出选项（尺寸、质量等）
4. 点击"转换"按钮
5. 下载转换后的文件

## 部署

项目可以轻松部署到Vercel、Netlify或其他支持Next.js的平台：

```bash
# 构建生产版本
npm run build
# 或
yarn build
# 或
pnpm build

# 启动生产服务器
npm start
# 或
yarn start
# 或
pnpm start
```

## 贡献指南

欢迎贡献！请随时提交问题或拉取请求。

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开拉取请求

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

项目维护者 - [@yourusername](https://github.com/yourusername)

项目链接: [https://github.com/yourusername/svg-viewer](https://github.com/yourusername/svg-viewer) 