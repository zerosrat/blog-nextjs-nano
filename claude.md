# Zero Yu 的技术博客项目

这是一个基于 Next.js 15 构建的个人技术博客，主要分享前端开发、JavaScript、React 等技术内容。

## 项目概述

- **项目名称**: Zero Yu's Blog
- **域名**: <https://zerosrat.dev>
- **技术栈**: Next.js 15 + TypeScript + Tailwind CSS + MDX
- **包管理器**: pnpm
- **部署平台**: Netlify
- **内容语言**: 中文为主

## 项目结构

```
blog-nextjs-nano/
├── app/                          # Next.js 15 App Router 主目录
│   ├── layout.tsx               # 根布局组件，包含页面结构和样式
│   ├── page.tsx                 # 首页内容 (TypeScript 组件，动态生成博客列表)
│   ├── globals.css              # 全局样式文件 (Tailwind CSS)
│   ├── sitemap.ts               # 站点地图生成
│   ├── demo/                    # 演示页面目录
│   │   ├── 1/page.mdx          # 演示页面 1
│   │   ├── 2/page.mdx          # 演示页面 2
│   │   └── 3/page.mdx          # 演示页面 3
│   ├── draft/                   # 草稿文章目录
│   └── n/                       # 博客文章主目录
│       ├── [year]/[slug]/       # 动态路由结构
│       │   ├── layout.tsx       # 文章布局组件 (自动注入标题和日期)
│       │   └── page.tsx         # 文章页面组件 (动态加载 MDX 内容)
│       ├── 2017/                # 按年份组织的文章
│       ├── 2018/
│       ├── 2019/
│       ├── 2020/
│       ├── 2022/
│       └── 2025/                # 最新文章
│           ├── js-engine-intro/content.mdx
│           ├── react-modal-animation-issue/content.mdx
│           ├── react-print-issue/content.mdx
│           └── terser-version-trap/content.mdx
├── lib/                         # 工具函数库
│   └── posts.ts                 # 博客文章数据处理函数
├── components/                  # React 组件目录
├── public/                      # 静态资源目录
├── scripts/                     # 构建和部署脚本
├── mdx-components.tsx          # MDX 组件配置文件
├── next.config.ts              # Next.js 配置文件 (包含数据库集成)
├── package.json                # 项目依赖和脚本
├── postcss.config.mjs          # PostCSS 配置
├── tsconfig.json               # TypeScript 配置
├── netlify.toml                # Netlify 部署配置
├── .prettierrc.js              # 代码格式化配置
├── next-env.d.ts               # Next.js TypeScript 类型定义
└── README.md                   # 项目说明文档
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

- **mdx.js 编译器**: 没有使用 mdxRs，生态支持不完善
- **热重载**: 开发时自动刷新
- **TypeScript**: 完整的类型支持

## 内容创作指南

### 新架构说明

项目采用动态布局系统，使用 `layout.tsx` + `page.tsx` 自动渲染 `content.mdx` 文件：

- **动态路由**: `/n/[year]/[slug]` 自动匹配文章路径
- **自动布局**: `layout.tsx` 自动注入文章标题和发布日期
- **内容分离**: 纯 MDX 内容存储在 `content.mdx` 中，无需手动添加标题
- **元数据处理**: 自动从 `content.mdx` 提取 metadata 用于 SEO

### 文章组织规则

1. **路径规范**: `app/n/{年份}/{文章slug}/content.mdx`
2. **URL 结构**: `zerosrat.dev/n/{年份}/{文章slug}`
3. **文章slug**: 使用英文，多个单词用连字符分隔

### 新文章创建流程

1. 在对应年份目录下创建新文件夹：

   ```bash
   mkdir app/n/2025/new-article-name
   ```

2. 创建 `content.mdx` 文件：

   ```bash
   touch app/n/2025/new-article-name/content.mdx
   ```

3. 添加文章内容（**注意：不需要手动添加标题**）：

   ```mdx
   export const metadata = {
     title: '文章标题',
     date: 'YYYY-MM-DD',
     alternates: {
       canonical: '/n/2025/new-article-name',
     },
   };

   文章正文内容开始...

   ## 第一个章节

   章节内容...
   ```

### Metadata 配置标准

每篇文章的 `content.mdx` 必须包含：

- `title`: 文章标题（会被 layout.tsx 自动注入到页面顶部）
- `alternates.canonical`: 规范 URL，格式为 `/n/{年份}/{文章slug}`
- `date`: 创作时间

### 自动化功能

1. **标题注入**: `layout.tsx` 自动从 metadata 读取标题并渲染
2. **日期显示**: 自动从文件路径解析发布日期并格式化显示
3. **SEO 优化**: `page.tsx` 自动提取 metadata 生成页面元信息
4. **404 处理**: 不存在的文章路径自动返回 404 页面

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
