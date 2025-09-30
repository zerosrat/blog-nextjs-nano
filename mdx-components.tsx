import React, { ComponentPropsWithoutRef } from 'react'
import Link from 'next/link'
import { highlight } from 'sugar-high'

type HeadingProps = ComponentPropsWithoutRef<'h1'>
type ParagraphProps = ComponentPropsWithoutRef<'p'>
type ListProps = ComponentPropsWithoutRef<'ul'>
type ListItemProps = ComponentPropsWithoutRef<'li'>
type AnchorProps = ComponentPropsWithoutRef<'a'>
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>

// 样式配置对象，便于维护
const mdxStyles = {
  h1: 'text-gray-900 dark:text-zinc-100 font-extrabold text-4xl mt-0 mb-4',
  h2: 'text-gray-900 dark:text-zinc-100 font-bold text-2xl mt-8 mb-4',
  h3: 'text-gray-900 dark:text-zinc-100 font-semibold text-xl mt-6 mb-2',
  h4: 'text-gray-900 dark:text-zinc-100 font-semibold mt-6 mb-2',
  p: 'text-gray-700 dark:text-zinc-300 leading-relaxed',
  link: 'text-blue-500 hover:text-blue-700 dark:text-blue-400 hover:dark:text-blue-300 underline underline-offset-2 decoration-blue-500/30 hover:decoration-blue-500/60 transition-colors',
  code: 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono',
  blockquote:
    'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 pl-4 py-2 text-gray-700 dark:text-zinc-300 italic',
  table:
    'table w-fit min-w-full max-w-[80ch] whitespace-nowrap text-left border-collapse my-6 mx-auto relative left-1/2 -translate-x-1/2 md:max-w-[100ch] max-md:left-[-1rem] max-md:transform-none max-md:w-[calc(100vw-2rem)] max-md:max-w-[calc(100vw-2rem)] max-md:ml-0 max-md:mr-0',
  th: 'border-b border-gray-300 dark:border-zinc-600 px-3 py-3 font-medium border-r border-gray-200 dark:border-zinc-700 last:border-r-0',
  td: 'border-b border-gray-200 dark:border-zinc-700 px-2 py-2 border-r border-gray-200 dark:border-zinc-700 last:border-r-0',
}

const components = {
  h1: (props: HeadingProps) => <h1 className={mdxStyles.h1} {...props} />,
  h2: (props: HeadingProps) => <h2 className={mdxStyles.h2} {...props} />,
  h3: (props: HeadingProps) => <h3 className={mdxStyles.h3} {...props} />,
  h4: (props: HeadingProps) => <h4 className={mdxStyles.h4} {...props} />,
  p: (props: ParagraphProps) => <p className={mdxStyles.p} {...props} />,
  ol: (props: ListProps) => <ol className="text-gray-800 dark:text-zinc-300 list-decimal pl-5 space-y-2" {...props} />,
  ul: (props: ListProps) => <ul className="text-gray-800 dark:text-zinc-300 list-disc pl-5 space-y-1" {...props} />,
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => <em className="font-medium" {...props} />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong className="font-medium" {...props} />,
  a: ({ href, children, ...props }: AnchorProps) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={mdxStyles.link} {...props}>
          {children}
        </Link>
      )
    }
    if (href?.startsWith('#')) {
      return (
        <a href={href} className={mdxStyles.link} {...props}>
          {children}
        </a>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={mdxStyles.link} {...props}>
        {children}
      </a>
    )
  },
  code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
    const codeHTML = highlight(children as string)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table className={mdxStyles.table}>
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index} className={mdxStyles.th}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className={mdxStyles.td}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  blockquote: (props: BlockquoteProps) => <blockquote className={mdxStyles.blockquote} {...props} />,
}

declare global {
  type MDXProvidedComponents = typeof components
}

export function useMDXComponents(): MDXProvidedComponents {
  return components
}
