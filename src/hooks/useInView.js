import { useEffect, useRef, useState } from 'react'

export function useInView({ rootMargin = '0px 0px -10% 0px', threshold = 0.15 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
            break
          }
        }
      },
      { root: null, rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin, threshold])

  return { ref, inView }
}

