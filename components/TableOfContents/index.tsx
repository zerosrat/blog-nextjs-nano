'use client';

import { TableOfContentsProps } from './types';
import { TocItem } from './TocItem';
import { useTocHighlight } from './useTocHighlight';
import { useTocData } from './useTocData';

export function TableOfContents({ className = '' }: Omit<TableOfContentsProps, 'toc'>) {
  const toc = useTocData('.mdx-content');
  const { activeId, handleClick } = useTocHighlight(toc);

  // 如果没有目录项，不渲染组件
  if (!toc || toc.length === 0) {
    return null;
  }

  // 检查目录项是否为当前激活项（包括子项）
  const isItemActive = (item: any): boolean => {
    const itemId = item.url.replace('#', '');
    if (itemId === activeId) return true;

    if (item.children) {
      return item.children.some((child: any) => isItemActive(child));
    }

    return false;
  };

  return (
    <nav
      className={`
        fixed top-32 right-8 w-60 max-h-[calc(100vh-200px)]
        overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
        dark:scrollbar-thumb-gray-600 scrollbar-track-transparent
        hidden xl:block z-10
        ${className}
      `}
      aria-label="Table of contents"
    >
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        {/* <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          Contents
        </h3> */}
        <ul className="space-y-1">
          {toc.map((item, index) => (
            <TocItem
              key={`${item.url}-${index}`}
              item={item}
              isActive={isItemActive(item)}
              onClick={handleClick}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default TableOfContents;