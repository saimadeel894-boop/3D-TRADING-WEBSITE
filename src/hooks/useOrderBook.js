import { useEffect, useMemo, useRef, useState } from 'react'

function roundTo(n, step) {
  return Math.round(n / step) * step
}

function fmt(n, decimals = 2) {
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function useOrderBook({ mid = 67842.3, step = 2.5, rows = 6, intervalMs = 1500 }) {
  const [state, setState] = useState(() => ({
    asks: [],
    bids: [],
    spread: 0,
    flashKey: 0,
    changed: new Set(),
  }))

  const prevRef = useRef({ asks: [], bids: [] })

  const decimals = useMemo(() => (step < 1 ? 4 : step < 10 ? 2 : 1), [step])

  useEffect(() => {
    const gen = (midPrice) => {
      const asks = []
      const bids = []

      const base = roundTo(midPrice, step)
      let askTotal = 0
      let bidTotal = 0
      for (let i = 1; i <= rows; i += 1) {
        const pxA = base + step * i
        const pxB = base - step * i
        const sizeA = Math.max(0.01, (Math.random() * 2.4 + 0.08) * (rows / i))
        const sizeB = Math.max(0.01, (Math.random() * 2.4 + 0.08) * (rows / i))
        askTotal += sizeA
        bidTotal += sizeB
        asks.push({ price: pxA, size: sizeA, total: askTotal })
        bids.push({ price: pxB, size: sizeB, total: bidTotal })
      }

      const spread = asks[0].price - bids[0].price
      return { asks, bids, spread }
    }

    const id = setInterval(() => {
      const m = mid * (1 + (Math.random() - 0.5) * 0.0012)
      const next = gen(m)
      const changed = new Set()
      const prev = prevRef.current

      for (let i = 0; i < rows; i += 1) {
        if (!prev.asks[i] || Math.abs(prev.asks[i].price - next.asks[i].price) > 0.00001) changed.add(`a-${i}`)
        if (!prev.bids[i] || Math.abs(prev.bids[i].price - next.bids[i].price) > 0.00001) changed.add(`b-${i}`)
      }

      prevRef.current = { asks: next.asks, bids: next.bids }
      setState({ ...next, flashKey: Date.now(), changed })
    }, intervalMs)

    return () => clearInterval(id)
  }, [intervalMs, mid, rows, step])

  const maxAskTotal = state.asks.length ? state.asks[state.asks.length - 1].total : 1
  const maxBidTotal = state.bids.length ? state.bids[state.bids.length - 1].total : 1

  const asks = state.asks.map((r, idx) => ({
    ...r,
    priceText: fmt(r.price, decimals),
    sizeText: fmt(r.size, 3),
    totalText: fmt(r.total, 3),
    depthPct: r.total / maxAskTotal,
    key: `a-${idx}`,
  }))

  const bids = state.bids.map((r, idx) => ({
    ...r,
    priceText: fmt(r.price, decimals),
    sizeText: fmt(r.size, 3),
    totalText: fmt(r.total, 3),
    depthPct: r.total / maxBidTotal,
    key: `b-${idx}`,
  }))

  return {
    asks,
    bids,
    spread: state.spread,
    changed: state.changed,
    flashKey: state.flashKey,
  }
}

