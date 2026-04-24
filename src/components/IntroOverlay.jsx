import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const KEY = 'vertex_intro_seen_v1'

export default function IntroOverlay() {
  const shouldShow = useMemo(() => {
    try {
      return sessionStorage.getItem(KEY) !== '1'
    } catch {
      return true
    }
  }, [])

  const [open, setOpen] = useState(shouldShow)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => setOpen(false), 1550)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (open) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      // ignore
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-[#050712]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(900px 420px at 50% 40%, rgba(59,130,246,0.22), rgba(139,92,246,0.10), rgba(10,14,26,0) 62%), radial-gradient(900px 600px at 50% 55%, rgba(16,185,129,0.06), rgba(10,14,26,0) 65%)',
              filter: 'blur(0px)',
            }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } }}
          />

          <motion.div
            className="absolute left-[-30%] top-[28%] h-[140px] w-[60%] rotate-[-14deg]"
            style={{
              background:
                'linear-gradient(90deg, rgba(10,14,26,0), rgba(219,234,254,0.18), rgba(59,130,246,0.24), rgba(10,14,26,0))',
              filter: 'blur(18px)',
              opacity: 0.9,
            }}
            initial={{ x: '-40%' }}
            animate={{ x: '190%', transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] } }}
          />

          <motion.div
            className="relative"
            initial={{ y: 18, opacity: 0, filter: 'blur(14px)' }}
            animate={{
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              filter: 'blur(10px)',
              transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <div className="glass rounded-[28px] px-7 py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-glass bg-white/5 shadow-[0_0_34px_rgba(59,130,246,0.25)]">
                <span className="text-lg font-extrabold tracking-[-0.06em] text-text-primary">V</span>
              </div>
              <div className="mt-4 text-[11px] uppercase tracking-[0.32em] text-text-muted">
                Ultra-Premium Trading Suite
              </div>
              <div className="mt-2 text-2xl font-extrabold tracking-[-0.06em] text-text-primary">
                VERTEX <span className="text-blue-200">TRADING</span>
              </div>
              <div className="mt-3 text-sm text-text-secondary">
                Initializing 3D pipelines & live-grade UI…
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

