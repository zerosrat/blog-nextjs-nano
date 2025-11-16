'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import mermaid from 'mermaid'

// 动画样式
const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .mermaid-preview-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  
  .mermaid-preview-scale-in {
    animation: scale-in 0.2s ease-out;
  }
`

interface MermaidProps {
  chart: string
}

let mermaidInitialized = false

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>('')
  const [previewSvg, setPreviewSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  // 生成唯一 ID
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`).current

  useEffect(() => {
    // 初始化 Mermaid(只需要初始化一次)
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      })
      mermaidInitialized = true
    }

    // 渲染图表
    const renderDiagram = async () => {
      try {
        setError(null)
        setIsLoading(true)

        // 渲染 Mermaid 图表
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        
        // 正常显示版本: 宽度 100%
        const responsiveSvg = renderedSvg
          .replace(/(<svg[^>]*)\swidth="[^"]*"/, '$1 width="100%"')
          .replace(/(<svg[^>]*)\sheight="[^"]*"/, '$1 height="auto"')
        
        // 预览版本: 移除固定尺寸,让内容自适应,添加白色背景
        const largeSvg = renderedSvg
          .replace(/(<svg[^>]*)\swidth="[^"]*"/, '$1')
          .replace(/(<svg[^>]*)\sheight="[^"]*"/, '$1')
          .replace(/(<svg[^>]*)\sstyle="[^"]*"/, '$1')
          .replace(/<svg/, '<svg width="100%" height="100%" style="max-width: 100%; max-height: 100%;"')
        
        setSvg(responsiveSvg)
        setPreviewSvg(largeSvg)
        setIsLoading(false)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : '图表渲染失败')
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [chart, id])

  // 处理预览弹窗
  useEffect(() => {
    if (!isPreviewOpen) return

    // ESC 键关闭预览
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPreviewOpen(false)
      }
    }

    // 阻止背景滚动
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isPreviewOpen])

  // 错误状态显示
  if (error) {
    return (
      <div className="my-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-300 text-sm">
          <strong>Mermaid 渲染错误:</strong> {error}
        </p>
        <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-x-auto">
          {chart}
        </pre>
      </div>
    )
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="my-6 flex justify-center">
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-400 dark:text-zinc-500">
            正在渲染图表...
          </div>
        </div>
      </div>
    )
  }

  // 渲染 SVG
  return (
    <>
      <style>{styles}</style>
      <div className="my-6 w-full">
        <div
          className="mermaid-container w-full overflow-x-auto flex justify-center cursor-pointer transition-opacity hover:opacity-80"
          dangerouslySetInnerHTML={{ __html: svg }}
          onClick={() => setIsPreviewOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsPreviewOpen(true)
            }
          }}
          aria-label="点击预览图表"
        />
      </div>
      {isPreviewOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 mermaid-preview-fade-in cursor-pointer p-4"
            onClick={() => setIsPreviewOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="图表预览"
          >
            <div
              className="mermaid-preview-scale-in cursor-auto"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          </div>,
          document.body
        )}
    </>
  )
}

