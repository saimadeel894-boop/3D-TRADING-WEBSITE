import { AnimatePresence, motion } from 'framer-motion'

export default function RouteTransition({ routeKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        className="lens-wipe"
        initial={{ opacity: 0, filter: 'blur(12px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: 'blur(14px)' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute left-[-35%] top-[18%] h-[120px] w-[70%] rotate-[-14deg]"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,14,26,0), rgba(219,234,254,0.22), rgba(59,130,246,0.20), rgba(10,14,26,0))',
            filter: 'blur(16px)',
          }}
          initial={{ x: '-30%', opacity: 0 }}
          animate={{ x: '160%', opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

