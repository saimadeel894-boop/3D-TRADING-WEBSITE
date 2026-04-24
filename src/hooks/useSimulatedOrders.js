import { useMemo, useState } from 'react'

export function useSimulatedOrders(currentPrice, { initialBalance = 25000, pairLabel = 'BTC/USDT' } = {}) {
  const [balance, setBalance] = useState(initialBalance)
  const [positions, setPositions] = useState([])
  const [orders] = useState([])
  const [tradeHistory, setTradeHistory] = useState([])

  function placeOrder({ side, type, price, amount, leverage, pair }) {
    const usedPrice = Number(price ?? currentPrice)
    const usedAmount = Number(amount)
    const usedLev = Math.max(1, Number(leverage) || 1)

    if (!Number.isFinite(usedPrice) || usedPrice <= 0) return { error: 'Invalid price' }
    if (!Number.isFinite(usedAmount) || usedAmount <= 0) return { error: 'Invalid amount' }

    const cost = (usedPrice * usedAmount) / usedLev
    if (cost > balance) return { error: 'Insufficient balance' }

    const position = {
      id: Date.now(),
      pair: pair || pairLabel,
      side,
      type: type || 'market',
      size: usedAmount,
      entry: usedPrice,
      leverage: usedLev,
      liqPrice:
        side === 'buy'
          ? usedPrice * (1 - (1 / usedLev) * 0.9)
          : usedPrice * (1 + (1 / usedLev) * 0.9),
      margin: cost,
      openedAt: new Date().toISOString(),
    }

    setBalance((prev) => prev - cost)
    setPositions((prev) => [...prev, position])
    setTradeHistory((prev) => [{ ...position, status: 'OPEN', time: 'just now' }, ...prev.slice(0, 19)])

    return { success: true, position }
  }

  function closePosition(id) {
    setPositions((prev) => {
      const pos = prev.find((p) => p.id === id)
      if (!pos) return prev

      const mark = Number(currentPrice)
      const pnl =
        pos.side === 'buy' ? (mark - pos.entry) * pos.size : (pos.entry - mark) * pos.size

      setBalance((b) => b + pos.margin + pnl)
      setTradeHistory((hist) => [{ ...pos, pnl, status: 'CLOSED', time: 'just now' }, ...hist.slice(0, 19)])
      return prev.filter((p) => p.id !== id)
    })
  }

  const positionsWithPnl = useMemo(() => {
    const mark = Number(currentPrice)
    return positions.map((pos) => {
      const pnl =
        pos.side === 'buy' ? (mark - pos.entry) * pos.size : (pos.entry - mark) * pos.size
      const pnlPct =
        pos.side === 'buy'
          ? ((mark - pos.entry) / pos.entry) * pos.leverage * 100
          : ((pos.entry - mark) / pos.entry) * pos.leverage * 100
      return { ...pos, pnl, pnlPct }
    })
  }, [positions, currentPrice])

  return { balance, positions: positionsWithPnl, orders, tradeHistory, placeOrder, closePosition, setBalance }
}

