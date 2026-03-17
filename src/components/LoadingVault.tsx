'use client';

import { motion } from 'motion/react';

export function LoadingVault() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-12">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--blood-bright)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </motion.div>
      <motion.p
        className="text-sm font-body italic tracking-wide"
        style={{ color: 'var(--ash)' }}
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        The oracle deliberates...
      </motion.p>
    </div>
  );
}
