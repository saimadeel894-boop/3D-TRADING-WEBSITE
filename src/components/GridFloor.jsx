import { useEffect, useRef } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function GridFloor({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0

    const onMove = (e) => {
      const px = e.clientX / Math.max(1, window.innerWidth)
      const py = e.clientY / Math.max(1, window.innerHeight)
      targetX = (px - 0.5) * 1.2
      targetY = (py - 0.5) * 1.0
    }

    const tick = () => {
      x += (targetX - x) * 0.05
      y += (targetY - y) * 0.05
      el.style.setProperty('--gx', `${clamp(50 + x * 24, 0, 100)}%`)
      el.style.setProperty('--gy', `${clamp(65 + y * 20, 0, 100)}%`)
      el.style.setProperty('--rx', `${(-6 + y * 6).toFixed(2)}deg`)
      el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={['pointer-events-none absolute inset-x-0 bottom-0 h-[62vh] opacity-90', className].join(' ')}
    >
      <div className="absolute inset-0 grid-floor" />
    </div>
  )
}

