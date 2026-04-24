import { useEffect, useMemo, useRef, useState } from 'react'

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
    const v = 100 - 100 / (1 + rs)
    out.push(v)
  }
  while (out.length < closes.length) out.unshift(out[0] ?? 50)
  return out
}

function fmt(n) {
  const d = n >= 1000 ? 2 : 4
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

function genCandle(prevClose, volBase = 1000) {
  const drift = (Math.random() - 0.5) * 0.006
  const o = prevClose
  const c = prevClose * (1 + drift)
  const hi = Math.max(o, c) * (1 + Math.random() * 0.0022)
  const lo = Math.min(o, c) * (1 - Math.random() * 0.0022)
  const v = volBase * (0.35 + Math.random() * 1.1)
  return { o, h: hi, l: lo, c, v }
}

export default function CandlestickChart({ pair = 'BTC/USD', basePrice = 67842 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const [candles, setCandles] = useState([])

  const volBase = useMemo(() => (pair.includes('BTC') ? 2600 : pair.includes('ETH') ? 1600 : 900), [pair])

  useEffect(() => {
    const arr = []
    let p = basePrice
    for (let i = 0; i < 80; i += 1) {
      const c = genCandle(p, volBase)
      arr.push(c)
      p = c.c
    }
    setCandles(arr)
  }, [basePrice, volBase])

  useEffect(() => {
    const id = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1]
        const c = genCandle(last?.c ?? basePrice, volBase)
        const next = [...prev.slice(-79), c]
        return next
      })
    }, 1500)
    return () => clearInterval(id)
  }, [basePrice, volBase])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const pad = { l: 64, r: 68, t: 16, b: 14 }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // layout
      const rsiH = Math.floor(h * 0.15)
      const volH = Math.floor(h * 0.25)
      const chartTop = pad.t
      const chartBottom = h - pad.b - rsiH - volH - 12
      const chartH = chartBottom - chartTop
      const volTop = chartBottom + 10
      const volBottom = volTop + volH - 10
      const rsiTop = volBottom + 10
      const rsiBottom = h - pad.b

      // background glow
      const g = ctx.createRadialGradient(w * 0.5, h * 0.18, 0, w * 0.5, h * 0.18, Math.max(w, h) * 0.85)
      g.addColorStop(0, 'rgba(0,212,255,0.10)')
      g.addColorStop(0.35, 'rgba(139,92,246,0.06)')
      g.addColorStop(1, 'rgba(1,4,9,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      if (candles.length < 10) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const closes = candles.map((c) => c.c)
      const ema9 = ema(closes, 9)
      const ema21 = ema(closes, 21)
      const rsi14 = rsi(closes, 14)

      const minP = Math.min(...candles.map((c) => c.l))
      const maxP = Math.max(...candles.map((c) => c.h))
      const rng = Math.max(1e-9, maxP - minP)
      const yMin = minP - rng * 0.08
      const yMax = maxP + rng * 0.08

      const x0 = pad.l
      const x1 = w - pad.r
      const usableW = x1 - x0
      const n = candles.length
      const step = usableW / n
      const candleW = clamp(step * 0.62, 6, 10)

      const yOf = (p) => chartTop + ((yMax - p) / (yMax - yMin)) * chartH

      // grid + y labels
      ctx.strokeStyle = 'rgba(0,212,255,0.08)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 6])
      const ticks = 6
      for (let i = 0; i <= ticks; i += 1) {
        const y = chartTop + (chartH * i) / ticks
        ctx.beginPath()
        ctx.moveTo(x0, y)
        ctx.lineTo(x1, y)
        ctx.stroke()

        const price = yMax - ((y - chartTop) / chartH) * (yMax - yMin)
        ctx.setLineDash([])
        ctx.fillStyle = 'rgba(74,122,155,0.95)'
        ctx.font = "600 11px 'JetBrains Mono'"
        ctx.fillText(fmt(price), x1 + 10, y + 4)
        ctx.setLineDash([3, 6])
      }
      ctx.setLineDash([])

      // candles
      const maxVol = Math.max(...candles.map((c) => c.v))
      for (let i = 0; i < n; i += 1) {
        const c = candles[i]
        const x = x0 + i * step + (step - candleW) / 2
        const up = c.c >= c.o
        const bodyCol = up ? 'rgba(0,230,118,0.92)' : 'rgba(255,61,113,0.92)'
        const wickCol = up ? 'rgba(0,230,118,0.75)' : 'rgba(255,61,113,0.75)'

        const yO = yOf(c.o)
        const yC = yOf(c.c)
        const yH = yOf(c.h)
        const yL = yOf(c.l)

        ctx.strokeStyle = wickCol
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(x + candleW / 2, yH)
        ctx.lineTo(x + candleW / 2, yL)
        ctx.stroke()

        const by = Math.min(yO, yC)
        const bh = Math.max(2, Math.abs(yC - yO))
        ctx.fillStyle = bodyCol
        ctx.fillRect(x, by, candleW, bh)

        // volume
        const vh = (c.v / maxVol) * (volBottom - volTop)
        ctx.fillStyle = up ? 'rgba(0,212,255,0.18)' : 'rgba(139,92,246,0.14)'
        ctx.fillRect(x, volBottom - vh, candleW, vh)
      }

      // EMA lines
      const drawLine = (vals, color) => {
        ctx.beginPath()
        for (let i = 0; i < n; i += 1) {
          const x = x0 + i * step + step / 2
          const y = yOf(vals[i])
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = color
        ctx.lineWidth = 1.6
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      drawLine(ema9, 'rgba(139,92,246,0.95)')
      drawLine(ema21, 'rgba(0,212,255,0.95)')

      // RSI panel
      ctx.strokeStyle = 'rgba(0,212,255,0.10)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x0, rsiTop)
      ctx.lineTo(x1, rsiTop)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x0, rsiBottom)
      ctx.lineTo(x1, rsiBottom)
      ctx.stroke()

      const rsiY = (v) => rsiTop + ((100 - v) / 100) * (rsiBottom - rsiTop)

      // 30/70 lines
      ctx.setLineDash([4, 6])
      ctx.strokeStyle = 'rgba(240,180,41,0.16)'
      for (const lvl of [30, 70]) {
        const y = rsiY(lvl)
        ctx.beginPath()
        ctx.moveTo(x0, y)
        ctx.lineTo(x1, y)
        ctx.stroke()
      }
      ctx.setLineDash([])

      ctx.beginPath()
      for (let i = 0; i < n; i += 1) {
        const x = x0 + i * step + step / 2
        const y = rsiY(rsi14[i])
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(240,180,41,0.85)'
      ctx.lineWidth = 1.4
      ctx.stroke()

      // labels
      ctx.fillStyle = 'rgba(74,122,155,0.9)'
      ctx.font = "700 11px 'JetBrains Mono'"
      ctx.fillText('VOL', x0, volTop - 2)
      ctx.fillText('RSI(14)', x0, rsiTop - 2)

      // current price tag
      const last = candles[n - 1]
      const yP = yOf(last.c)
      ctx.setLineDash([6, 6])
      ctx.strokeStyle = 'rgba(223,240,255,0.18)'
      ctx.beginPath()
      ctx.moveTo(x0, yP)
      ctx.lineTo(x1, yP)
      ctx.stroke()
      ctx.setLineDash([])
      const tagW = 74
      const tagH = 22
      const tx = x1 + 10
      const ty = clamp(yP - tagH / 2, chartTop, chartBottom - tagH)
      ctx.fillStyle = 'rgba(0,212,255,0.10)'
      ctx.strokeStyle = 'rgba(0,212,255,0.22)'
      ctx.beginPath()
      ctx.roundRect(tx, ty, tagW, tagH, 10)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = 'rgba(223,240,255,0.92)'
      ctx.font = "700 11px 'JetBrains Mono'"
      ctx.fillText(fmt(last.c), tx + 10, ty + 15)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [candles, pair, basePrice])

  return (
    <div className="glass" style={{ borderRadius: 18, padding: 12, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{pair}</div>
        <div className="pill mono" style={{ color: 'var(--gold)' }}>
          LIVE SIM
        </div>
      </div>
      <div style={{ position: 'relative', height: 'calc(100% - 34px)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.12)' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </div>
  )
}

