import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{
    year: string
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { year, slug } = await params

  try {
    // 动态导入对应的 MDX 内容
    const Content = (await import(`../../${year}/${slug}/content.mdx`)).default

    return <Content />
  } catch (error) {
    // 如果找不到对应的 content.mdx 文件，返回 404
    notFound()
  }
}

// 可选：为动态路由添加 metadata
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { year, slug } = await params

  try {
    const { metadata } = await import(`../../${year}/${slug}/content.mdx`)

    return {
      title: metadata.title,
      description: metadata.description,
      alternates: metadata.alternates,
    }
  } catch (error) {
    return {
      title: 'Not Found',
    }
  }
}