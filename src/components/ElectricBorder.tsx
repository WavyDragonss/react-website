import React, { CSSProperties, PropsWithChildren, useId, useLayoutEffect, useRef, useState } from 'react'
import './ElectricBorder.css'

interface ElectricBorderProps extends PropsWithChildren {
  color?: string
  speed?: number
  chaos?: number
  thickness?: number
  className?: string
  style?: CSSProperties
  radius?: number
}

const parseRadius = (value: CSSProperties['borderRadius'], fallback: number) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#ff2929',
  speed = 1,
  chaos = 1,
  thickness = 2,
  className = '',
  style,
  radius
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const filterId = useId().replace(/:/g, '')
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const node = wrapperRef.current
    if (!node) return
    const resize = () => {
      setSize({ width: node.clientWidth, height: node.clientHeight })
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const borderRadius = radius ?? parseRadius(style?.borderRadius, 16)

  return (
    <div ref={wrapperRef} className={`electric-border ${className}`} style={{ ...style, borderRadius }}>
      <svg
        className="electric-border-svg"
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.015 * chaos}
              numOctaves={1}
              seed={2}
            >
              <animate
                attributeName="baseFrequency"
                dur={`${Math.max(0.4, 1.6 - speed)}s`}
                values={`${0.012 * chaos};${0.02 * chaos};${0.012 * chaos}`}
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale={22 * chaos} />
          </filter>
        </defs>
        <rect
          x={thickness / 2}
          y={thickness / 2}
          width={Math.max(0, size.width - thickness)}
          height={Math.max(0, size.height - thickness)}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          filter={`url(#${filterId})`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="electric-border-inner">{children}</div>
    </div>
  )
}

export default ElectricBorder
