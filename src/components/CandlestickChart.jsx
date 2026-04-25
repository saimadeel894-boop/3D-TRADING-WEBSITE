import { useEffect, useMemo, useRef } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function ema(values, period) {
  const k = 2 / (period + 1)
  const out = []
  let prev = values[0] ?? 0
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i]
    prev = i === 0 ? v : v * k + prev * (1 - k)
    out.push(prev)
  }
  return out
}

function rsi(closes, period = 14) {
  if (closes.length < period + 2) return closes.map(() => 50)
  let gains = 0
  let losses = 0
  for (let i = 1; i <= period; i += 1) {
    const d = closes[i] - closes[i - 1]
    if (d >= 0) gains += d
    else losses -= d
  }
  let avgG = gains / period
  let avgL = losses / period
  const out = [50]
  for (let i = period + 1; i < closes.length; i += 1) {
    const d = closes[i] - closes[i - 1]
    const g = d > 0 ? d : 0
    const l = d < 0 ? -d : 0
    avgG = (avgG * (period - 1) + g) / period
    avgL = (avgL * (period - 1) + l) / period
    const rs = avgL === 0 ? 999 : avgG / avgL
    out.push(100 - 100 / (1 + rs))
  }
  while (out.length < closes.length) out.unshift(out[0] ?? 50)
  return out
}

function genSeedCandles(count = 80, start = 68000) {
  const arr = []
  let p = start
  const now = Date.now()
  for (let i = 0; i < count; i += 1) {
    const o = p
    const d = (Math.random() - 0.5) * 0.008
    const c = o * (1 + d)
    const h = Math.max(o, c) * (1 + Math.random() * 0.002)
    const l = Math.min(o, c) * (1 - Math.random() * 0.002)
    const v = 300 + Math.random() * 1800
    arr.push({ o, h, l, c, v, t: now - (count - i) * 60_000 })
    p = c
  }
  return arr
}

