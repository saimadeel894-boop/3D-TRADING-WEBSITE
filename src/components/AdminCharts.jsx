import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import TiltCard from './TiltCard.jsx'
import { useInView } from '../hooks/useInView.js'

const revenueData = [
  { day: 'Mon', v: 102 },
  { day: 'Tue', v: 118 },
  { day: 'Wed', v: 124 },
  { day: 'Thu', v: 142 },
  { day: 'Fri', v: 136 },
  { day: 'Sat', v: 154 },
  { day: 'Sun', v: 168 },
]

const regData = [
  { day: 'Mon', v: 3200 },
  { day: 'Tue', v: 4050 },
  { day: 'Wed', v: 4380 },
  { day: 'Thu', v: 5120 },
  { day: 'Fri', v: 4890 },
  { day: 'Sat', v: 5360 },
  { day: 'Sun', v: 6020 },
]

function Tip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-2xl px-3 py-2 text-xs text-text-primary">
      <div className="tabular-nums font-semibold">{payload[0].value}</div>
    </div>
  )
}

export default function AdminCharts() {
  const { ref: refA, inView: inA } = useInView()
  const { ref: refB, inView: inB } = useInView()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <motion.div
        ref={refA}
        initial={{ opacity: 0, y: 14 }}
        animate={inA ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <TiltCard className="glass rounded-3xl p-4">
          <div className="flex items-center justify-between pb-3">
            <div className="text-sm font-semibold text-text-primary">Revenue (7d)</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">USD</div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0.0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.10)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(148,163,184,0.35)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148,163,184,0.35)" tickLine={false} axisLine={false} width={36} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="v" stroke="rgba(147,197,253,0.9)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TiltCard>
      </motion.div>

      <motion.div
        ref={refB}
        initial={{ opacity: 0, y: 14 }}
        animate={inB ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      >
        <TiltCard className="glass rounded-3xl p-4">
          <div className="flex items-center justify-between pb-3">
            <div className="text-sm font-semibold text-text-primary">Registrations (7d)</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Users</div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regData} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.10)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(148,163,184,0.35)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148,163,184,0.35)" tickLine={false} axisLine={false} width={36} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="v" fill="rgba(139,92,246,0.55)" radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TiltCard>
      </motion.div>
    </div>
  )
}

