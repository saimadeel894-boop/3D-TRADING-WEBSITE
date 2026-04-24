import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView.js'

export default function Reveal({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ rootMargin: '0px 0px -12% 0px', threshold: 0.15 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

