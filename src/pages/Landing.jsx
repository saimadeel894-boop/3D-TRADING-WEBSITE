import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import Globe3D from '../components/Globe3D.jsx'
import Navbar from '../components/Navbar.jsx'
import ParticlesBackground from '../components/ParticlesBackground.jsx'
import { useRafCountUp } from '../hooks/useRafCountUp.js'
import CinematicRays from '../components/CinematicRays.jsx'

function splitLetters(text) {
  return [...text]
}

function Stat({ label, value, format }) {
  const v = useRafCountUp({ to: value, durationMs: 1400, start: true })
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-[1px] bg-white/10" />
      <div className="min-w-[110px]">
        <div className="tabular-nums text-sm font-semibold text-text-primary">
          {format(v)}
        </div>
        <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">{label}</div>
      </div>
    </div>
  )
}

export default function Landing() {
  const title = 'VERTEX TRADING'
  const subtitle = 'The Future of Professional Trading'

  return (
    <div className="relative min-h-screen overflow-hidden noise">
      <Navbar />
      <div className="absolute inset-0 bg-hero-linear" />
      <div className="absolute inset-0 bg-hero-radial" />
      <ParticlesBackground density={160} speed={0.1} />
      <CinematicRays />

      <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[12%] top-[20%] h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 pt-28">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-glass bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-text-secondary"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />
              Live-grade UI / 3D / Motion
            </motion.div>

            <div className="mt-7">
              <div className="leading-[0.92]">
                <motion.h1
                  className="text-glow text-[44px] font-extrabold tracking-[-0.06em] text-text-primary sm:text-[56px] lg:text-[64px]"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
                  }}
                >
                  {splitLetters(title).map((ch, idx) => (
                    <motion.span
                      key={`${ch}-${idx}`}
                      className="inline-block"
                      variants={{
                        hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
                        show: {
                          opacity: 1,
                          y: 0,
                          filter: 'blur(0px)',
                          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                    >
                      {ch === ' ' ? '\u00A0' : ch}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>

              <motion.p
                className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-[16px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {subtitle}
              </motion.p>
            </div>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/terminal"
                className="group relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-blue-500/30 to-purple-500/10 px-5 py-3 text-sm font-semibold text-text-primary shadow-glow transition-transform duration-200 hover:-translate-y-[1px]"
              >
                <span className="absolute inset-0 rounded-2xl ring-glow opacity-80" />
                <span className="relative">Launch Terminal</span>
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center justify-center rounded-2xl border border-glass bg-white/5 px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-white/10"
              >
                View Admin Panel
              </Link>
            </motion.div>

            <motion.div
              className="mt-10 glass glass-hover flex flex-wrap items-center gap-5 rounded-3xl px-5 py-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-2xl border border-glass bg-white/5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />
                </div>
                <div>
                  <div className="tabular-nums text-sm font-semibold text-text-primary">LIVE</div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">
                    Streaming data
                  </div>
                </div>
              </div>

              <Stat
                label="Volume"
                value={4_200_000_000}
                format={(x) => `$${(x / 1_000_000_000).toFixed(1)}B`}
              />
              <Stat
                label="Traders"
                value={2_400_000}
                format={(x) => `${(x / 1_000_000).toFixed(1)}M`}
              />
              <Stat label="Uptime" value={99.9} format={(x) => `${x.toFixed(1)}%`} />
              <Stat label="Pairs" value={30} format={(x) => `${Math.round(x)}+`} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass rounded-[44px] p-4 md:p-6">
              <div className="relative aspect-square overflow-hidden rounded-[36px] border border-glass bg-[#070a14]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(59,130,246,0.18),rgba(139,92,246,0.06),rgba(10,14,26,0))]" />
                <div className="absolute inset-0">
                  <Globe3D className="h-full w-full" bloom />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center pb-10 pt-6">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-glass bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-text-secondary"
          >
            Scroll
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <ArrowDown className="h-4 w-4 text-blue-300" />
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

