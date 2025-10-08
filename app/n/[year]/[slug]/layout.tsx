import { getPostBySlug, formatDateReadable } from '@/lib/posts'
import { notFound } from 'next/navigation'

interface BlogPostLayoutProps {
  children: React.ReactNode
  params: Promise<{
    year: string
    slug: string
  }>
}

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const { year, slug } = await params
  const post = await getPostBySlug(year, slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      {/* 自动注入的标题和日期 */}
      <header className="mb-8">
        <h1 className="text-gray-900 dark:text-zinc-100 font-extrabold text-4xl mt-0 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {formatDateReadable(post.date)}
        </p>
      </header>

      {/* MDX 内容 */}
      <div className="mdx-content">
        {children}
      </div>
    </article>
  )
}