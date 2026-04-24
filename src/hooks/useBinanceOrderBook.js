import { useEffect, useRef, useState } from 'react'

function safeJsonParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

function mapSide(levels, limit) {
  if (!Array.isArray(levels)) return []
  return levels.slice(0, limit).map((lvl) => ({
    price: Number.parseFloat(lvl[0]),
    size: Number.parseFloat(lvl[1]),
  }))
}

/**
 * Binance partial depth stream (top 10 levels, 1s updates).
 * Returns { book, status } where book = { bids, asks }.
 */
export function useBinanceOrderBook(symbol = 'btcusdt', { limit = 8 } = {}) {
  const [book, setBook] = useState({ bids: [], asks: [] })
  const [status, setStatus] = useState('connecting')

  const wsRef = useRef(null)
  const retryRef = useRef({ attempt: 0, timer: 0 })
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = true

    const cleanup = () => {
      if (retryRef.current.timer) window.clearTimeout(retryRef.current.timer)
      retryRef.current.timer = 0
      retryRef.current.attempt = 0

      const ws = wsRef.current
      wsRef.current = null
      if (ws) {
        ws.onopen = null
        ws.onclose = null
        ws.onerror = null
        ws.onmessage = null
        try {
          ws.close()
        } catch {
          // ignore
        }
      }
    }

    const connect = () => {
      cleanup()
      setStatus('connecting')
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth10@1000ms`)
      wsRef.current = ws

      ws.onopen = () => {
        if (!aliveRef.current) return
        retryRef.current.attempt = 0
        setStatus('connected')
      }

      ws.onmessage = (e) => {
        const d = safeJsonParse(e.data)
        if (!d || !aliveRef.current) return
        setBook({
          bids: mapSide(d.bids, limit),
          asks: mapSide(d.asks, limit),
        })
      }

      const scheduleReconnect = () => {
        if (!aliveRef.current) return
        setStatus('disconnected')
        const attempt = Math.min(8, (retryRef.current.attempt || 0) + 1)
        retryRef.current.attempt = attempt
        const delay = Math.min(12_000, 400 * 2 ** attempt)
        retryRef.current.timer = window.setTimeout(connect, delay)
      }

      ws.onerror = scheduleReconnect
      ws.onclose = scheduleReconnect
    }

    connect()

    return () => {
      aliveRef.current = false
      cleanup()
    }
  }, [symbol, limit])

  return { book, status }
}

