'use client';

import { motion } from 'framer-motion';

interface BackgroundEffectProps {
  isActive?: boolean;
}

export default function BackgroundEffect({ isActive = false }: BackgroundEffectProps) {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      {/* Main Blue Glow - Top Left */}
      <motion.div
        animate={{
          scale: isActive ? [1.2, 1.5, 1.2] : [1, 1.2, 1],
          opacity: isActive ? [0.6, 0.8, 0.6] : [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: isActive ? 4 : 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/30 blur-[100px]"
      />

      {/* Cyan Glow - Bottom Right */}
      <motion.div
        animate={{
          scale: isActive ? [1.1, 1.4, 1.1] : [1, 1.1, 1],
          opacity: isActive ? [0.5, 0.7, 0.5] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isActive ? 5 : 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-400/30 blur-[100px]"
      />

      {/* Purple Accent - Center */}
      <motion.div
        animate={{
          opacity: isActive ? [0.3, 0.5, 0.3] : [0.2, 0.4, 0.2],
          scale: isActive ? [1.2, 1.4, 1.2] : [1, 1.2, 1],
        }}
        transition={{
          duration: isActive ? 6 : 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[80px]"
      />
      
      {/* Glass Overlay Texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.05]" />
    </div>
  );
}
