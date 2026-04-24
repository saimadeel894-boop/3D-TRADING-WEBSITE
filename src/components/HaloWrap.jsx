import { useEffect, useRef } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function HaloWrap({ children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / Math.max(1, r.width)
      const py = (e.clientY - r.top) / Math.max(1, r.height)
      el.style.setProperty('--hx', `${clamp(px * 100, 0, 100)}%`)
      el.style.setProperty('--hy', `${clamp(py * 100, 0, 100)}%`)
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={ref} className={['relative halo-wrap', className].join(' ')}>
      <div className="halo-ring" />
      <div className="cursor-halo" />
      {children}
    </div>
  )
}

