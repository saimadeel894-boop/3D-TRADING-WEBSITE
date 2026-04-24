import { memo, useEffect, useMemo, useRef, useState } from 'react'

function fmt(n, sym) {
  const d = sym.includes('BTC') || sym.includes('ETH') || sym.includes('SOL') || sym.includes('BNB') || sym.includes('XRP') ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

function label(p) {
  return p.replace('usdt', '/USDT').toUpperCase()
}

const EXTRA_PAIRS = [
  { key: 'EUR/USD', symbol: 'EUR/USD', type: 'FOREX', price: 1.0842 },
  { key: 'GBP/USD', symbol: 'GBP/USD', type: 'FOREX', price: 1.2764 },
  { key: 'USD/JPY', symbol: 'USD/JPY', type: 'FOREX', price: 153.42 },
  { key: 'AUD/USD', symbol: 'AUD/USD', type: 'FOREX', price: 0.6621 },
  { key: 'USD/CAD', symbol: 'USD/CAD', type: 'FOREX', price: 1.3618 },
  { key: 'EUR/GBP', symbol: 'EUR/GBP', type: 'FOREX', price: 0.8492 },
  { key: 'USD/CHF', symbol: 'USD/CHF', type: 'FOREX', price: 0.9034 },
  { key: 'NZD/USD', symbol: 'NZD/USD', type: 'FOREX', price: 0.6112 },
  { key: 'EUR/JPY', symbol: 'EUR/JPY', type: 'FOREX', price: 166.32 },
  { key: 'GBP/JPY', symbol: 'GBP/JPY', type: 'FOREX', price: 195.74 },
  { key: 'OTC EUR', symbol: 'OTC EUR', type: 'OTC', price: 1.0831 },
  { key: 'OTC GBP', symbol: 'OTC GBP', type: 'OTC', price: 1.2741 },
]

function PairSidebar({ pairs, tickers, selected, onSelect }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [extras, setExtras] = useState(EXTRA_PAIRS)
  const [flashMap, setFlashMap] = useState({})
  const prevPriceRef = useRef({})
  const flashTimersRef = useRef({})

  useEffect(() => {
    const id = window.setInterval(() => {
      setExtras((prev) =>
        prev.map((row) => {
          const drift = (Math.random() - 0.5) * 0.0012
          return {
            ...row,
            price: row.price * (1 + drift),
            change: drift * 100,
          }
        }),
      )
    }, 1200)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const nextFlashes = {}
    for (const p of pairs || []) {
      const key = p.toUpperCase()
      const next = tickers?.[key]?.price
      const prev = prevPriceRef.current[key]
      if (Number.isFinite(prev) && Number.isFinite(next) && prev !== next) {
        nextFlashes[p] = next > prev ? 'flash-green' : 'flash-red'
        if (flashTimersRef.current[p]) window.clearTimeout(flashTimersRef.current[p])
        flashTimersRef.current[p] = window.setTimeout(() => {
          setFlashMap((m) => {
            if (!m[p]) return m
            const n = { ...m }
            delete n[p]
            return n
          })
          delete flashTimersRef.current[p]
        }, 300)
      }
      if (Number.isFinite(next)) prevPriceRef.current[key] = next
    }
    if (Object.keys(nextFlashes).length) {
      setFlashMap((m) => ({ ...m, ...nextFlashes }))
    }
  }, [pairs, tickers])

  useEffect(
    () => () => {
      for (const t of Object.values(flashTimersRef.current)) window.clearTimeout(t)
    },
    [],
  )

  const rows = useMemo(() => {
    const cryptoRows = (pairs || []).map((p) => {
      const key = p.toUpperCase()
      const t = tickers?.[key]
      return {
        key: p,
        symbol: label(p),
        type: 'CRYPTO',
        price: t?.price ?? 0,
        change: Number.parseFloat(t?.change ?? '0'),
      }
    })
    return [...cryptoRows, ...extras]
  }, [pairs, tickers, extras])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return rows.filter((r) => {
      const typeMatch = filter === 'ALL' ? true : r.type === filter
      const searchMatch = !qq ? true : r.symbol.toLowerCase().includes(qq)
      return typeMatch && searchMatch
    })
  }, [rows, q, filter])

  return (
    <div className="glass pairSidebar" style={{ borderRadius: 18, padding: 12, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Pairs</div>
        <div className="pill mono" style={{ color: 'var(--cyan)' }}>
          LIVE
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
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {['ALL', 'FOREX', 'OTC', 'CRYPTO'].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            className="mono"
            style={{
              borderRadius: 999,
              padding: '5px 8px',
              border: '1px solid var(--border)',
              background: filter === name ? 'rgba(0,212,255,0.10)' : 'rgba(255,255,255,0.02)',
              color: filter === name ? 'var(--text)' : 'var(--muted)',
              fontSize: 10,
              letterSpacing: '0.14em',
              cursor: 'none',
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div style={{ height: 'calc(100% - 112px)', overflow: 'auto', paddingRight: 4 }}>
        {filtered.map((row) => {
          const sym = row.symbol
          const price = row.price
          const change = Number.parseFloat(row.change ?? '0')
          const isSel = row.key === selected
          const up = change >= 0
          return (
            <button
              key={row.key}
              type="button"
              onClick={() => onSelect(row.key)}
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
                  <div style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{sym}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{row.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`mono ${flashMap[row.key] || ''}`} style={{ fontWeight: 700 }}>
                    {price ? fmt(price, sym) : '—'}
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
                    {change.toFixed(2)}%
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

export default memo(PairSidebar)

