import { memo, useEffect, useMemo, useRef, useState } from 'react'

function fmt(n, sym) {
  const d = sym.includes('BTC') || sym.includes('ETH') || sym.includes('SOL') || sym.includes('BNB') || sym.includes('XRP') ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

function label(p) {
  return p.replace('usdt', '/USDT').toUpperCase()
}

function PairSidebar({ pairs, tickers, selected, onSelect }) {
  const [q, setQ] = useState('')
  const [flashMap, setFlashMap] = useState({})
  const prevPriceRef = useRef({})
  const flashTimersRef = useRef({})

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

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return (pairs || []).filter((p) => (!qq ? true : label(p).toLowerCase().includes(qq)))
  }, [pairs, q])

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
      <div className="pairListScroll" style={{ height: 'calc(100% - 76px)', overflow: 'auto', paddingRight: 4 }}>
        {filtered.map((p) => {
          const key = p.toUpperCase()
          const t = tickers?.[key]
          const sym = label(p)
          const price = t?.price ?? 0
          const change = Number.parseFloat(t?.change ?? '0')
          const isSel = p === selected
          const up = change >= 0
          return (
            <button
              key={p}
              type="button"
              onClick={() => onSelect(p)}
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
                  <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    SPOT • BINANCE
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`mono ${flashMap[p] || ''}`} style={{ fontWeight: 700 }}>
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

