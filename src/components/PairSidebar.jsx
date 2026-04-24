import { useEffect, useMemo, useState } from 'react'

const PAIRS = [
  { symbol: 'EUR/USD', type: 'FOREX', base: 1.0842 },
  { symbol: 'GBP/USD', type: 'FOREX', base: 1.2764 },
  { symbol: 'USD/JPY', type: 'FOREX', base: 153.42 },
  { symbol: 'AUD/USD', type: 'FOREX', base: 0.6621 },
  { symbol: 'USD/CAD', type: 'FOREX', base: 1.3618 },
  { symbol: 'EUR/GBP', type: 'FOREX', base: 0.8492 },
  { symbol: 'USD/CHF', type: 'FOREX', base: 0.9034 },
  { symbol: 'NZD/USD', type: 'FOREX', base: 0.6112 },
  { symbol: 'EUR/JPY', type: 'FOREX', base: 166.32 },
  { symbol: 'GBP/JPY', type: 'FOREX', base: 195.74 },
  { symbol: 'OTC EUR', type: 'OTC', base: 1.0831 },
  { symbol: 'OTC GBP', type: 'OTC', base: 1.2741 },
  { symbol: 'BTC/USD', type: 'CRYPTO', base: 67842.3 },
  { symbol: 'ETH/USD', type: 'CRYPTO', base: 3524.8 },
  { symbol: 'AUD/JPY', type: 'FOREX', base: 101.42 },
  { symbol: 'EUR/AUD', type: 'FOREX', base: 1.6418 },
]

function fmt(n, sym) {
  const d = sym.includes('JPY') ? 2 : sym.includes('BTC') ? 2 : sym.includes('ETH') ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

function drift(symbol) {
  if (symbol.includes('BTC')) return 0.0032
  if (symbol.includes('ETH')) return 0.004
  if (symbol.includes('JPY')) return 0.0015
  return 0.0012
}

export default function PairSidebar({ selected, onSelect }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [rows, setRows] = useState(() =>
    PAIRS.map((p) => ({ ...p, price: p.base, change: (Math.random() - 0.5) * 0.6 })),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const pct = drift(r.symbol)
          const noise = (Math.random() - 0.5) * 2
          const delta = noise * pct
          const next = r.price * (1 + delta)
          const ch = Math.max(-9.9, Math.min(9.9, r.change + delta * 100 * 0.25))
          return { ...r, price: next, change: ch }
        }),
      )
    }, 1200)
    return () => clearInterval(id)
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return rows.filter((r) => {
      const okType = filter === 'ALL' ? true : r.type === filter
      const okQ = !qq ? true : r.symbol.toLowerCase().includes(qq)
      return okType && okQ
    })
  }, [filter, q, rows])

  const btn = (id, label) => (
    <button
      type="button"
      onClick={() => setFilter(id)}
      className="mono"
      style={{
        borderRadius: 999,
        padding: '6px 10px',
        border: '1px solid var(--border)',
        background: filter === id ? 'rgba(0,212,255,0.10)' : 'rgba(255,255,255,0.02)',
        color: filter === id ? 'var(--text)' : 'var(--muted)',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: 'none',
      }}
    >
      {label}
    </button>
  )

  return (
    <div className="glass" style={{ borderRadius: 18, padding: 12, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Pairs</div>
        <div className="pill mono" style={{ color: 'var(--cyan)' }}>
          16 LIVE
        </div>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search pairs…"
        className="mono"
        style={{
          width: '100%',
          borderRadius: 14,
          padding: '10px 12px',
          border: '1px solid var(--border)',
          background: 'rgba(255,255,255,0.03)',
          color: 'var(--text)',
          outline: 'none',
          marginBottom: 10,
          cursor: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {btn('ALL', 'ALL')}
        {btn('FOREX', 'FOREX')}
        {btn('OTC', 'OTC')}
        {btn('CRYPTO', 'CRYPTO')}
      </div>

      <div style={{ height: 'calc(100% - 118px)', overflow: 'auto', paddingRight: 4 }}>
        {filtered.map((r) => {
          const isSel = r.symbol === selected
          const up = r.change >= 0
          return (
            <button
              key={r.symbol}
              type="button"
              onClick={() => onSelect(r.symbol)}
              style={{
                width: '100%',
                textAlign: 'left',
                border: '1px solid rgba(0,0,0,0)',
                background: isSel ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.01)',
                borderRadius: 14,
                padding: '10px 10px 10px 12px',
                marginBottom: 8,
                cursor: 'none',
                position: 'relative',
              }}
              className="glass-hover"
            >
              {isSel ? (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 10,
                    bottom: 10,
                    width: 3,
                    borderRadius: 999,
                    background: 'var(--cyan)',
                    boxShadow: '0 0 16px rgba(0,212,255,0.35)',
                  }}
                />
              ) : null}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{r.symbol}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    {r.type}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontWeight: 700 }}>
                    {fmt(r.price, r.symbol)}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      marginTop: 2,
                      color: up ? 'var(--green)' : 'var(--red)',
                    }}
                  >
                    {up ? '+' : ''}
                    {r.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

