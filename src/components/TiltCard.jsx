import { useMemo, useRef } from 'react'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export default function TiltCard({
  children,
  className = '',
  tilt = 7,
  scale = 1.01,
  glare = true,
}) {
  const ref = useRef(null)
  const style = useMemo(
    () => ({
      transformStyle: 'preserve-3d',
      willChange: 'transform',
    }),
    [],
  )

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / Math.max(1, r.width)
    const py = (e.clientY - r.top) / Math.max(1, r.height)
    const rx = (0.5 - py) * tilt
    const ry = (px - 0.5) * tilt
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
    if (glare) {
      el.style.setProperty('--gx', `${clamp(px * 100, 0, 100)}%`)
      el.style.setProperty('--gy', `${clamp(py * 100, 0, 100)}%`)
    }
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={['relative preserve-3d', glare ? 'tilt-glare' : '', className].join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}

