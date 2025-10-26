'use client';

import { TocItemProps } from './types';

export function TocItem({ item, isActive = false, onClick }: TocItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(item.url);
  };

  // 根据深度计算缩进
  const getIndentClass = (depth: number) => {
    switch (depth) {
      case 2:
        return 'pl-0';
      case 3:
        return 'pl-4';
      default:
        return 'pl-0';
    }
  };

  // 根据深度和状态计算样式类
  const getItemClasses = () => {
    const baseClasses = [
      'block py-1 text-sm transition-colors duration-200',
      'hover:text-gray-900 dark:hover:text-gray-100',
      // 'border-l-2 transition-all duration-200',
      getIndentClass(item.depth)
    ];

    if (isActive) {
      baseClasses.push(
        'text-gray-900 dark:text-gray-100',
        'border-gray-900 dark:border-gray-100',
        'font-medium'
      );
    } else {
      baseClasses.push(
        'text-gray-600 dark:text-gray-400',
        'border-transparent',
        'hover:border-gray-300 dark:hover:border-gray-600'
      );
    }

    return baseClasses.join(' ');
  };

  return (
    <li>
      <a
        href={item.url}
        onClick={handleClick}
        className={getItemClasses()}
        title={item.value}
      >
        {item.value}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="mt-1">
          {item.children.map((child, index) => (
            <TocItem
              key={`${child.url}-${index}`}
              item={child}
              isActive={isActive}
              onClick={onClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}