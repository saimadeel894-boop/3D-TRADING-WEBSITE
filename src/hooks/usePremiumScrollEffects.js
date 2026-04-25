import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'

gsap.registerPlugin(ScrollTrigger)

function scrambleToText(el, duration = 0.9) {
  const finalText = el.dataset.scrambleText || el.textContent || ''
  const state = { progress: 0 }
  const total = finalText.length

  return gsap.to(state, {
    progress: 1,
    duration,
    ease: 'power3.out',
    onStart: () => {
      el.dataset.scrambleText = finalText
    },
    onUpdate: () => {
      const revealCount = Math.floor(state.progress * total)
      let next = ''
      for (let i = 0; i < total; i += 1) {
        if (i < revealCount || finalText[i] === ' ') {
          next += finalText[i]
        } else {
          next += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }
      }
      el.textContent = next
    },
    onComplete: () => {
      el.textContent = finalText
    },
  })
}

export function usePremiumScrollEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.8, y: 36 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      gsap.utils.toArray('[data-parallax-bg]').forEach((el) => {
        gsap.to(el, {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        })
      })

      gsap.utils.toArray('[data-scramble]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => scrambleToText(el),
        })
      })

      const flyer = document.querySelector('[data-logo-flyer]')
      const target = document.querySelector('[data-logo-target]')
      if (flyer && target) {
        const placeFlyer = () => {
          const targetRect = target.getBoundingClientRect()
          const size = Math.max(54, targetRect.width)
          gsap.set(flyer, {
            width: size,
            height: size,
            top: window.innerHeight * 0.5 - size * 0.5,
            left: window.innerWidth * 0.5 - size * 0.5,
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1.45,
            rotate: 0.01,
          })
        }

        placeFlyer()
        ScrollTrigger.addEventListener('refreshInit', placeFlyer)

        gsap.to(flyer, {
          x: () => {
            const rect = target.getBoundingClientRect()
            return rect.left + rect.width * 0.5 - window.innerWidth * 0.5
          },
          y: () => {
            const rect = target.getBoundingClientRect()
            return rect.top + rect.height * 0.5 - window.innerHeight * 0.5
          },
          scale: 0.55,
          opacity: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '+=320',
            scrub: 0.9,
          },
        })
      }
    })

    ScrollTrigger.refresh()
    return () => {
      ctx.revert()
    }
  }, [])
}
