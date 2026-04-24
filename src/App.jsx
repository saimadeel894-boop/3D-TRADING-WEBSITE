import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import TradingTerminal from './pages/TradingTerminal.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import P2PMarketplace from './pages/P2PMarketplace.jsx'

function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef(0)
  const dirty = useRef(false)

  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      dirty.current = true
    }

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.14
      ring.current.y += (pos.current.y - ring.current.y) * 0.14
      const r = ringRef.current
      if (r) r.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      if (dirty.current) {
        const d = dotRef.current
        if (d) d.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
        dirty.current = false
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursorRing" />
      <div ref={dotRef} className="cursorDot" />
    </>
  )
}

function PageShell({ children }) {
  return <div className="min-h-screen scanlines noise">{children}</div>
}

export default function App() {
  return (
    <>
      <Cursor />
      <Routes>
        <Route
          path="/"
          element={
            <PageShell>
              <TradingTerminal />
            </PageShell>
          }
        />
        <Route
          path="/admin"
          element={
            <PageShell>
              <AdminDashboard />
            </PageShell>
          }
        />
        <Route
          path="/p2p"
          element={
            <PageShell>
              <P2PMarketplace />
            </PageShell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
