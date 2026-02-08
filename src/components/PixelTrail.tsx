import React, { useEffect, useMemo, useRef, useState } from 'react'
import './PixelTrail.css'

interface PixelTrailProps {
  trailSize?: number
  maxAge?: number
  color?: string
  gooStrength?: number
  gridSize?: number
  className?: string
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  trailSize = 0.05,
  maxAge = 450,
  color = '#ff2929',
  gooStrength = 4,
  gridSize = 96,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pixelRefs = useRef<HTMLDivElement[]>([])
  const timeoutRefs = useRef<number[]>([])
  const [grid, setGrid] = useState({ columns: 0, rows: 0, pixelSize: 0 })

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const resize = () => {
      const rect = node.getBoundingClientRect()
      const pixelSize = Math.max(6, Math.floor(rect.width / gridSize))
      const columns = Math.max(1, Math.floor(rect.width / pixelSize))
      const rows = Math.max(1, Math.floor(rect.height / pixelSize))
      setGrid({ columns, rows, pixelSize })
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(node)
    return () => observer.disconnect()
  }, [gridSize])

  const pixelCount = grid.columns * grid.rows

  const indices = useMemo(() => Array.from({ length: pixelCount }, (_, i) => i), [pixelCount])

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => window.clearTimeout(timeout))
    }
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node || !grid.columns || !grid.rows) return

    const radius = Math.max(1, Math.round(grid.columns * trailSize))

    const activate = (index: number) => {
      const el = pixelRefs.current[index]
      if (!el) return
      el.classList.add('active')
      if (timeoutRefs.current[index]) {
        window.clearTimeout(timeoutRefs.current[index])
      }
      timeoutRefs.current[index] = window.setTimeout(() => {
        el.classList.remove('active')
      }, maxAge)
    }

    const handleMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return

      const col = Math.floor((x / rect.width) * grid.columns)
      const row = Math.floor((y / rect.height) * grid.rows)

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance > radius) continue
          const targetCol = col + dx
          const targetRow = row + dy
          if (targetCol < 0 || targetRow < 0 || targetCol >= grid.columns || targetRow >= grid.rows) continue
          const index = targetRow * grid.columns + targetCol
          activate(index)
        }
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [grid.columns, grid.rows, gridSize, maxAge, trailSize])

  return (
    <div
      ref={containerRef}
      className={`pixel-trail ${className}`}
      style={
        {
          '--pixel-color': color,
          '--pixel-fade': `${maxAge}ms`,
          '--pixel-size': `${grid.pixelSize}px`,
          '--pixel-goo': gooStrength,
          gridTemplateColumns: `repeat(${grid.columns || 1}, var(--pixel-size))`,
          gridTemplateRows: `repeat(${grid.rows || 1}, var(--pixel-size))`
        } as React.CSSProperties
      }
    >
      {indices.map(index => (
        <div
          key={index}
          className="pixel"
          ref={el => {
            if (el) pixelRefs.current[index] = el
          }}
        />
      ))}
    </div>
  )
}

export default PixelTrail
