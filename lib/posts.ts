import fs from 'fs'
import path from 'path'

export interface PostMetadata {
  title: string
  date: string
  description?: string
  alternates: {
    canonical: string
  }
}

export interface Post extends PostMetadata {
  href: string
  year: number
  slug: string
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'app/n')
  const posts: Post[] = []

  try {
    // 获取所有年份目录
    const years = fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => /^\d{4}$/.test(name)) // 只匹配四位数字的年份

    for (const year of years) {
      const yearPath = path.join(postsDirectory, year)

      try {
        // 获取该年份下的所有文章目录
        const articles = fs.readdirSync(yearPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

        for (const article of articles) {
          const articlePath = `/app/n/${year}/${article}/page.mdx`

          try {
            // 动态导入文章的 metadata
            const { metadata } = await import(`../app/n/${year}/${article}/page.mdx`)

            if (metadata && metadata.title && metadata.date) {
              posts.push({
                ...metadata,
                href: `/n/${year}/${article}`,
                year: parseInt(year),
                slug: article,
              })
            }
          } catch (error) {
            console.warn(`Failed to import metadata from ${articlePath}:`, error)
          }
        }
      } catch (error) {
        console.warn(`Failed to read directory ${yearPath}:`, error)
      }
    }

    // 按日期降序排序（最新的在前）
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  } catch (error) {
    console.error('Failed to scan posts directory:', error)
    return []
  }
}

export function groupPostsByYear(posts: Post[]): Record<number, Post[]> {
  return posts.reduce((acc, post) => {
    if (!acc[post.year]) {
      acc[post.year] = []
    }
    acc[post.year].push(post)
    return acc
  }, {} as Record<number, Post[]>)
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${month}-${day}`
  } catch (error) {
    console.warn(`Invalid date format: ${dateString}`)
    return dateString
  }
}