'use client';

import { motion } from 'framer-motion';

export default function PremiumLoader() {
  return (
    <div className="flex items-center justify-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-white rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 0px rgba(56, 189, 248, 0)",
              "0 0 10px rgba(56, 189, 248, 0.8)",
              "0 0 0px rgba(56, 189, 248, 0)"
            ]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
