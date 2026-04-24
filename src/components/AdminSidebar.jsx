import {
  BarChart3,
  CreditCard,
  FileText,
  Lock,
  Settings,
  Shield,
  Users,
  Wallet,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Dashboard', icon: BarChart3, to: '/admin' },
  { label: 'Users', icon: Users, to: '/admin' },
  { label: 'Trades', icon: FileText, to: '/admin' },
  { label: 'Markets', icon: Wallet, to: '/admin' },
  { label: 'Payments', icon: CreditCard, to: '/admin' },
  { label: 'Reports', icon: FileText, to: '/admin' },
  { label: 'Settings', icon: Settings, to: '/admin' },
  { label: 'Security', icon: Lock, to: '/admin' },
]

export default function AdminSidebar() {
  return (
    <div className="glass h-full rounded-3xl p-3">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-glass bg-white/5 text-xs font-extrabold tracking-[-0.06em] text-text-primary shadow-[0_0_18px_rgba(59,130,246,0.18)]">
            V
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-text-primary">Admin</div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Control center</div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-blue-500/10 text-blue-200 border border-blue-400/25 shadow-[0_0_18px_rgba(59,130,246,0.18)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent hover:border-glass',
                ].join(' ')
              }
            >
              <l.icon className="h-4 w-4" />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto rounded-2xl border border-glass bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl border border-glass bg-white/5">
              <Shield className="h-5 w-5 text-blue-200" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-text-primary">Risk Guard</div>
              <div className="truncate text-[11px] uppercase tracking-[0.22em] text-text-muted">
                Monitoring enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

