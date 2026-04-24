import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TradingTerminal from './pages/TradingTerminal.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import P2PMarketplace from './pages/P2PMarketplace.jsx'

function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      document.body.style.setProperty('--x', `${e.clientX}px`)
      document.body.style.setProperty('--y', `${e.clientY}px`)
      const d = dotRef.current
      if (d) d.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
    }

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.14
      ring.current.y += (pos.current.y - ring.current.y) * 0.14
      const r = ringRef.current
      if (r) r.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
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
  return (
    <motion.div
      className="min-h-screen scanlines noise scanlineSweep"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <Cursor />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
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
      </AnimatePresence>
    </>
  )
}
