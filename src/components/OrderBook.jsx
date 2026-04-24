import { useMemo } from 'react'
import { useOrderBook } from '../hooks/useOrderBook.js'

function fmtSpread(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function OrderBook({ mid = 67842.3 }) {
  const { asks, bids, spread, changed, flashKey } = useOrderBook({
    mid,
    step: mid > 1000 ? 2.5 : 0.01,
    rows: 6,
    intervalMs: 1500,
  })

  const cols = useMemo(
    () => [
      { k: 'priceText', label: 'Price' },
      { k: 'sizeText', label: 'Size' },
      { k: 'totalText', label: 'Total' },
    ],
    [],
  )

  return (
    <div className="glass rounded-3xl p-4 tilt-glare">
      <div className="flex items-center justify-between pb-3">
        <div className="text-sm font-semibold text-text-primary">Order Book</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted tabular-nums">
          Spread {fmtSpread(spread)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-b border-white/10 pb-2 text-[11px] uppercase tracking-[0.22em] text-text-muted">
        {cols.map((c) => (
          <div key={c.k} className={c.k === 'priceText' ? '' : 'text-right'}>
            {c.label}
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div className="space-y-1">
          {asks
            .slice()
            .reverse()
            .map((r, idx) => {
              const key = `a-${asks.length - 1 - idx}`
              const flash = changed.has(key)
              return (
                <div
                  key={`${flashKey}-${key}`}
                  className={[
                    'relative grid grid-cols-3 gap-2 rounded-xl px-2 py-1 text-xs tabular-nums overflow-hidden',
                    flash ? 'animate-[flash_600ms_ease]' : '',
                  ].join(' ')}
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-red-500/10"
                    style={{ width: `${Math.round(r.depthPct * 100)}%` }}
                  />
                  <div className="relative text-red-300">{r.priceText}</div>
                  <div className="relative text-right text-text-secondary">{r.sizeText}</div>
                  <div className="relative text-right text-text-secondary">{r.totalText}</div>
                </div>
              )
            })}
        </div>

        <div className="my-2 flex items-center justify-center">
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        <div className="space-y-1">
          {bids.map((r, idx) => {
            const key = `b-${idx}`
            const flash = changed.has(key)
            return (
              <div
                key={`${flashKey}-${key}`}
                className={[
                  'relative grid grid-cols-3 gap-2 rounded-xl px-2 py-1 text-xs tabular-nums overflow-hidden',
                  flash ? 'animate-[flash_600ms_ease]' : '',
                ].join(' ')}
              >
                <div
                  className="absolute inset-y-0 right-0 bg-emerald-500/10"
                  style={{ width: `${Math.round(r.depthPct * 100)}%` }}
                />
                <div className="relative text-emerald-300">{r.priceText}</div>
                <div className="relative text-right text-text-secondary">{r.sizeText}</div>
                <div className="relative text-right text-text-secondary">{r.totalText}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

