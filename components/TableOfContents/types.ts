export interface TocItem {
  value: string;           // 标题文本
  url: string;            // 锚点链接 (如 #heading-1)
  depth: number;          // 标题层级 (2 或 3)
  children?: TocItem[];   // 子标题
}

export interface TableOfContentsProps {
  toc: TocItem[];
  className?: string;
}

export interface TocItemProps {
  item: TocItem;
  isActive?: boolean;
  onClick?: (url: string) => void;
}

export interface UseTocHighlightOptions {
  rootMargin?: string;
  threshold?: number;
}