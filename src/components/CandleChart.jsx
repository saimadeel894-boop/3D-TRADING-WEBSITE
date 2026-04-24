import { useEffect, useMemo, useRef, useState } from 'react'

function ema(values, period) {
  const k = 2 / (period + 1)
  let prev = values[0] ?? 0
  const out = []
  for (let i = 0; i < values.length; i += 1) {
    const v = values[i]
    prev = i === 0 ? v : v * k + prev * (1 - k)
    out.push(prev)
  }
  return out
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function fmtPrice(n) {
  const d = n >= 1000 ? 2 : n >= 1 ? 4 : 6
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

export default function CandleChart({
  symbol = 'BTC/USDT',
  intervalMs = 1200,
  showEMA = true,
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const [tf, setTf] = useState('5m')
  const [ind, setInd] = useState({ ema: true, rsi: false, macd: false, bb: false })

  const stateRef = useRef({
    candles: [],
    lastPrice: 67842.3,
    phase: 0,
  })

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W']
  const indicators = [
    { key: 'ema', label: 'EMA' },
    { key: 'rsi', label: 'RSI' },
    { key: 'macd', label: 'MACD' },
    { key: 'bb', label: 'BB' },
  ]

  const seed = useMemo(() => {
    const base = symbol.startsWith('ETH') ? 3524.8 : symbol.startsWith('SOL') ? 182.4 : 67842.3
    return base
  }, [symbol])

  useEffect(() => {
    // init candles
    const arr = []
    let p = seed
    for (let i = 0; i < 90; i += 1) {
      const o = p
      const drift = (Math.random() - 0.5) * 0.006
      const c = o * (1 + drift)
      const hi = Math.max(o, c) * (1 + Math.random() * 0.002)
      const lo = Math.min(o, c) * (1 - Math.random() * 0.002)
      const v = 120 + Math.random() * 620
      arr.push({ o, h: hi, l: lo, c, v })
      p = c
    }
    stateRef.current = { candles: arr, lastPrice: p, phase: 1 }
  }, [seed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    const pad = { l: 56, r: 78, t: 18, b: 42 }
    const volH = 80

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = (ts) => {
      const dt = ts - (lastTsRef.current || ts)
      lastTsRef.current = ts
      const s = stateRef.current

      // candle generation pacing
      s.phase += dt / intervalMs
      if (s.phase >= 1) {
        s.phase = 0
        const last = s.candles[s.candles.length - 1]
        const o = last?.c ?? seed
        const swing = (Math.random() - 0.5) * (symbol.startsWith('BTC') ? 0.004 : 0.007)
        const c = o * (1 + swing)
        const hi = Math.max(o, c) * (1 + Math.random() * 0.0018)
        const lo = Math.min(o, c) * (1 - Math.random() * 0.0018)
        const v = 160 + Math.random() * 740
        s.candles.push({ o, h: hi, l: lo, c, v })
        if (s.candles.length > 110) s.candles.shift()
        s.lastPrice = c
      }

      const candles = s.candles
      const closes = candles.map((c) => c.c)
      const emaLine = ema(closes, 14)

      const minP = Math.min(...candles.map((c) => c.l))
      const maxP = Math.max(...candles.map((c) => c.h))
      const range = Math.max(1e-9, maxP - minP)
      const yMin = minP - range * 0.08
      const yMax = maxP + range * 0.08

      const chartTop = pad.t
      const chartBottom = h - pad.b - volH
      const chartH = chartBottom - chartTop

      const x0 = pad.l
      const x1 = w - pad.r
      const usableW = x1 - x0

      ctx.clearRect(0, 0, w, h)

      // background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, 'rgba(10,14,26,0.0)')
      bg.addColorStop(1, 'rgba(6,9,16,0.25)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // soft glow
      const glow = ctx.createRadialGradient(w * 0.52, h * 0.22, 0, w * 0.52, h * 0.22, Math.max(w, h) * 0.7)
      glow.addColorStop(0, 'rgba(59,130,246,0.10)')
      glow.addColorStop(0.35, 'rgba(139,92,246,0.05)')
      glow.addColorStop(1, 'rgba(10,14,26,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      // grid
      ctx.strokeStyle = 'rgba(148,163,184,0.08)'
      ctx.lineWidth = 1
      for (let i = 0; i <= 6; i += 1) {
        const y = chartTop + (chartH * i) / 6
        ctx.beginPath()
        ctx.moveTo(x0, y)
        ctx.lineTo(x1, y)
        ctx.stroke()
      }

      // map helpers
      const yOf = (p) => chartTop + ((yMax - p) / (yMax - yMin)) * chartH

      const maxVol = Math.max(...candles.map((c) => c.v))

      // candles (slide-in)
      const n = candles.length
      const candleW = clamp(usableW / n, 6.8, 11.5)
      const gap = clamp(candleW * 0.38, 2.4, 5.2)
      const step = candleW + gap
      const totalW = step * n
      const xStart = x1 - totalW
      const slide = s.phase
      const slidePx = step * (1 - slide)

      // area gradient under price line (using closes)
      ctx.beginPath()
      for (let i = 0; i < n; i += 1) {
        const x = xStart + i * step + candleW / 2 + slidePx
        const y = yOf(closes[i])
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineTo(xStart + (n - 1) * step + candleW / 2 + slidePx, chartBottom)
      ctx.lineTo(xStart + 0 * step + candleW / 2 + slidePx, chartBottom)
      ctx.closePath()
      const area = ctx.createLinearGradient(0, chartTop, 0, chartBottom)
      area.addColorStop(0, 'rgba(59,130,246,0.20)')
      area.addColorStop(1, 'rgba(59,130,246,0.0)')
      ctx.fillStyle = area
      ctx.fill()

      // draw EMA
      if (showEMA && ind.ema) {
        ctx.beginPath()
        for (let i = 0; i < n; i += 1) {
          const x = xStart + i * step + candleW / 2 + slidePx
          const y = yOf(emaLine[i])
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(147,197,253,0.85)'
        ctx.lineWidth = 1.6
        ctx.shadowColor = 'rgba(59,130,246,0.35)'
        ctx.shadowBlur = 12
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // candles & volume
      for (let i = 0; i < n; i += 1) {
        const c = candles[i]
        const x = xStart + i * step + slidePx
        const up = c.c >= c.o
        const col = up ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)'
        const wickCol = up ? 'rgba(52,211,153,0.9)' : 'rgba(248,113,113,0.9)'

        const yO = yOf(c.o)
        const yC = yOf(c.c)
        const yH = yOf(c.h)
        const yL = yOf(c.l)

        // wick
        ctx.strokeStyle = wickCol
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(x + candleW / 2, yH)
        ctx.lineTo(x + candleW / 2, yL)
        ctx.stroke()

        // body
        const bodyY = Math.min(yO, yC)
        const bodyH = Math.max(2, Math.abs(yC - yO))
        const grad = ctx.createLinearGradient(0, bodyY, 0, bodyY + bodyH)
        grad.addColorStop(0, up ? 'rgba(52,211,153,0.95)' : 'rgba(248,113,113,0.95)')
        grad.addColorStop(1, col)
        ctx.fillStyle = grad
        ctx.fillRect(x, bodyY, candleW, bodyH)

        // volume
        const vh = (c.v / maxVol) * (volH - 10)
        ctx.fillStyle = up ? 'rgba(59,130,246,0.22)' : 'rgba(139,92,246,0.18)'
        ctx.fillRect(x, h - pad.b - vh, candleW, vh)
      }

      // current price line + tag
      const cp = s.lastPrice
      const yP = yOf(cp)
      ctx.setLineDash([6, 6])
      ctx.strokeStyle = 'rgba(219,234,254,0.35)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x0, yP)
      ctx.lineTo(x1, yP)
      ctx.stroke()
      ctx.setLineDash([])

      // price tag
      const tagW = 66
      const tagH = 22
      const tx = x1 + 6
      const ty = clamp(yP - tagH / 2, chartTop, chartBottom - tagH)
      ctx.fillStyle = 'rgba(59,130,246,0.22)'
      ctx.strokeStyle = 'rgba(99,179,255,0.22)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(tx, ty, tagW, tagH, 10)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = 'rgba(241,245,249,0.92)'
      ctx.font = '600 11px Inter, ui-sans-serif, system-ui'
      ctx.fillText(fmtPrice(cp), tx + 10, ty + 15)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [ind.ema, intervalMs, seed, showEMA, symbol])

  return (
    <div className="relative h-full w-full glass rounded-3xl p-4 tilt-glare">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-text-primary">{symbol}</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-glass bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-text-secondary">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]" />
            Live
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-2xl border border-glass bg-white/5 p-1">
            {timeframes.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTf(k)}
                className={[
                  'rounded-xl px-3 py-1 text-[11px] font-semibold tabular-nums transition-colors',
                  tf === k ? 'bg-white/10 text-text-primary' : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 rounded-2xl border border-glass bg-white/5 p-1">
            {indicators.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setInd((s) => ({ ...s, [it.key]: !s[it.key] }))}
                className={[
                  'rounded-xl px-3 py-1 text-[11px] font-semibold transition-colors',
                  ind[it.key] ? 'bg-white/10 text-text-primary' : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-glass bg-[#070a14]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(59,130,246,0.10),rgba(139,92,246,0.04),rgba(10,14,26,0))]" />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-text-muted">
        <div>EMA(14) / Volume</div>
        <div className="tabular-nums">{tf}</div>
      </div>
    </div>
  )
}

