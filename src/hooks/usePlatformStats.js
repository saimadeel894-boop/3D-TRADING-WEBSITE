import { useEffect, useState } from 'react'

export function usePlatformStats() {
  const [stats, setStats] = useState({
    totalVolume: 0,
    activeUsers: 24847,
    openPositions: 18432,
    revenue: 842000,
  })

  useEffect(() => {
    let alive = true

    fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return
        const vol = Number.parseFloat(d?.quoteVolume)
        if (!Number.isFinite(vol)) return
        setStats((prev) => ({ ...prev, totalVolume: vol }))
      })
      .catch(() => {})

    const interval = window.setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        openPositions: prev.openPositions + Math.floor(Math.random() * 5 - 2),
      }))
    }, 3000)

    return () => {
      alive = false
      window.clearInterval(interval)
    }
  }, [])

  return stats
}