function fmt(n, d = 2) {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

export default function CandlestickChart({
  pair = 'BTC/USDT',
  candles = [],
  isLoading = false,
  status = 'connecting',
  interval = '1m',
  intervals = ['1m', '5m', '15m', '1h', '4h', '1d'],
  onInterval,
}) {
  const canvasRef = useRef(null)
  const dataRef = useRef(genSeedCandles(80))

  const mergedCandles = useMemo(() => {
    if (Array.isArray(candles) && candles.length >= 20) return candles.slice(-120)
    return dataRef.current
  }, [candles])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0

    const render = () => {
      const w = canvas.width
      const h = canvas.height
      if (!w || !h) return

      ctx.fillStyle = '#060e1a'
      ctx.fillRect(0, 0, w, h)

      const priceH = Math.floor(h * 0.68)
      const volTop = Math.floor(h * 0.68)
      const volH = Math.floor(h * 0.20)
      const rsiTop = volTop + volH
      const rsiH = Math.floor(h * 0.12)
      const xPad = 56
      const rightPad = 80
      const chartW = w - xPad - rightPad

      const data = mergedCandles
      if (!data.length) return

      const minP = Math.min(...data.map((c) => c.l))
      const maxP = Math.max(...data.map((c) => c.h))
      const pRange = Math.max(1e-9, maxP - minP)
      const yOf = (p) => 18 + ((maxP + pRange * 0.08 - p) / (pRange * 1.16)) * (priceH - 26)

      ctx.strokeStyle = 'rgba(0,180,255,0.06)'
      ctx.lineWidth = 1
      for (let i = 0; i <= 5; i += 1) {
        const y = 18 + ((priceH - 26) * i) / 5
        ctx.beginPath()
        ctx.moveTo(xPad, y)
        ctx.lineTo(w - rightPad, y)
        ctx.stroke()
      }

      const step = chartW / data.length
      const cw = clamp(step * 0.62, 4, 9)
      const maxV = Math.max(...data.map((c) => c.v))

      for (let i = 0; i < data.length; i += 1) {
        const c = data[i]
        const x = xPad + i * step + (step - cw) / 2
        const up = c.c >= c.o
        const col = up ? '#00e676' : '#ff3d71'
        const yO = yOf(c.o)
        const yC = yOf(c.c)
        const yH = yOf(c.h)
        const yL = yOf(c.l)

        ctx.strokeStyle = col
        ctx.beginPath()
        ctx.moveTo(x + cw / 2, yH)
        ctx.lineTo(x + cw / 2, yL)
        ctx.stroke()
        ctx.fillStyle = col
        ctx.fillRect(x, Math.min(yO, yC), cw, Math.max(2, Math.abs(yC - yO)))

        const vh = (c.v / maxV) * (volH - 8)
        ctx.fillStyle = up ? 'rgba(0,230,118,0.22)' : 'rgba(255,61,113,0.2)'
        ctx.fillRect(x, volTop + volH - vh, cw, vh)
      }

      // ── Current Price Tracker Line ──
      const currentCandle = data[data.length - 1]
      if (currentCandle) {
        const lastY = yOf(currentCandle.c)
        const lastX = xPad + (data.length - 1) * step + step / 2
        const isUp = currentCandle.c >= currentCandle.o
        const trackerCol = isUp ? 'rgba(0,230,118,0.8)' : 'rgba(255,61,113,0.8)'
        const glowCol = isUp ? '0,230,118' : '255,61,113'

        // Horizontal dashed line
        ctx.beginPath()
        ctx.setLineDash([4, 4])
        ctx.moveTo(xPad, lastY)
        ctx.lineTo(w, lastY)
        ctx.strokeStyle = trackerCol
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])

        // Glowing Dot
        const t = Date.now() / 1000
        const pulse = (t % 1.5) / 1.5 // 0 to 1
        
        ctx.beginPath()
        ctx.arc(lastX, lastY, 4 + pulse * 12, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${glowCol}, ${0.5 * (1 - pulse)})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
        ctx.fillStyle = isUp ? '#00e676' : '#ff3d71'
        ctx.fill()
      }

      const closes = data.map((c) => c.c)
      const e9 = ema(closes, 9)
      const e21 = ema(closes, 21)
      const r = rsi(closes, 14)

      const drawLine = (vals, col) => {
        ctx.beginPath()
        for (let i = 0; i < vals.length; i += 1) {
          const x = xPad + i * step + step / 2
          const y = yOf(vals[i])
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = col
        ctx.lineWidth = 1.6
        ctx.stroke()
      }
      drawLine(e9, 'rgba(139,92,246,0.8)')
      drawLine(e21, 'rgba(0,212,255,0.6)')

      ctx.strokeStyle = 'rgba(0,180,255,0.06)'
      ctx.beginPath()
      ctx.moveTo(xPad, rsiTop)
      ctx.lineTo(w - rightPad, rsiTop)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(xPad, rsiTop + rsiH)
      ctx.lineTo(w - rightPad, rsiTop + rsiH)
      ctx.stroke()

      const rY = (v) => rsiTop + ((100 - v) / 100) * rsiH
      ctx.beginPath()
      for (let i = 0; i < r.length; i += 1) {
        const x = xPad + i * step + step / 2
        const y = rY(r[i])
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(240,180,41,0.78)'
      ctx.lineWidth = 1.3
      ctx.stroke()
    }

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.offsetWidth))
      canvas.height = Math.max(1, Math.floor(canvas.offsetHeight))
      render()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    frame = requestAnimationFrame(render)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [mergedCandles])

  const last = mergedCandles[mergedCandles.length - 1]

  return (
    <div className="glass" style={{ borderRadius: 18, padding: 0, height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          background: 'rgba(6,14,26,0.9)',
          borderBottom: '1px solid rgba(0,180,255,0.1)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{pair}</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
            O: {last ? fmt(last.o) : '—'} H: {last ? fmt(last.h) : '—'} L: {last ? fmt(last.l) : '—'} C: {last ? fmt(last.c) : '—'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="pill mono" style={{ color: status === 'connected' ? 'var(--green)' : status === 'disconnected' ? 'var(--red)' : 'var(--gold)' }}>
            {isLoading ? 'LOADING' : status.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {intervals.map((it) => {
              const active = it.toLowerCase() === interval.toLowerCase()
              return (
                <button
                  key={it}
                  type="button"
                  onClick={() => onInterval?.(it)}
                  className="mono"
                  style={{
                    borderRadius: 999,
                    padding: '6px 10px',
                    border: '1px solid var(--border)',
                    background: active ? 'rgba(0,212,255,0.10)' : 'rgba(255,255,255,0.02)',
                    color: active ? 'var(--text)' : 'var(--muted)',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: 'none',
                  }}
                >
                  {it}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', height: 'calc(100% - 66px)', minHeight: 360, overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', right: 12, top: 10, display: 'flex', gap: 8 }}>
          <span className="pill mono" style={{ color: 'rgba(139,92,246,0.9)', background: 'rgba(139,92,246,0.12)' }}>EMA 9/21</span>
          <span className="pill mono" style={{ color: 'rgba(240,180,41,0.92)', background: 'rgba(240,180,41,0.14)' }}>RSI</span>
          <span className="pill mono" style={{ color: 'rgba(0,212,255,0.92)', background: 'rgba(0,212,255,0.12)' }}>VOL MA</span>
        </div>
      </div>
    </div>
  )
}

