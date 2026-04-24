import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const Terminal = lazy(() => import('./pages/Terminal.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))

function PageShell({ children }) {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass rounded-2xl px-6 py-4 text-sm text-text-secondary">
            Loading…
          </div>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageShell>
                <Landing />
              </PageShell>
            }
          />
          <Route
            path="/terminal"
            element={
              <PageShell>
                <Terminal />
              </PageShell>
            }
          />
          <Route
            path="/admin"
            element={
              <PageShell>
                <Admin />
              </PageShell>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default App
