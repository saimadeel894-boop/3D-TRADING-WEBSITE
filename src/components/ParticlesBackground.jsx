import { useEffect, useMemo, useRef } from 'react'

export default function ParticlesBackground({ density = 120, speed = 0.08 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  const seeds = useMemo(() => {
    const arr = []
    for (let i = 0; i < density; i += 1) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.6 + Math.random() * 1.6,
        a: 0.08 + Math.random() * 0.22,
        s: (0.35 + Math.random() * 1.15) * (Math.random() > 0.5 ? 1 : -1),
      })
    }
    return arr
  }, [density])

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

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, Math.max(w, h) * 0.8)
      g.addColorStop(0, 'rgba(59,130,246,0.06)')
      g.addColorStop(0.35, 'rgba(139,92,246,0.03)')
      g.addColorStop(1, 'rgba(10,14,26,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      for (const p of seeds) {
        p.x = (p.x + (speed * p.s) / 1000) % 1
        if (p.x < 0) p.x += 1
        const x = p.x * w
        const y = p.y * h
        ctx.beginPath()
        ctx.fillStyle = `rgba(219,234,254,${p.a})`
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [seeds, speed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-90"
      aria-hidden="true"
    />
  )
}

