import { useEffect, useRef, useState } from 'react'

function safeJsonParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

function klineToCandle(k) {
  return {
    o: Number.parseFloat(k.o),
    h: Number.parseFloat(k.h),
    l: Number.parseFloat(k.l),
    c: Number.parseFloat(k.c),
    v: Number.parseFloat(k.v),
    t: k.t,
  }
}

/**
 * Binance candles:
 * - Fetches last `limit` historical klines, then streams live kline updates.
 * Returns { candles, status, isLoading }.
 */
export function useBinanceCandles(symbol = 'btcusdt', interval = '1m', { limit = 100 } = {}) {
  const [candles, setCandles] = useState([])
  const [status, setStatus] = useState('connecting')
  const [isLoading, setIsLoading] = useState(true)

  const wsRef = useRef(null)
  const retryRef = useRef({ attempt: 0, timer: 0 })
  const abortRef = useRef(null)
  const aliveRef = useRef(true)

  useEffect(() => {
    aliveRef.current = true

    const cleanup = () => {
      if (retryRef.current.timer) window.clearTimeout(retryRef.current.timer)
      retryRef.current.timer = 0
      retryRef.current.attempt = 0

      if (abortRef.current) abortRef.current.abort()
      abortRef.current = null

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
      // keep existing candles; just reconnect stream
      if (retryRef.current.timer) window.clearTimeout(retryRef.current.timer)
      retryRef.current.timer = 0
      setStatus('connecting')

      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`)
      wsRef.current = ws

      ws.onopen = () => {
        if (!aliveRef.current) return
        retryRef.current.attempt = 0
        setStatus('connected')
      }

      ws.onmessage = (e) => {
        const msg = safeJsonParse(e.data)
        const k = msg?.k
        if (!k || !aliveRef.current) return

        setCandles((prev) => {
          const updated = prev.length ? [...prev] : []
          const next = klineToCandle(k)
          const last = updated[updated.length - 1]
          if (last && last.t === next.t) {
            updated[updated.length - 1] = next
          } else {
            updated.push(next)
            if (updated.length > limit) updated.shift()
          }
          return updated
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

    const load = async () => {
      cleanup()
      setIsLoading(true)
      setCandles([])
      setStatus('connecting')

      const ac = new AbortController()
      abortRef.current = ac

      try {
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
        const res = await fetch(url, { signal: ac.signal })
        const data = await res.json()
        if (!aliveRef.current) return
        if (!Array.isArray(data)) throw new Error('Unexpected Binance response')

        setCandles(
          data.map((c) => ({
            o: Number.parseFloat(c[1]),
            h: Number.parseFloat(c[2]),
            l: Number.parseFloat(c[3]),
            c: Number.parseFloat(c[4]),
            v: Number.parseFloat(c[5]),
            t: c[0],
          })),
        )
      } catch (e) {
        if (!aliveRef.current) return
        // keep empty; status will show disconnected once stream fails
      } finally {
        if (!aliveRef.current) return
        setIsLoading(false)
        connect()
      }
    }

    load()

    return () => {
      aliveRef.current = false
      cleanup()
    }
  }, [symbol, interval, limit])

  return { candles, status, isLoading }
}

