import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { recentTrades as seedTrades } from '../data/mockData.js'

function sideBadge(side) {
  const isLong = side === 'LONG'
  return isLong
    ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20'
    : 'bg-red-500/15 text-red-200 border border-red-500/20'
}

function genTrade() {
  const users = ['0x7f3a...', '0x2b8c...', '0x9d1f...', '0x4e7a...', '0x1c3b...', '0x8f2d...', '0x3a9e...', '0x6b4c...']
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'DOGE/USDT']
  const side = Math.random() > 0.5 ? 'LONG' : 'SHORT'
  const pnl = (Math.random() > 0.55 ? 1 : -1) * (20 + Math.random() * 980)
  const price = pairs[0].startsWith('BTC') ? 67842 : 3524
  return {
    user: users[Math.floor(Math.random() * users.length)],
    pair: pairs[Math.floor(Math.random() * pairs.length)],
    side,
    size: (Math.random() * 8 + 0.12).toFixed(3),
    price: (price + (Math.random() - 0.5) * 420).toFixed(0),
    pnl: `${pnl >= 0 ? '+' : '-'}$${Math.abs(pnl).toFixed(2)}`,
    time: 'now',
  }
}

export default function TradesTable() {
  const [rows, setRows] = useState(() => seedTrades.map((t) => ({ ...t, _id: `${t.user}-${t.time}-${Math.random()}` })))

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) => [{ ...genTrade(), _id: `${Date.now()}-${Math.random()}` }, ...prev].slice(0, 8))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const cols = useMemo(() => ['User', 'Pair', 'Side', 'Size', 'Price', 'PNL', 'Time'], [])

  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center justify-between pb-3">
        <div className="text-sm font-semibold text-text-primary">Recent Trades</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Live feed</div>
      </div>

      <div className="grid grid-cols-7 gap-2 border-b border-white/10 pb-2 text-[11px] uppercase tracking-[0.22em] text-text-muted">
        {cols.map((c, idx) => (
          <div key={c} className={idx >= 3 ? 'text-right' : ''}>
            {c}
          </div>
        ))}
      </div>

      <div className="mt-2 space-y-1">
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-7 gap-2 rounded-2xl border border-transparent bg-white/0 px-2 py-2 text-xs tabular-nums hover:border-glass hover:bg-white/5"
            >
              <div className="text-text-secondary">{r.user}</div>
              <div className="text-text-primary">{r.pair}</div>
              <div>
                <span className={['inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold', sideBadge(r.side)].join(' ')}>
                  {r.side}
                </span>
              </div>
              <div className="text-right text-text-secondary">{r.size}</div>
              <div className="text-right text-text-secondary">{r.price}</div>
              <div className={['text-right font-semibold', r.pnl.startsWith('+') ? 'text-emerald-300' : 'text-red-300'].join(' ')}>
                {r.pnl}
              </div>
              <div className="text-right text-text-muted">{r.time}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

