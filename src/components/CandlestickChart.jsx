import { useEffect, useRef } from 'react'
import { CandlestickSeries, ColorType, CrosshairMode, createChart } from 'lightweight-charts'

export default function CandlestickChart({
  pair = 'BTC/USDT',
  candles = [],
  isLoading = false,
  status = 'connecting',
  interval = '1m',
  intervals = ['1m', '5m', '15m', '1h', '4h', '1d'],
  onInterval,
}) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const { width, height } = container.getBoundingClientRect()
    const chart = createChart(container, {
      width: Math.max(300, Math.floor(width)),
      height: Math.max(320, Math.floor(height)),
      layout: {
        background: { type: ColorType.Solid, color: '#020203' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: 'rgba(0,242,255,0.18)' },
        horzLine: { color: 'rgba(0,242,255,0.18)' },
      },
      rightPriceScale: { borderColor: 'rgba(0,242,255,0.15)' },
      timeScale: { borderColor: 'rgba(0,242,255,0.15)', timeVisible: true },
    })
    const seriesOptions = {
      upColor: '#00FF41',
      downColor: '#FF3131',
      borderUpColor: '#00FF41',
      borderDownColor: '#FF3131',
      wickUpColor: '#00FF41',
      wickDownColor: '#FF3131',
    }
    const series =
      typeof chart.addCandlestickSeries === 'function'
        ? chart.addCandlestickSeries(seriesOptions)
        : chart.addSeries(CandlestickSeries, seriesOptions)
    chartRef.current = chart
    seriesRef.current = series

    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect()
      chart.applyOptions({
        width: Math.max(300, Math.floor(r.width)),
        height: Math.max(320, Math.floor(r.height)),
      })
    })
    ro.observe(container)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [pair])

  useEffect(() => {
    if (!seriesRef.current) return
    if (!Array.isArray(candles) || !candles.length) {
      seriesRef.current.setData([])
      return
    }
    seriesRef.current.setData(
      candles.map((c) => ({
        time: Math.floor(c.t / 1000),
        open: c.o,
        high: c.h,
        low: c.l,
        close: c.c,
      })),
    )
  }, [candles])

  return (
    <div className="glass" style={{ borderRadius: 18, padding: 12, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>{pair}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            className="pill mono"
            style={{
              color: status === 'connected' ? 'var(--green)' : status === 'disconnected' ? 'var(--red)' : 'var(--gold)',
            }}
          >
            {isLoading ? 'LOADING' : status.toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
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
      <div
        style={{
          position: 'relative',
          height: 'calc(100% - 34px)',
          minHeight: 420,
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.12)',
        }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

