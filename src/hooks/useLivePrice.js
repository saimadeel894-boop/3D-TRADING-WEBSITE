import { useEffect, useMemo, useRef, useState } from 'react'
import { pairs as basePairs } from '../data/mockData.js'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function jitterPct(symbol) {
  if (symbol.startsWith('BTC')) return 0.0022
  if (symbol.startsWith('ETH')) return 0.003
  if (symbol.startsWith('SOL')) return 0.006
  return 0.0045
}

export function useLivePrices({ intervalMs = 1000 } = {}) {
  const [pairs, setPairs] = useState(() => basePairs.map((p) => ({ ...p })))
  const tRef = useRef(0)

  const bySymbol = useMemo(() => {
    const m = new Map()
    for (const p of pairs) m.set(p.symbol, p)
    return m
  }, [pairs])

  useEffect(() => {
    const id = setInterval(() => {
      tRef.current += 1
      setPairs((prev) =>
        prev.map((p) => {
          const pct = jitterPct(p.symbol)
          const noise = (Math.random() - 0.5) * 2
          const drift = Math.sin(tRef.current / 12) * 0.25
          const d = (noise + drift) * pct
          const next = p.price * (1 + d)
          const hi = Math.max(p.high, next)
          const lo = Math.min(p.low, next)
          const change = clamp(p.change + d * 100 * 0.2, -9.5, 9.5)
          return { ...p, price: next, high: hi, low: lo, change }
        }),
      )
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return { pairs, bySymbol }
}

export function useLivePrice(symbol, { intervalMs = 1000 } = {}) {
  const { bySymbol } = useLivePrices({ intervalMs })
  return bySymbol.get(symbol) || basePairs[0]
}

