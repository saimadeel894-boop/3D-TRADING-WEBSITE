import { useEffect, useMemo, useRef, useState } from 'react'

export function useRafCountUp({ to, durationMs = 1200, start = true }) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(0)
  const startTsRef = useRef(0)

  const target = useMemo(() => (Number.isFinite(to) ? to : 0), [to])

  useEffect(() => {
    if (!start) return

    startTsRef.current = 0
    const from = 0

    const tick = (ts) => {
      if (!startTsRef.current) startTsRef.current = ts
      const t = Math.min(1, (ts - startTsRef.current) / Math.max(1, durationMs))
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (target - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [durationMs, start, target])

  return value
}

