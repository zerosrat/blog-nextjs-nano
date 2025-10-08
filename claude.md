# Zero Yu 的技术博客项目

这是一个基于 Next.js 15 构建的个人技术博客，主要分享前端开发、JavaScript、React 等技术内容。

## 项目概述

- **项目名称**: Zero Yu's Blog
- **域名**: https://zerosrat.dev
- **技术栈**: Next.js 15 + TypeScript + Tailwind CSS + MDX
- **包管理器**: pnpm
- **部署平台**: Netlify
- **内容语言**: 中文为主

## 项目结构

```
blog-nextjs-nano/
├── app/                    # Next.js 15 App Router 主目录
│   ├── layout.tsx         # 根布局组件，包含页面结构和样式
│   ├── page.mdx          # 首页内容
│   ├── globals.css       # 全局样式文件 (Tailwind CSS)
│   ├── sitemap.ts        # 站点地图生成
│   ├── demo/             # 演示页面目录
│   │   ├── 1/page.mdx    # 演示页面 1
│   │   ├── 2/page.mdx    # 演示页面 2
│   │   └── 3/page.mdx    # 演示页面 3
│   └── n/                # 博客文章主目录
│       ├── 2017/         # 按年份组织的文章
│       ├── 2018/
│       ├── 2019/
│       ├── 2020/
│       ├── 2022/
│       └── 2025/         # 最新文章
│           ├── js-engine-intro/page.mdx
│           ├── react-modal-animation-issue/page.mdx
│           ├── react-print-issue/page.mdx
│           └── terser-version-trap/page.mdx
├── mdx-components.tsx    # MDX 组件配置文件
├── next.config.ts        # Next.js 配置文件
├── package.json          # 项目依赖和脚本
├── tailwind.config.js    # Tailwind CSS 配置
├── next-env.d.ts         # Next.js TypeScript 类型定义
└── README.md             # 项目说明文档
```

## 开发环境配置

### 环境要求
- Node.js v18.17+
- pnpm (推荐的包管理器)

### 常用命令
```bash
# 安装依赖
pnpm install

# 启动开发服务器 (端口 3333)
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 开发特性
- **Turbopack**: Next.js 的快速构建工具
- **MDX Rust 编译器**: 实验性功能，提升 MDX 编译性能
- **热重载**: 开发时自动刷新
- **TypeScript**: 完整的类型支持

## 内容创作指南

### 文章组织规则

1. **路径规范**: `app/n/{年份}/{文章slug}/page.mdx`
2. **URL 结构**: `zerosrat.dev/n/{年份}/{文章slug}`
3. **文章slug**: 使用英文，多个单词用连字符分隔

### 新文章创建流程

1. 在对应年份目录下创建新文件夹：
   ```bash
   mkdir app/n/2025/new-article-name
   ```

2. 创建 `page.mdx` 文件：
   ```bash
   touch app/n/2025/new-article-name/page.mdx
   ```

3. 添加文章内容，包含 metadata 和正文：
   ```mdx
   export const metadata = {
     title: '文章标题',
     alternates: {
       canonical: '/n/2025/new-article-name',
     },
   };

   # 文章标题

   文章内容...
   ```

### Metadata 配置标准

每篇文章必须包含：
- `title`: 文章标题
- `alternates.canonical`: 规范 URL，格式为 `/n/{年份}/{文章slug}`

### 内容规范

- **语言**: 主要使用中文
- **技术重点**: JavaScript、React、前端开发、工程化
- **代码高亮**: 支持多种编程语言的语法高亮
- **样式**: 使用 Tailwind CSS 类名进行样式定制

## 技术架构特点

### Next.js 配置
- **App Router**: 使用最新的 App Router 架构
- **页面扩展**: 支持 `.mdx`、`.ts`、`.tsx` 文件作为页面
- **实验性功能**: 启用 MDX Rust 编译器 (`mdxRs: true`)

### 样式系统
- **Tailwind CSS v4**: 使用最新版本的 Tailwind CSS
- **深色模式**: 支持系统级深色模式切换
- **响应式设计**: 移动端优先的响应式布局
- **字体**: Inter 字体，优化中文显示 (`lang="zh-CN"`)

### MDX 集成
- **组件化**: 支持在 Markdown 中使用 React 组件
- **代码高亮**: 使用 `sugar-high` 进行代码语法高亮
- **自定义组件**: 通过 `mdx-components.tsx` 自定义 MDX 组件

## 布局组件结构

### 根布局 (`app/layout.tsx`)
- **全局样式**: 包含 Tailwind CSS 基础样式
- **页面结构**: 最大宽度 60 字符，居中布局
- **页脚**: 包含社交链接 (GitHub)
- **SEO 优化**: 完整的 metadata 配置

### 页面 Metadata
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://zerosrat.dev'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Blog | Zero Yu',
    template: '%s | Zero Yu',
  },
  description: 'My portfolio, blog, and personal website.',
}
```

## 部署配置

### Netlify 部署
- **构建命令**: `pnpm build`
- **发布目录**: `out` (静态导出) 或 `.next` (服务端渲染)
- **Node.js 版本**: 18.17+

### 环境变量
目前项目暂未使用环境变量，如需添加可在 Netlify 控制台配置。

### 构建优化
- **Turbopack**: 开发和构建时的性能优化
- **静态优化**: Next.js 自动优化静态页面
- **图片优化**: Next.js Image 组件优化

## 开发指南

### 代码规范
- **TypeScript**: 所有 `.ts` 和 `.tsx` 文件使用严格类型检查
- **组件命名**: 使用 PascalCase
- **文件命名**: 页面文件使用 `page.mdx` 或 `page.tsx`

### 常见开发任务

1. **添加新页面**: 在 `app` 目录下创建对应的文件夹和页面文件
2. **修改样式**: 在 `app/globals.css` 中添加全局样式，或使用 Tailwind 类名
3. **配置 MDX 组件**: 在 `mdx-components.tsx` 中自定义组件映射
4. **更新 sitemap**: `app/sitemap.ts` 会自动生成站点地图

### 调试技巧
- 使用 `pnpm dev` 启动开发服务器进行实时调试
- 检查浏览器控制台获取错误信息
- 使用 TypeScript 类型检查发现潜在问题

## 内容主题

博客主要涵盖以下技术领域：
- **前端开发**: React、JavaScript、TypeScript
- **工程化**: 构建工具、性能优化
- **框架技术**: Next.js、React 生态
- **问题解决**: 实际开发中遇到的技术问题和解决方案
- **技术思考**: 对前端技术发展的思考和总结

## 注意事项

1. **MDX 限制**: 由于使用 Rust 编译器，无法使用 rehype 或 remark 插件
2. **路径规范**: 严格按照年份和文章名组织文件结构
3. **SEO 优化**: 确保每篇文章都有正确的 metadata 配置
4. **性能考虑**: 合理使用 Tailwind CSS 类名，避免样式冗余

这个配置文件帮助 Claude 更好地理解项目结构，协助进行内容创作、功能开发和维护工作。