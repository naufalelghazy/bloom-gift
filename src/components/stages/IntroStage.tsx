'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntroStageProps {
  intro: {
    title: string;
    subtitle: string;
  };
  onComplete: () => void;
}

export default function IntroStage({ intro, onComplete }: IntroStageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const petalVariants = (delay: number) => ({
    hidden: { scale: 0, opacity: 0, rotate: 0 },
    visible: {
      scale: 1,
      opacity: 0.9,
      rotate: 0,
      transition: {
        delay: delay,
        duration: 1.8,
        ease: 'easeOut' as const,
      },
    },
  });

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md px-6 space-y-8 select-none">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-36 h-36 bg-rose-200/50 rounded-full blur-2xl"
        />

        <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
          <motion.path
            d="M 75 140 Q 60 115 70 105 Q 85 110 85 130 Z"
            fill="#a7f3d0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
          />
          <motion.path
            d="M 125 145 Q 140 120 130 110 Q 115 115 115 135 Z"
            fill="#a7f3d0"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0, duration: 1.2 }}
          />
          <motion.path
            d="M 100 180 Q 95 140 100 100"
            fill="none"
            stroke="#6ee7b7"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          <g transform="translate(100, 95)">
            <motion.path
              d="M 0 0 C -20 -40, 20 -40, 0 0"
              fill="#fda4af"
              variants={petalVariants(0.5)}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M 0 0 C 40 -20, 40 20, 0 0"
              fill="#fecdd3"
              transform="rotate(60)"
              variants={petalVariants(0.7)}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M 0 0 C 40 20, -10 45, 0 0"
              fill="#fda4af"
              transform="rotate(120)"
              variants={petalVariants(0.9)}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M 0 0 C 20 40, -20 40, 0 0"
              fill="#fecdd3"
              transform="rotate(180)"
              variants={petalVariants(1.1)}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M 0 0 C -40 20, -40 -20, 0 0"
              fill="#fda4af"
              transform="rotate(240)"
              variants={petalVariants(1.3)}
              initial="hidden"
              animate="visible"
            />
            <motion.path
              d="M 0 0 C -40 -20, 10 -45, 0 0"
              fill="#fecdd3"
              transform="rotate(300)"
              variants={petalVariants(1.5)}
              initial="hidden"
              animate="visible"
            />

            <motion.circle
              cx="0"
              cy="0"
              r="12"
              fill="#fde047"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8, duration: 0.8, type: 'spring' }}
            />
          </g>
        </svg>
      </div>

      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1.0 }}
          className="text-3xl md:text-4xl font-serif font-bold text-stone-800 tracking-tight"
        >
          {intro.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 1.0 }}
          className="text-stone-500 italic text-md md:text-lg font-light leading-relaxed"
        >
          {intro.subtitle}
        </motion.p>
      </div>

      <div className="w-24 h-1 bg-stone-100 rounded-full overflow-hidden mt-4 mx-auto">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4.5, ease: 'easeInOut' }}
          className="h-full bg-rose-400"
        />
      </div>
    </div>
  );
}
