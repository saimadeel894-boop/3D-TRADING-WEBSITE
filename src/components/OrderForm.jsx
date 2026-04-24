import { useMemo, useState } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function fmt(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function OrderForm({ markPrice = 67842.3 }) {
  const [side, setSide] = useState('LONG')
  const [type, setType] = useState('Limit')
  const [price, setPrice] = useState(markPrice)
  const [amount, setAmount] = useState(0.12)
  const [lev, setLev] = useState(12)
  const balance = 12500

  const total = useMemo(() => price * amount, [amount, price])
  const cost = useMemo(() => total / lev, [lev, total])
  const maxPos = useMemo(() => balance * lev, [balance, lev])
  const liq = useMemo(() => {
    const dir = side === 'LONG' ? -1 : 1
    return price * (1 + dir * (1 / Math.max(2, lev)) * 0.82)
  }, [lev, price, side])
  const marginRatio = useMemo(() => clamp((cost / balance) * 100, 0, 100), [balance, cost])

  const setPct = (pct) => {
    const usd = balance * pct
    const nextAmt = usd / Math.max(1, price)
    setAmount(nextAmt)
  }

  const sideBtn = (s) =>
    [
      'flex-1 rounded-2xl px-3 py-2 text-xs font-semibold transition-colors',
      side === s
        ? s === 'LONG'
          ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/25'
          : 'bg-red-500/15 text-red-200 border border-red-500/25'
        : 'text-text-secondary hover:text-text-primary',
    ].join(' ')

  const typeBtn = (t) =>
    [
      'rounded-xl px-3 py-1 text-[11px] font-semibold transition-colors',
      type === t ? 'bg-white/10 text-text-primary' : 'text-text-secondary hover:text-text-primary',
    ].join(' ')

  return (
    <div className="glass rounded-3xl p-4 tilt-glare">
      <div className="flex items-center justify-between pb-3">
        <div className="text-sm font-semibold text-text-primary">Order</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted tabular-nums">
          Balance ${fmt(balance)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pb-3">
        <button type="button" onClick={() => setSide('LONG')} className={sideBtn('LONG')}>
          Long
        </button>
        <button type="button" onClick={() => setSide('SHORT')} className={sideBtn('SHORT')}>
          Short
        </button>
      </div>

      <div className="inline-flex w-full items-center gap-1 rounded-2xl border border-glass bg-white/5 p-1">
        {['Limit', 'Market', 'Stop-Limit'].map((t) => (
          <button key={t} type="button" onClick={() => setType(t)} className={typeBtn(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        <label className="block">
          <div className="mb-1 text-[11px] uppercase tracking-[0.22em] text-text-muted">Price</div>
          <input
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            type="number"
            step="0.01"
            className="w-full rounded-2xl border border-glass bg-white/5 px-3 py-2 text-sm text-text-primary outline-none focus:border-glass-strong"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-[11px] uppercase tracking-[0.22em] text-text-muted">Amount</div>
          <input
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            type="number"
            step="0.0001"
            className="w-full rounded-2xl border border-glass bg-white/5 px-3 py-2 text-sm text-text-primary outline-none focus:border-glass-strong"
          />
        </label>

        <div className="grid grid-cols-4 gap-2">
          {[0.25, 0.5, 0.75, 1].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPct(p)}
              className="rounded-2xl border border-glass bg-white/5 px-2 py-2 text-[11px] font-semibold text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
            >
              {Math.round(p * 100)}%
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Leverage</div>
            <div className="tabular-nums text-xs font-semibold text-text-primary">{lev}x</div>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={lev}
            onChange={(e) => setLev(Number(e.target.value))}
            className="mt-2 w-full accent-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-500/35 to-emerald-500/10 px-4 py-3 text-sm font-semibold text-text-primary shadow-[0_0_26px_rgba(16,185,129,0.25)] transition-transform duration-200 hover:-translate-y-[1px]"
          >
            <span className="absolute inset-0 opacity-70 shadow-[0_0_40px_rgba(16,185,129,0.25)]" />
            <span className="relative">Buy / Long</span>
          </button>
          <button
            type="button"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-red-500/35 to-red-500/10 px-4 py-3 text-sm font-semibold text-text-primary shadow-[0_0_26px_rgba(239,68,68,0.20)] transition-transform duration-200 hover:-translate-y-[1px]"
          >
            <span className="absolute inset-0 opacity-70 shadow-[0_0_40px_rgba(239,68,68,0.22)]" />
            <span className="relative">Sell / Short</span>
          </button>
        </div>

        <div className="rounded-2xl border border-glass bg-white/5 p-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Total</div>
              <div className="tabular-nums font-semibold text-text-primary">${fmt(total)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Cost</div>
              <div className="tabular-nums font-semibold text-text-primary">${fmt(cost)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Max Position</div>
              <div className="tabular-nums font-semibold text-text-primary">${fmt(maxPos)}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Liquidation</div>
              <div className="tabular-nums font-semibold text-text-primary">${fmt(liq)}</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-text-muted">
              <span>Margin Ratio</span>
              <span className="tabular-nums">{marginRatio.toFixed(1)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500/70 to-purple-500/55"
                style={{ width: `${marginRatio}%` }}
              />
            </div>
          </div>
          <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-text-muted tabular-nums">
            Mark ${fmt(markPrice)}
          </div>
        </div>
      </div>
    </div>
  )
}

