import { useEffect, useRef, useState } from 'react'

const PAIRS = [
  'btcusdt',
  'ethusdt',
  'solusdt',
  'bnbusdt',
  'xrpusdt',
  'dogeusdt',
  'adausdt',
  'avaxusdt',
  'dotusdt',
  'maticusdt',
]

function safeJsonParse(s) {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}

/**
 * Binance multi-stream miniTicker.
 * Returns { tickers, status } where tickers keyed by d.s (e.g. BTCUSDT).
 */
export function useMultiTicker() {
  const [tickers, setTickers] = useState({})
  const [status, setStatus] = useState('connecting')

  const wsRef = useRef(null)
  const retryRef = useRef({ attempt: 0, timer: 0 })
  const aliveRef = useRef(true)
  const lastUpdateRef = useRef(0)

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

      const streams = PAIRS.map((p) => `${p}@miniTicker`).join('/')
      const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)
      wsRef.current = ws

      ws.onopen = () => {
        if (!aliveRef.current) return
        retryRef.current.attempt = 0
        setStatus('connected')
      }

      ws.onmessage = (e) => {
        const msg = safeJsonParse(e.data)
        const d = msg?.data
        if (!d || !aliveRef.current) return

        const c = Number.parseFloat(d.c)
        const o = Number.parseFloat(d.o)
        const change = o ? ((c - o) / o) * 100 : 0

        const now = Date.now();
        if (now - lastUpdateRef.current < 100) return;
        lastUpdateRef.current = now;

        setTickers((prev) => ({
          ...prev,
          [d.s]: {
            symbol: d.s,
            price: c,
            change: Number.isFinite(change) ? change.toFixed(2) : '0.00',
          },
        }))
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
  }, [])

  return { tickers, status }
}

