import { useEffect, useMemo, useRef } from 'react'
import { useLivePrices } from '../hooks/useLivePrice.js'

function fmt(n) {
  const d = n >= 1000 ? 2 : n >= 1 ? 4 : 6
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

export default function TickerBar() {
  const { pairs } = useLivePrices({ intervalMs: 1100 })
  const trackRef = useRef(null)
  const rafRef = useRef(0)
  const xRef = useRef(0)

  const items = useMemo(() => [...pairs, ...pairs], [pairs])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const step = () => {
      xRef.current -= 0.55
      const half = el.scrollWidth / 2
      if (-xRef.current >= half) xRef.current = 0
      el.style.transform = `translate3d(${xRef.current}px,0,0)`
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="glass border-t border-glass px-4 py-3 overflow-hidden">
      <div className="relative">
        <div ref={trackRef} className="flex w-max items-center gap-8 will-change-transform">
          {items.map((p, idx) => (
            <div key={`${p.symbol}-${idx}`} className="flex items-center gap-3 text-xs tabular-nums">
              <div className="text-[11px] uppercase tracking-[0.22em] text-text-secondary">
                {p.symbol}
              </div>
              <div className="font-semibold text-text-primary">{fmt(p.price)}</div>
              <div className={p.change >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                {p.change >= 0 ? '+' : ''}
                {p.change.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0a0e1a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0a0e1a] to-transparent" />
      </div>
    </div>
  )
}

