import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AnimatedList from './components/AnimatedList'
import Antigravity from './components/Antigravity'
import ElectricBorder from './components/ElectricBorder'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [effectColor, setEffectColor] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const colorParam = params.get('color')
    if (!colorParam) return '#ff2929'
    if (colorParam === 'blue') return '#2d7cff'
    if (colorParam.startsWith('#')) return colorParam
    if (/^[0-9a-fA-F]{6}$/.test(colorParam)) return `#${colorParam}`
    return '#ff2929'
  })

  const items = useMemo(
    () => [
      'test',
      'surprise me',
      'Item 3',
      'Item 4',
      'Item 5',
      'Item 6',
      'Item 7',
      'Item 8',
      'Item 9',
      'Item 10',
      'Item 11',
      'Item 12',
      'Item 13',
      'Item 14',
      'Item 15'
    ],
    []
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        setSidebarOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div
          className="sidebar-rail"
          onClick={() => setSidebarOpen(prev => !prev)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setSidebarOpen(prev => !prev)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Toggle sidebar"
        >
          <span className="sr-only">Toggle sidebar (Alt+P)</span>
        </div>
        <div className="sidebar-inner">
          <ElectricBorder className="sidebar-border" color={effectColor} thickness={2} chaos={0.9} speed={1.1}>
            <AnimatedList
              items={items}
              onItemSelect={(item, index) => {
                if (index === 0) {
                  const nextUrl = new URL(window.location.href)
                  nextUrl.searchParams.set('color', 'blue')
                  window.location.href = nextUrl.toString()
                  return
                }
                if (index === 1) {
                  const palette = ['#ff2929', '#2d7cff', '#00f5d4', '#ffd166', '#b5179e']
                  const next = palette[Math.floor(Math.random() * palette.length)]
                  setEffectColor(next)
                  const nextUrl = new URL(window.location.href)
                  nextUrl.searchParams.set('color', next.replace('#', ''))
                  window.history.replaceState({}, '', nextUrl)
                  return
                }
                console.log(item, index)
              }}
              showGradients
              enableArrowNavigation
              displayScrollbar
            />
          </ElectricBorder>
        </div>
      </aside>

      <main className="content">
        <div className="effects">
          <div className="effect-layer">
            <Antigravity
              count={1000}
              magnetRadius={5}
              ringRadius={5}
              waveSpeed={0.1}
              waveAmplitude={1}
              particleSize={1.5}
              lerpSpeed={0.05}
              color={effectColor}
              autoAnimate
              particleVariance={1}
              rotationSpeed={0}
              depthFactor={1}
              pulseSpeed={3}
              particleShape="capsule"
              fieldStrength={10}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
