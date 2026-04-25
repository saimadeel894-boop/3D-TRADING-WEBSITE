import { memo, useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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

function fmt(n, d) {
  const dec = typeof d === 'number' ? d : n >= 1000 ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

function TopNav({ ticker, connectionStatus = 'connecting', balance = 0 }) {
  const nav = useNavigate()
  const [items, setItems] = useState(ticker || [])

  useEffect(() => setItems(ticker || []), [ticker])

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
    <div style={{ position: 'relative', zIndex: 1, padding: '10px 16px 8px' }}>
      <div
        className="glass"
        style={{
          borderRadius: 18,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 52,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 280 }}>
          <HexLogo />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontWeight: 900, letterSpacing: '-0.03em', fontSize: 16 }}>
                VERTEX<span style={{ color: 'var(--cyan)' }}>PRO</span>
              </div>
              <span className="pill mono" style={{ color: 'var(--gold)' }}>
                ELITE TRADING SYSTEM
              </span>
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
              justifyContent: 'flex-start',
              gap: 24,
              padding: '10px 12px',
              borderRadius: 999,
              border: '1px solid rgba(0,180,255,0.08)',
              background: 'rgba(255,255,255,0.015)',
              overflow: 'hidden',
              cursor: 'none',
            }}
          >
            {items.slice(0, 4).map((it, idx) => {
              const up = it.change >= 0
              return (
                <div
                  key={it.symbol}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 2,
                    minWidth: 120,
                    borderRight: idx < 3 ? '1px solid rgba(0,180,255,0.15)' : 'none',
                    paddingRight: idx < 3 ? 16 : 0,
                  }}
                >
                  <div style={{ fontWeight: 800, color: 'var(--text)' }}>{it.symbol}</div>
                  <div style={{ color: 'rgba(223,240,255,0.82)' }}>${fmt(it.price)}</div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="pill mono" style={{ color: 'rgba(223,240,255,0.86)' }}>
              BAL ${fmt(balance, 0)}
            </div>
            <div
              title={`Connection: ${connectionStatus}`}
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.18)',
                background:
                  connectionStatus === 'connected'
                    ? 'rgba(0,230,118,0.95)'
                    : connectionStatus === 'disconnected'
                      ? 'rgba(255,61,113,0.95)'
                      : 'rgba(240,180,41,0.95)',
                boxShadow:
                  connectionStatus === 'connected'
                    ? '0 0 16px rgba(0,230,118,0.25)'
                    : connectionStatus === 'disconnected'
                      ? '0 0 16px rgba(255,61,113,0.25)'
                      : '0 0 16px rgba(240,180,41,0.25)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TopNav)

