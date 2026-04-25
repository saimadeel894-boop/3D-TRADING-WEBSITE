import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    })

    const onFrame = (time) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onFrame)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onFrame)
      lenis.destroy()
    }
  }, [])

  return children
}
