'use client'

import { useState, useEffect, useCallback } from 'react'
import { TocItem, UseTocHighlightOptions } from './types'

export function useTocHighlight(toc: TocItem[], options: UseTocHighlightOptions = {}) {
  const [activeId, setActiveId] = useState<string>('')
  const { rootMargin = '0% 0% -80% 0%', threshold = 0.1 } = options

  // 从 TOC 中提取所有的锚点 ID
  const getAllIds = useCallback((items: TocItem[]): string[] => {
    const ids: string[] = []
    items.forEach((item) => {
      ids.push(item.url.replace('#', ''))
      if (item.children) {
        ids.push(...getAllIds(item.children))
      }
    })
    return ids
  }, [])

  // 平滑滚动到指定元素
  const scrollToElement = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 使用原生 scrollIntoView，配合 CSS scroll-margin-top 处理偏移
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      // 更新 URL hash，但不触发页面跳转
      history.replaceState(null, '', `#${id}`)
    }
  }, [])

  useEffect(() => {
    // 监听可见的标题，并设置高亮
    const ids = getAllIds(toc)
    if (ids.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到当前可见的标题
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          // 如果有多个可见标题，选择最靠上的那个
          const topEntry = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
          })
          setActiveId(topEntry.target.id)
        } else {
          // 如果没有可见标题，找到最接近视口顶部的标题
          const allEntries = entries.filter((entry) => entry.target.id)
          if (allEntries.length > 0) {
            const closestEntry = allEntries.reduce((prev, current) => {
              const prevDistance = Math.abs(prev.boundingClientRect.top)
              const currentDistance = Math.abs(current.boundingClientRect.top)
              return prevDistance < currentDistance ? prev : current
            })

            // 只有当标题在视口上方时才设置为 active
            if (closestEntry.boundingClientRect.top <= 0) {
              setActiveId(closestEntry.target.id)
            }
          }
        }
      },
      {
        rootMargin,
        threshold,
      },
    )

    // 观察所有标题元素
    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [toc, rootMargin, threshold, getAllIds])

  useEffect(() => {
    // mount 时滚动到当前 URL hash 对应的标题
    const ids = getAllIds(toc)
    if (ids.length === 0) return
    // 检查页面初始化时的 URL hash
    const initialHash = decodeURIComponent(window.location.hash.replace('#', ''))
    if (initialHash && ids.includes(initialHash)) {
      // 延迟执行，确保页面已完全加载
      setTimeout(() => {
        scrollToElement(initialHash)
        setActiveId(initialHash)
      }, 100)
    }
  }, [toc, getAllIds, scrollToElement])

  // 处理点击跳转
  const handleClick = useCallback(
    (url: string) => {
      const id = url.replace('#', '')
      scrollToElement(id)
    },
    [scrollToElement],
  )

  return {
    activeId,
    handleClick,
  }
}
