'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-cream flex items-center justify-center">
      <motion.div
        className="flex items-center gap-1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.span
          className="font-heading text-5xl font-bold text-charcoal"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          W
        </motion.span>
        <motion.span
          className="font-heading text-5xl font-bold text-gold"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        >
          O
        </motion.span>
        <motion.span
          className="font-heading text-5xl font-bold text-charcoal"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          W
        </motion.span>
      </motion.div>
    </div>
  );
}
