import { leaderboard as seed } from '../data/mockData.js'

function medal(rank) {
  if (rank === 1) return { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-200', label: 'G' }
  if (rank === 2) return { bg: 'bg-slate-200/10 border-slate-200/20 text-slate-100', label: 'S' }
  if (rank === 3) return { bg: 'bg-orange-500/10 border-orange-500/25 text-orange-200', label: 'B' }
  return null
}

export default function Leaderboard() {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center justify-between pb-3">
        <div className="text-sm font-semibold text-text-primary">Top Users</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Leaderboard</div>
      </div>

      <div className="grid grid-cols-5 gap-2 border-b border-white/10 pb-2 text-[11px] uppercase tracking-[0.22em] text-text-muted">
        <div>Rank</div>
        <div>Username</div>
        <div className="text-right">Volume</div>
        <div className="text-right">PNL</div>
        <div className="text-right">Win</div>
      </div>

      <div className="mt-2 space-y-1">
        {seed.map((u) => {
          const m = medal(u.rank)
          return (
            <div
              key={u.rank}
              className="grid grid-cols-5 gap-2 rounded-2xl border border-transparent bg-white/0 px-2 py-2 text-xs tabular-nums hover:border-glass hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                {m ? (
                  <span className={['grid h-6 w-6 place-items-center rounded-full border text-[11px] font-extrabold', m.bg].join(' ')}>
                    {m.label}
                  </span>
                ) : (
                  <span className="text-text-muted">{u.rank}</span>
                )}
              </div>
              <div className="font-semibold text-text-primary">{u.user}</div>
              <div className="text-right text-text-secondary">{u.volume}</div>
              <div className={['text-right font-semibold', u.pnl.startsWith('+') ? 'text-emerald-300' : 'text-red-300'].join(' ')}>
                {u.pnl}
              </div>
              <div className="text-right text-text-secondary">{u.rate}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

