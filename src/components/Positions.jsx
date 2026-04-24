import { useEffect, useMemo, useState } from 'react'

function fmt(n) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function pnlColor(n) {
  return n >= 0 ? 'text-emerald-300' : 'text-red-300'
}

export default function Positions({ marks }) {
  const [t, setT] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const positions = useMemo(() => {
    const btc = marks?.BTC ?? 67842.3
    const eth = marks?.ETH ?? 3524.8
    const p1Entry = 66420
    const p2Entry = 3610
    const btcPnl = (btc - p1Entry) * 0.12 * 10
    const ethPnl = (p2Entry - eth) * 1.2 * 5

    return [
      {
        pair: 'BTC/USDT',
        dir: 'LONG',
        lev: 10,
        entry: p1Entry,
        mark: btc,
        pnl: btcPnl + Math.sin(t / 4) * 12,
      },
      {
        pair: 'ETH/USDT',
        dir: 'SHORT',
        lev: 5,
        entry: p2Entry,
        mark: eth,
        pnl: ethPnl + Math.cos(t / 4) * 8,
      },
    ]
  }, [marks?.BTC, marks?.ETH, t])

  return (
    <div className="glass rounded-3xl p-4 tilt-glare">
      <div className="flex items-center justify-between pb-3">
        <div className="text-sm font-semibold text-text-primary">Positions</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted tabular-nums">
          Open 2
        </div>
      </div>

      <div className="space-y-2">
        {positions.map((p) => (
          <div
            key={p.pair}
            className="rounded-2xl border border-glass bg-white/5 px-3 py-3 glass-hover"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-text-primary">{p.pair}</div>
                <span
                  className={[
                    'rounded-full px-2 py-1 text-[11px] font-semibold',
                    p.dir === 'LONG'
                      ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
                      : 'bg-red-500/15 text-red-200 border border-red-500/20',
                  ].join(' ')}
                >
                  {p.dir} {p.lev}x
                </span>
              </div>
              <div className={['tabular-nums text-sm font-semibold', pnlColor(p.pnl)].join(' ')}>
                {p.pnl >= 0 ? '+' : '-'}${fmt(Math.abs(p.pnl))}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Entry</div>
                <div className="tabular-nums font-semibold text-text-primary">${fmt(p.entry)}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Mark</div>
                <div className="tabular-nums font-semibold text-text-primary">${fmt(p.mark)}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">PNL</div>
                <div className={['tabular-nums font-semibold', pnlColor(p.pnl)].join(' ')}>
                  {p.pnl >= 0 ? '+' : '-'}${fmt(Math.abs(p.pnl))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

