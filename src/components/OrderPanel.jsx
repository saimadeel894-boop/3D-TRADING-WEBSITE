import { useEffect, useMemo, useState } from 'react'

function fmt(n, d = 2) {
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function genBook(mid) {
  const step = mid > 1000 ? 2.5 : 0.0003
  const asks = []
  const bids = []
  let ta = 0
  let tb = 0
  for (let i = 5; i >= 1; i -= 1) {
    const px = mid + step * i
    const size = (0.2 + Math.random() * 1.6) * (6 / i)
    ta += size
    asks.push({ px, size, total: ta })
  }
  for (let i = 1; i <= 5; i += 1) {
    const px = mid - step * i
    const size = (0.2 + Math.random() * 1.6) * (6 / i)
    tb += size
    bids.push({ px, size, total: tb })
  }
  return { asks, bids, step }
}

export default function OrderPanel({ pair, price }) {
  const [tab, setTab] = useState('BUY')
  const [amount, setAmount] = useState(0.42)
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [lev, setLev] = useState(12)
  const balance = 12450

  const [book, setBook] = useState(() => genBook(price))

  useEffect(() => {
    const id = setInterval(() => setBook(genBook(price)), 1200)
    return () => clearInterval(id)
  }, [price])

  const entry = useMemo(() => price, [price])
  const posSize = useMemo(() => amount * entry, [amount, entry])
  const margin = useMemo(() => posSize / lev, [lev, posSize])
  const est = useMemo(() => {
    const move = (Math.random() - 0.5) * 0.012
    const dir = tab === 'SELL' ? -1 : 1
    return posSize * move * dir
  }, [posSize, tab])

  const pctBtn = (p) => (
    <button
      type="button"
      onClick={() => setAmount(((balance * p) / entry) * 0.5)}
      className="mono"
      style={{
        borderRadius: 12,
        padding: '8px 10px',
        border: '1px solid var(--border)',
        background: 'rgba(255,255,255,0.02)',
        color: 'var(--text)',
        fontWeight: 700,
        cursor: 'none',
      }}
    >
      {p === 1 ? 'MAX' : `${Math.round(p * 100)}%`}
    </button>
  )

  const tabBtn = (t) => {
    const active = tab === t
    const col = t === 'BUY' ? 'var(--green)' : t === 'SELL' ? 'var(--red)' : 'var(--gold)'
    return (
      <button
        type="button"
        onClick={() => setTab(t)}
        className="mono"
        style={{
          flex: 1,
          borderRadius: 14,
          padding: '10px 10px',
          border: `1px solid ${active ? col : 'var(--border)'}`,
          background: active ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
          color: active ? 'var(--text)' : 'var(--muted)',
          fontWeight: 800,
          letterSpacing: '0.14em',
          cursor: 'none',
        }}
      >
        {t}
      </button>
    )
  }

  const execCol = tab === 'SELL' ? 'var(--red)' : tab === 'LIMIT' ? 'var(--gold)' : 'var(--green)'

  return (
    <div className="glass" style={{ borderRadius: 18, padding: 12, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Order</div>
        <div className="pill mono" style={{ color: 'var(--cyan)' }}>
          ${fmt(balance, 0)} AVAILABLE
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>{tabBtn('BUY')}{tabBtn('SELL')}{tabBtn('LIMIT')}</div>

      <div style={{ display: 'grid', gap: 10 }}>
        <label>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>
            Amount
          </div>
          <input
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            type="number"
            step="0.01"
            className="mono"
            style={{
              width: '100%',
              borderRadius: 14,
              padding: '10px 12px',
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text)',
              outline: 'none',
              cursor: 'none',
            }}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>
              Stop Loss
            </div>
            <input
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              placeholder="Optional"
              className="mono"
              style={{
                width: '100%',
                borderRadius: 14,
                padding: '10px 12px',
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text)',
                outline: 'none',
                cursor: 'none',
              }}
            />
          </label>
          <label>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>
              Take Profit
            </div>
            <input
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              placeholder="Optional"
              className="mono"
              style={{
                width: '100%',
                borderRadius: 14,
                padding: '10px 12px',
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--text)',
                outline: 'none',
                cursor: 'none',
              }}
            />
          </label>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Leverage
            </div>
            <div className="mono" style={{ fontWeight: 800, color: 'var(--text)' }}>
              {lev}x
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={lev}
            onChange={(e) => setLev(Number(e.target.value))}
            style={{ width: '100%', marginTop: 8, cursor: 'none' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>{pctBtn(0.25)}{pctBtn(0.5)}{pctBtn(0.75)}{pctBtn(1)}</div>
        </div>

        <div className="glass" style={{ borderRadius: 16, padding: 12, background: 'rgba(255,255,255,0.03)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Order Summary
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>Entry</div>
              <div className="mono" style={{ fontWeight: 800 }}>${fmt(entry)}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>Position Size</div>
              <div className="mono" style={{ fontWeight: 800 }}>${fmt(posSize)}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>Margin</div>
              <div className="mono" style={{ fontWeight: 800 }}>${fmt(margin)}</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>Est. PNL</div>
              <div className="mono" style={{ fontWeight: 800, color: est >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {est >= 0 ? '+' : '-'}${fmt(Math.abs(est))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mono"
          style={{
            borderRadius: 16,
            padding: '14px 14px',
            border: `1px solid ${execCol}`,
            background: `linear-gradient(180deg, ${execCol}33, ${execCol}10)`,
            color: 'var(--text)',
            fontWeight: 900,
            letterSpacing: '0.18em',
            cursor: 'none',
            boxShadow: tab === 'SELL' ? '0 0 26px rgba(255,61,113,0.22)' : '0 0 26px rgba(0,230,118,0.18)',
          }}
        >
          EXECUTE {tab === 'LIMIT' ? 'LIMIT' : tab}
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
          Order Book
        </div>

        <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, color: 'var(--muted)', fontSize: 11, marginBottom: 6 }}>
          <div>Price</div>
          <div style={{ textAlign: 'right' }}>Size</div>
          <div style={{ textAlign: 'right' }}>Total</div>
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          {book.asks.map((r, i) => {
            const pct = r.total / book.asks[book.asks.length - 1].total
            return (
              <div key={`a-${i}`} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', padding: '7px 8px', border: '1px solid rgba(255,255,255,0.02)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${Math.round(pct * 100)}%`, background: 'rgba(255,61,113,0.10)', right: 0, marginLeft: 'auto' }} />
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
                  <div style={{ color: 'var(--red)', fontWeight: 700 }}>${fmt(r.px)}</div>
                  <div style={{ textAlign: 'right' }}>{fmt(r.size, 3)}</div>
                  <div style={{ textAlign: 'right' }}>{fmt(r.total, 3)}</div>
                </div>
              </div>
            )
          })}

          <div className="mono" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.14em', padding: '6px 0' }}>
            SPREAD {fmt(book.asks[0].px - book.bids[0].px, 2)}
          </div>

          {book.bids.map((r, i) => {
            const pct = r.total / book.bids[book.bids.length - 1].total
            return (
              <div key={`b-${i}`} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', padding: '7px 8px', border: '1px solid rgba(255,255,255,0.02)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${Math.round(pct * 100)}%`, background: 'rgba(0,230,118,0.10)', right: 0, marginLeft: 'auto' }} />
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
                  <div style={{ color: 'var(--green)', fontWeight: 700 }}>${fmt(r.px)}</div>
                  <div style={{ textAlign: 'right' }}>{fmt(r.size, 3)}</div>
                  <div style={{ textAlign: 'right' }}>{fmt(r.total, 3)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

