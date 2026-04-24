import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'

function HexLogo() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        background: 'linear-gradient(135deg, rgba(0,212,255,0.95), rgba(139,92,246,0.85))',
        clipPath: 'polygon(25% 6%, 75% 6%, 96% 50%, 75% 94%, 25% 94%, 4% 50%)',
        boxShadow: '0 0 26px rgba(0,212,255,0.22), 0 0 46px rgba(139,92,246,0.14)',
        border: '1px solid rgba(0,212,255,0.22)',
      }}
    />
  )
}

function fmt(n) {
  const d = n >= 1000 ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

export default function TopNav({ ticker }) {
  const nav = useNavigate()
  const [items, setItems] = useState(ticker)

  useEffect(() => setItems(ticker), [ticker])

  const tabs = useMemo(
    () => [
      { to: '/', label: 'Terminal' },
      { to: '/p2p', label: 'P2P Market' },
      { to: '/admin', label: 'Admin Suite' },
      { to: '/', label: 'Portfolio' },
    ],
    [],
  )

  return (
    <div style={{ position: 'relative', zIndex: 10, padding: '14px 16px 10px' }}>
      <div
        className="glass"
        style={{
          borderRadius: 22,
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 280 }}>
          <HexLogo />
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontWeight: 900, letterSpacing: '-0.03em', fontSize: 16 }}>
                VERTEX<span style={{ color: 'var(--cyan)' }}>PRO</span>
              </div>
              <span className="pill mono" style={{ color: 'var(--gold)' }}>
                ELITE TRADING SYSTEM
              </span>
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              Low-latency execution • Escrow-grade security • Admin power suite
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {tabs.map((t) => (
            <NavLink
              key={t.label}
              to={t.to}
              className="mono"
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '9px 12px',
                borderRadius: 999,
                border: `1px solid ${isActive ? 'rgba(0,212,255,0.28)' : 'rgba(0,180,255,0.08)'}`,
                background: isActive ? 'rgba(0,212,255,0.07)' : 'rgba(255,255,255,0.015)',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: 11,
                cursor: 'none',
              })}
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: 520 }}>
          <div
            className="mono"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 999,
              border: '1px solid rgba(0,180,255,0.08)',
              background: 'rgba(255,255,255,0.015)',
              overflow: 'hidden',
              cursor: 'none',
            }}
          >
            {items.map((it) => {
              const up = it.change >= 0
              return (
                <div key={it.symbol} style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: 'var(--text)' }}>{it.symbol}</div>
                  <div style={{ color: 'rgba(223,240,255,0.82)' }}>{fmt(it.price)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: up ? 'var(--green)' : 'var(--red)' }}>
                    {up ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                    {up ? '+' : ''}
                    {it.change.toFixed(2)}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" className="btn mono" onClick={() => {}} style={{ cursor: 'none', borderRadius: 999 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Wallet size={16} /> DEPOSIT
            </span>
          </button>
          <button type="button" className="btn btnPrimary mono argusGlow" onClick={() => nav('/')} style={{ cursor: 'none', borderRadius: 999 }}>
            TRADE NOW
          </button>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              border: '1px solid rgba(0,212,255,0.22)',
              background: 'radial-gradient(circle at 30% 25%, rgba(0,212,255,0.35), rgba(139,92,246,0.10), rgba(255,255,255,0.02))',
              boxShadow: '0 0 18px rgba(0,212,255,0.18)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

