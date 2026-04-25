import { memo, useEffect, useMemo, useRef, useState } from 'react'

function fmt(n, sym) {
  const d = sym.includes('BTC') || sym.includes('ETH') || sym.includes('SOL') || sym.includes('BNB') || sym.includes('XRP') ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

const allPairs = [
  // CRYPTO
  {name:'BTC/USDT', category:'crypto', base:77685},
  {name:'ETH/USDT', category:'crypto', base:2315},
  {name:'SOL/USDT', category:'crypto', base:86.36},
  {name:'BNB/USDT', category:'crypto', base:637},
  {name:'XRP/USDT', category:'crypto', base:1.44},
  // FOREX
  {name:'EUR/USD',  category:'forex', base:1.0842},
  {name:'GBP/USD',  category:'forex', base:1.2765},
  {name:'USD/JPY',  category:'forex', base:154.82},
  {name:'AUD/USD',  category:'forex', base:0.6534},
  {name:'USD/CAD',  category:'forex', base:1.3621},
  {name:'EUR/GBP',  category:'forex', base:0.8489},
  {name:'USD/CHF',  category:'forex', base:0.9012},
  {name:'NZD/USD',  category:'forex', base:0.6022},
  {name:'EUR/JPY',  category:'forex', base:167.43},
  {name:'GBP/JPY',  category:'forex', base:197.65},
  // OTC
  {name:'OTC EUR',  category:'otc',   base:1.0890},
  {name:'OTC GBP',  category:'otc',   base:1.2712},
];

function PairSidebar({ tickers, selected, onSelect }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [simulatedPrices, setSimulatedPrices] = useState(() => 
    allPairs.map(p => ({ ...p, price: p.base, change: 0 }))
  )
  const [flashMap, setFlashMap] = useState({})
  const flashTimersRef = useRef({})

  useEffect(() => {
    const id = window.setInterval(() => {
      setSimulatedPrices((prev) =>
        prev.map((row) => {
          // Sync with real tickers if crypto and available
          const isCrypto = row.category === 'crypto';
          const tKey = row.name.replace('/', '').toUpperCase();
          const realTicker = tickers?.[tKey];
          
          if (isCrypto && realTicker?.price) {
            return {
              ...row,
              price: realTicker.price,
              change: Number.parseFloat(realTicker.change ?? '0')
            }
          }
          
          const drift = (Math.random() - 0.5) * 0.0012;
          return {
            ...row,
            price: row.price * (1 + drift),
            change: drift * 100,
          }
        })
      )
    }, 1200)
    return () => window.clearInterval(id)
  }, [tickers])

  useEffect(() => {
    return () => {
      for (const t of Object.values(flashTimersRef.current)) window.clearTimeout(t)
    }
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return simulatedPrices.filter((r) => {
      const typeMatch = filter === 'ALL' ? true : r.category.toUpperCase() === filter
      const searchMatch = !qq ? true : r.name.toLowerCase().includes(qq)
      return typeMatch && searchMatch
    })
  }, [simulatedPrices, q, filter])

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
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 4 }}>
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
              flexShrink: 0,
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div style={{ height: 'calc(100% - 112px)', overflow: 'auto', paddingRight: 4 }}>
        {filtered.map((row) => {
          const sym = row.name
          const price = row.price
          const change = row.change
          const rowKey = row.category === 'crypto' ? row.name.replace('/', '').toLowerCase() : row.name
          const isSel = rowKey === selected
          const up = change >= 0
          return (
            <button
              key={rowKey}
              type="button"
              onClick={() => onSelect(rowKey)}
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
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{row.category.toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`mono ${flashMap[rowKey] || ''}`} style={{ fontWeight: 700 }}>
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

