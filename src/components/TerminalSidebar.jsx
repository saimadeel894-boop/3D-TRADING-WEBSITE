import {
  Activity,
  CandlestickChart,
  Layers,
  LayoutGrid,
  Shield,
  Sliders,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { icon: LayoutGrid, label: 'Home', to: '/' },
  { icon: CandlestickChart, label: 'Terminal', to: '/terminal' },
  { icon: Sliders, label: 'Orders', to: '/terminal' },
  { icon: Activity, label: 'Positions', to: '/terminal' },
  { icon: Layers, label: 'Markets', to: '/terminal' },
  { icon: Shield, label: 'Admin', to: '/admin' },
]

export default function TerminalSidebar() {
  return (
    <div className="glass h-full w-[52px] rounded-3xl p-2">
      <div className="flex h-full flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <div className="mb-1 grid h-10 w-10 place-items-center rounded-2xl border border-glass bg-white/5 text-xs font-extrabold tracking-[-0.06em] text-text-primary">
            V
          </div>
          {items.map((it) => (
            <NavLink
              key={it.label}
              to={it.to}
              title={it.label}
              className={({ isActive }) =>
                [
                  'grid h-10 w-10 place-items-center rounded-2xl border transition-colors',
                  isActive
                    ? 'border-blue-400/25 bg-blue-500/10 text-blue-200 shadow-[0_0_18px_rgba(59,130,246,0.22)]'
                    : 'border-transparent bg-white/0 text-text-secondary hover:border-glass hover:bg-white/5 hover:text-text-primary',
                ].join(' ')
              }
            >
              <it.icon className="h-5 w-5" />
            </NavLink>
          ))}
        </div>

        <div className="mb-1 grid h-10 w-10 place-items-center rounded-2xl border border-glass bg-white/5 text-[11px] font-semibold text-text-secondary">
          99
        </div>
      </div>
    </div>
  )
}

