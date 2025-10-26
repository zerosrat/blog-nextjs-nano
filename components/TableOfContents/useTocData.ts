'use client';

import { useState, useEffect } from 'react';
import { TocItem } from './types';

export function useTocData(containerSelector: string = '.mdx-content') {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const generateToc = () => {
      const container = document.querySelector(containerSelector);
      if (!container) return [];

      const headings = container.querySelectorAll('h2, h3');
      const tocItems: TocItem[] = [];

      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';

        // 为标题生成 ID（如果没有的话）
        let id = heading.id;
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、空格和连字符
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
          heading.id = id;
        }

        const tocItem: TocItem = {
          value: text,
          url: `#${id}`,
          depth: level,
        };

        if (level === 2) {
          // h2 作为主要章节
          tocItems.push(tocItem);
        } else if (level === 3 && tocItems.length > 0) {
          // h3 作为子章节，添加到最后一个 h2 下
          const lastItem = tocItems[tocItems.length - 1];
          if (!lastItem.children) {
            lastItem.children = [];
          }
          lastItem.children.push(tocItem);
        }
      });

      return tocItems;
    };

    // 初始生成
    const initialToc = generateToc();
    setToc(initialToc);

    // 监听内容变化（对于动态内容）
    const observer = new MutationObserver(() => {
      const newToc = generateToc();
      setToc(newToc);
    });

    const container = document.querySelector(containerSelector);
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [containerSelector]);

  return toc;
}