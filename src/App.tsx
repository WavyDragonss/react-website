import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AnimatedList from './components/AnimatedList'
import Antigravity from './components/Antigravity'
import ElectricBorder from './components/ElectricBorder'
import Prism from './components/Prism'
import GlassIcons from './components/GlassIcons'
import Folder from './components/Folder'
import { FiBarChart2, FiBook, FiCloud, FiEdit, FiFileText, FiHeart } from 'react-icons/fi'
import FloatingLines from './components/FloatingLines'
import dragon1 from './assets/img/dragon1.png'
import dragon2 from './assets/img/dragon2.png'
import dragon3 from './assets/img/dragon3.png'

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
      'Prism test',
      'Desktop',
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

  const [activeView, setActiveView] = useState<'field' | 'prism' | 'desktop'>('field')

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
                if (index === 2) {
                  setActiveView('prism')
                  return
                }
                if (index === 3) {
                  setActiveView('desktop')
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
        <div className="workspace">
          {activeView === 'desktop' ? (
            <div className="workspace-bg">
              <FloatingLines
                enabledWaves={['top', 'middle', 'bottom']}
                lineCount={5}
                lineDistance={5}
                bendRadius={5}
                bendStrength={-0.5}
                interactive
                parallax
              />
            </div>
          ) : (
            <div className="workspace-bg">
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
          )}

          <div className="workspace-content">
            {activeView === 'prism' && (
              <div className="panel panel-full">
                <Prism
                  animationType="rotate"
                  timeScale={0.5}
                  height={3.5}
                  baseWidth={5.5}
                  scale={3.6}
                  hueShift={0}
                  colorFrequency={1}
                  noise={0}
                  glow={1}
                />
              </div>
            )}

            {activeView === 'desktop' && (
              <div className="desktop-view">
                <div className="desktop-grid">
                  <div className="panel desktop-panel folder-panel">
                  <div className="panel-title">Project Folder</div>
                  <div className="folder-wrap">
                      <Folder
                        color="#5227FF"
                        size={2}
                        items={[
                          <img key="dragon1" src={dragon1} alt="Dragon scene 1" className="folder-item" />,
                          <img key="dragon2" src={dragon2} alt="Dragon scene 2" className="folder-item" />,
                          <img key="dragon3" src={dragon3} alt="Dragon scene 3" className="folder-item" />
                        ]}
                      />
                  </div>
                </div>
                  <div className="panel desktop-panel quick-panel">
                    <div className="panel-title">Quick Launch</div>
                    <GlassIcons
                      items={[
                        { icon: <FiFileText />, color: 'blue', label: 'Files' },
                        { icon: <FiBook />, color: 'purple', label: 'Books' },
                        { icon: <FiHeart />, color: 'red', label: 'Health' },
                        { icon: <FiCloud />, color: 'indigo', label: 'Weather' },
                        { icon: <FiEdit />, color: 'orange', label: 'Notes' },
                        { icon: <FiBarChart2 />, color: 'green', label: 'Stats' }
                      ]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
