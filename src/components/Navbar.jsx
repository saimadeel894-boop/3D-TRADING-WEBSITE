import { Link, NavLink, useLocation } from 'react-router-dom'
import { Wallet } from 'lucide-react'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'text-[12px] tracking-[0.22em] uppercase transition-colors',
          isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const location = useLocation()
  const compact = location.pathname !== '/'

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto max-w-7xl px-5 pt-5">
        <div className="glass rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="group flex items-center gap-2 text-sm font-semibold text-text-primary"
            >
              <span className="relative grid h-8 w-8 place-items-center rounded-xl border border-glass bg-white/5">
                <span className="absolute inset-0 rounded-xl ring-glow opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="relative text-[12px] font-extrabold tracking-[-0.06em]">V</span>
              </span>
              <span className="tracking-[-0.02em]">VERTEX</span>
              <span className="text-text-muted">TRADING</span>
            </Link>

            <div className="hidden items-center gap-6 md:flex">
              <NavItem to="/">Landing</NavItem>
              <NavItem to="/terminal">Terminal</NavItem>
              <NavItem to="/admin">Admin</NavItem>
            </div>

            <div className="flex items-center gap-2">
              {!compact ? (
                <a
                  href="#launch"
                  className="hidden md:inline-flex items-center gap-2 rounded-xl border border-glass bg-white/5 px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary"
                >
                  Docs
                </a>
              ) : null}
              <button
                type="button"
                className="group relative inline-flex items-center gap-2 rounded-xl border border-glass bg-gradient-to-b from-blue-500/20 to-purple-500/10 px-3 py-2 text-xs font-semibold text-text-primary shadow-glow transition-transform duration-200 hover:-translate-y-[1px]"
              >
                <span className="absolute inset-0 rounded-xl ring-glow opacity-70" />
                <span className="relative inline-flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-blue-300" />
                  Connect Wallet
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

