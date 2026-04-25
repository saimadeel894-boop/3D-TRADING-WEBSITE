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
  const hoverRef = useRef({ active: false, x: 0, y: 0 })

  const mergedCandles = useMemo(() => {
    if (Array.isArray(candles) && candles.length >= 20) return candles.slice(-120)
    return dataRef.current
  }, [candles])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const container = canvas.parentElement
    if (!container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let frame = 0

    const drawChart = () => {
      const W = canvas.width;
      const H = canvas.height;
      
      const candlesList = mergedCandles;
      if (!candlesList.length) return;

      // Section heights
      const candleH = H * 0.65;
      const volumeH = H * 0.18;
      const rsiH    = H * 0.12;
      const gap     = 4;
      
      const pad = { l: 60, r: 80, t: 16, b: 4 };
      const chartW = W - pad.l - pad.r;
      const n = candlesList.length;
      const cw = Math.max(4, Math.floor(chartW / n) - 1);

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#060e1a';
      ctx.fillRect(0, 0, W, H);

      // Price range
      const highs = candlesList.map(c => c.h);
      const lows  = candlesList.map(c => c.l);
      const maxP  = Math.max(...highs);
      const minP  = Math.min(...lows);
      const range = maxP - minP || 1;

      // Y position for price — HIGH PRICE = TOP of canvas
      const priceToY = (price) =>
        pad.t + (1 - (price - minP) / range) * (candleH - pad.t - pad.b);

      // Grid lines
      ctx.strokeStyle = 'rgba(0,180,255,0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 6; i++) {
        const y = pad.t + (i / 6) * (candleH - pad.t - pad.b);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
        const price = maxP - (i / 6) * range;
        ctx.fillStyle = 'rgba(74,122,155,0.9)';
        ctx.font = '9px JetBrains Mono';
        ctx.textAlign = 'right';
        ctx.fillText(price.toFixed(2), W - pad.r + 76, y + 3);
      }

      // EMA calculation
      const calcEMA = (data, period) => {
        if (data.length === 0) return [];
        const k = 2 / (period + 1);
        let emaOut = [data[0].c];
        for (let i = 1; i < data.length; i++)
          emaOut.push(data[i].c * k + emaOut[i-1] * (1 - k));
        return emaOut;
      };
      const ema9  = calcEMA(candlesList, 9);
      const ema21 = calcEMA(candlesList, 21);

      // Draw EMA lines
      const drawEMA = (emaArr, color) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        emaArr.forEach((v, i) => {
          const x = pad.l + i * (cw + 1) + cw / 2;
          const y = priceToY(v);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
      };
      drawEMA(ema9,  'rgba(139,92,246,0.8)');   // purple
      drawEMA(ema21, 'rgba(0,212,255,0.65)');   // cyan

      // Draw candles
      candlesList.forEach((c, i) => {
        const x  = pad.l + i * (cw + 1);
        const yH = priceToY(c.h);
        const yL = priceToY(c.l);
        const yO = priceToY(c.o);
        const yC = priceToY(c.c);
        const up = c.c >= c.o;
        const color = up ? '#00e676' : '#ff3d71';

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + cw/2, yH);
        ctx.lineTo(x + cw/2, yL);
        ctx.stroke();

        // Body
        const bodyTop = Math.min(yO, yC);
        const bodyH   = Math.max(2, Math.abs(yC - yO));
        ctx.fillStyle = color;
        ctx.shadowColor = up ? 'rgba(0,230,118,0.3)' : 'rgba(255,61,113,0.3)';
        ctx.shadowBlur = 3;
        ctx.fillRect(x, bodyTop, cw, bodyH);
        ctx.shadowBlur = 0;
      });

      // Volume bars (grow FROM BOTTOM UP)
      const maxVol = Math.max(...candlesList.map(c => c.v));
      const volTop = candleH + gap;
      candlesList.forEach((c, i) => {
        const x   = pad.l + i * (cw + 1);
        const pct = c.v / maxVol;
        const barH = pct * volumeH;
        const y    = volTop + volumeH - barH; // bottom-aligned
        ctx.fillStyle = c.c >= c.o
          ? 'rgba(0,230,118,0.3)'
          : 'rgba(255,61,113,0.3)';
        ctx.fillRect(x, y, cw, barH);
      });
      ctx.fillStyle = 'rgba(74,122,155,0.5)';
      ctx.font = '8px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText('VOL', pad.l + 4, volTop + 12);

      // RSI line
      const rsiTop = candleH + volumeH + gap * 2;
      [30, 50, 70].forEach(level => {
        const y = rsiTop + rsiH - (level / 100) * rsiH;
        ctx.strokeStyle = 'rgba(0,180,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
        ctx.fillStyle = 'rgba(74,122,155,0.5)';
        ctx.font = '8px JetBrains Mono';
        ctx.textAlign = 'right';
        ctx.fillText(level, pad.l - 4, y + 3);
      });
      ctx.strokeStyle = 'rgba(240,180,41,0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      candlesList.forEach((_, i) => {
        const rsiVal = 35 + Math.sin(i * 0.18) * 22 + Math.cos(i * 0.07) * 10;
        const x = pad.l + i * (cw + 1) + cw / 2;
        const y = rsiTop + rsiH - (Math.max(0, Math.min(100, rsiVal)) / 100) * rsiH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = 'rgba(74,122,155,0.5)';
      ctx.font = '8px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText('RSI', pad.l + 4, rsiTop + 12);
    };

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width  = rect.width;
        canvas.height = rect.height;
        drawChart();
      }
    };

    setSize();
    const t1 = setTimeout(setSize, 100);
    const t2 = setTimeout(setSize, 500);

    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
    };
  }, [mergedCandles, pair])

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0, minWidth: 0, background: 'rgba(6,14,26,0.88)' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
    </div>
  )
}

