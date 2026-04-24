import { motion } from 'framer-motion'
import TiltCard from './TiltCard.jsx'
import { useInView } from '../hooks/useInView.js'

function sparkPath(points, w = 92, h = 26) {
  if (!points.length) return ''
  const min = Math.min(...points)
  const max = Math.max(...points)
  const rng = Math.max(1e-9, max - min)
  const step = w / (points.length - 1)
  let d = ''
  for (let i = 0; i < points.length; i += 1) {
    const x = i * step
    const y = h - ((points[i] - min) / rng) * h
    d += i === 0 ? `M${x},${y}` : ` L${x},${y}`
  }
  return d
}

export default function StatCard({ label, value, sub, icon: Icon, trend = 'up', spark = [] }) {
  const { ref, inView } = useInView()

  const color = trend === 'up' ? 'from-emerald-500/20 to-blue-500/10' : 'from-red-500/20 to-purple-500/10'
  const stroke = trend === 'up' ? 'rgba(52,211,153,0.85)' : 'rgba(248,113,113,0.85)'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="glass glass-hover rounded-3xl p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-text-muted">{label}</div>
            <div className="mt-1 tabular-nums text-[22px] font-semibold text-text-primary">{value}</div>
            <div className="mt-1 text-xs text-text-secondary">{sub}</div>
          </div>
          <div className={['grid h-11 w-11 place-items-center rounded-2xl border border-glass bg-gradient-to-b', color].join(' ')}>
            <Icon className="h-5 w-5 text-blue-200" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <svg width="92" height="26" viewBox="0 0 92 26" className="opacity-95">
            <path d={sparkPath(spark)} fill="none" stroke={stroke} strokeWidth="2" />
          </svg>
          <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">7d</div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

