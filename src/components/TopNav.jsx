import { memo, useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Wallet, User } from 'lucide-react'

function HexLogo() {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        background: 'linear-gradient(135deg, rgba(0,212,255,0.95), rgba(139,92,246,0.85))',
        clipPath: 'polygon(25% 6%, 75% 6%, 96% 50%, 75% 94%, 25% 94%, 4% 50%)',
        boxShadow: '0 0 16px rgba(0,212,255,0.22)',
      }}
    />
  )
}

function fmt(n, d) {
  const dec = typeof d === 'number' ? d : n >= 1000 ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

function TopNav() {
  const nav = useNavigate()
  
  const items = [
    { symbol: 'BTC/USDT', price: 77685.00, change: 0.16 },
    { symbol: 'ETH/USDT', price: 3450.20, change: -1.24 },
    { symbol: 'SOL/USDT', price: 142.60, change: 5.40 },
    { symbol: 'BNB/USDT', price: 590.10, change: 0.80 },
  ]

  const tabs = useMemo(
    () => [
      { to: '/', label: 'TERMINAL' },
      { to: '/p2p', label: 'P2P MARKET' },
      { to: '/admin', label: 'ADMIN SUITE' },
      { to: '/portfolio', label: 'PORTFOLIO' },
    ],
    [],
  )

  return (
    <div
      style={{
        height: '52px',
        background: 'rgba(4,10,20,0.97)',
        borderBottom: '1px solid rgba(0,180,255,0.1)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: '16px',
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Logo Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
        <HexLogo />
        <div style={{ fontWeight: 900, letterSpacing: '-0.03em', fontSize: 14 }}>
          VERTEX<span style={{ color: 'var(--cyan)' }}>PRO</span>
        </div>
        <div
          style={{
            background: 'rgba(240,180,41,0.1)',
            color: 'var(--gold)',
            fontSize: 9,
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: 4,
            border: '1px solid rgba(240,180,41,0.2)',
          }}
        >
          ELITE
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {tabs.map((t) => (
          <NavLink
            key={t.label}
            to={t.to}
            className="mono"
            style={({ isActive }) => ({
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: 6,
              background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
              color: isActive ? 'var(--text)' : 'var(--muted)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.05em',
            })}
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Ticker Strip */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        {items.map((it, idx) => {
          const up = it.change >= 0
          return (
            <div
              key={it.symbol}
              style={{
                minWidth: 110,
                paddingRight: 14,
                paddingLeft: idx > 0 ? 14 : 0,
                borderRight: '1px solid rgba(0,180,255,0.12)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: 9, color: '#4a7a9b', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em' }}>
                {it.symbol}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono', color: up ? '#00e676' : '#ff3d71' }}>
                  ${fmt(it.price)}
                </div>
                <div style={{ fontSize: 9, color: up ? '#00e676' : '#ff3d71' }}>
                  {up ? '▲' : '▼'} {up ? '+' : ''}{it.change.toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderLeft: '1px solid rgba(0,180,255,0.1)', paddingLeft: 16 }}>
        <button
          style={{
            border: '1px solid rgba(0,212,255,0.4)',
            background: 'transparent',
            color: 'var(--text)',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'none',
          }}
        >
          <Wallet size={12} /> DEPOSIT
        </button>
        <button
          onClick={() => nav('/')}
          style={{
            background: 'var(--cyan)',
            color: '#000',
            border: 'none',
            padding: '6px 16px',
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 800,
            cursor: 'none',
          }}
        >
          TRADE NOW
        </button>
        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--text)' }}>
          BAL $25,000
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.2)',
            border: '1px solid rgba(139,92,246,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <User size={14} color="var(--purple)" />
        </div>
      </div>
    </div>
  )
}

export default memo(TopNav)


