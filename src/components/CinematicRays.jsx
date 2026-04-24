import { useEffect, useRef } from 'react'

export default function CinematicRays({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let t = 0
    const tick = () => {
      t += 0.002
      const a = 35 + Math.sin(t) * 6
      const b = 55 + Math.cos(t * 0.8) * 8
      el.style.setProperty('--rayA', `${a}%`)
      el.style.setProperty('--rayB', `${b}%`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={[
        'pointer-events-none absolute inset-0 opacity-70',
        className,
      ].join(' ')}
      style={{
        background:
          'conic-gradient(from 190deg at var(--rayA, 40%) var(--rayB, 55%), rgba(59,130,246,0.0), rgba(59,130,246,0.10), rgba(139,92,246,0.0), rgba(59,130,246,0.0))',
        filter: 'blur(24px)',
        mixBlendMode: 'screen',
      }}
    />
  )
}

