import { useEffect, useRef, useState } from 'react'

function safeJsonParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

/**
 * Binance single-symbol 24hr ticker stream.
 * - Cleans up WS on unmount / symbol change
 * - Auto-reconnects with backoff if connection drops
 */
export function useBinancePrice(symbol = 'btcusdt') {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('connecting') // connecting | connected | disconnected

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

      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`)
      wsRef.current = ws

      ws.onopen = () => {
        if (!aliveRef.current) return
        retryRef.current.attempt = 0
        setStatus('connected')
      }

      ws.onmessage = (e) => {
        const d = safeJsonParse(e.data)
        if (!d || !aliveRef.current) return
        setData({
          price: Number.parseFloat(d.c),
          change: Number.parseFloat(d.P),
          high: Number.parseFloat(d.h),
          low: Number.parseFloat(d.l),
          volume: Number.parseFloat(d.v),
        })
      }

      const scheduleReconnect = () => {
        if (!aliveRef.current) return
        setStatus('disconnected')
        const attempt = Math.min(8, (retryRef.current.attempt || 0) + 1)
        retryRef.current.attempt = attempt
        const delay = Math.min(12_000, 400 * 2 ** attempt) // 800ms..12s
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
  }, [symbol])

  return { data, status }
}

