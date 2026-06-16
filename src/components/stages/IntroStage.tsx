'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionImage = motion(Image);

interface IntroStageProps {
  intro: {
    title: string;
    subtitle: string;
  };
  flowerStyle?: string;
  onComplete: () => void;
}

export default function IntroStage({ intro, flowerStyle = 'rose', onComplete }: IntroStageProps) {
  const [isAppeared, setIsAppeared] = useState(false);

  useEffect(() => {
    // Set isAppeared to true after the initial entry animation finishes
    const appearTimer = setTimeout(() => {
      setIsAppeared(true);
    }, 1200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(appearTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Render function for different animations
  const renderAnimation = () => {
    switch (flowerStyle) {
      case 'heart':
        return (
          <div className="relative w-48 h-48 flex items-center justify-center">
            <MotionImage
              src="/intro_heart.webp"
              alt="Heart"
              width={144}
              height={144}
              className="w-36 h-36 object-contain select-none z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.15, 1.05, 1.15, 1],
                opacity: 1
              }}
              transition={{
                scale: {
                  duration: 1.3,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 0.4
                },
                opacity: { duration: 0.5, delay: 0.3 }
              }}
            />
            {/* Floating tiny hearts */}
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = (i * 72 * Math.PI) / 180;
              const distance = 45;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              return (
                <motion.div
                  key={i}
                  className="absolute z-0 pointer-events-none text-rose-300 text-sm select-none"
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.3, 1, 0],
                    opacity: [0, 0.9, 0.9, 0],
                    x: [x, x * 1.35],
                    y: [y, y - 30],
                    rotate: [0, (i - 2) * 15]
                  }}
                  transition={{
                    delay: 0.8 + i * 0.3,
                    duration: 2.0,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeOut'
                  }}
                >
                  ♥
                </motion.div>
              );
            })}
          </div>
        );

      case 'fireworks':
        return (
          <div className="relative w-48 h-48 flex items-center justify-center">
            <MotionImage
              src="/intro_sparkles.webp"
              alt="Sparkles"
              width={160}
              height={160}
              className="w-40 h-40 object-contain select-none z-10"
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                rotate: [0, 8, 0],
                opacity: 1
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: 0.3 }
              }}
            />
            {/* Glitter dots */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const distance = 60;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-amber-300 z-0 pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 0.9, 0],
                    x: [x, x * 1.25],
                    y: [y, y * 1.25]
                  }}
                  transition={{
                    delay: 0.6 + i * 0.15,
                    duration: 1.4,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: 'easeOut'
                  }}
                />
              );
            })}
          </div>
        );

      case 'envelope':
        return (
          <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
            <g filter="url(#watercolorFilter)">
              {/* Ambient shadow for the entire envelope */}
              <rect x="26" y="77" width="148" height="82" rx="4" fill="rgba(0, 0, 0, 0.08)" />

              {/* 1. Envelope Back Pocket */}
              <rect x="30" y="75" width="140" height="80" rx="3" fill="#eae7dd" stroke="#d4af37" strokeWidth="1" />

              {/* 2. Envelope Top Flap */}
              <motion.path
                initial={{ d: "M 30 75 L 100 115 L 170 75 Z" }}
                animate={{
                  d: "M 30 75 L 100 32 L 170 75 Z"
                }}
                transition={{ delay: 0.8, duration: 0.7, ease: 'easeInOut' as const }}
                fill="#fcfbf7"
                stroke="#d4af37"
                strokeWidth="1.5"
              />

              {/* 3. The Letter Card */}
              <motion.g
                initial={{ y: 78, opacity: 0 }}
                animate={{ y: 15, opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.2, ease: 'easeOut' as const, type: 'tween' }}
              >
                {/* Parchment letter paper */}
                <rect x="36" y="0" width="128" height="82" rx="4" fill="#fefae0" stroke="#d4af37" strokeWidth="1.5" />
                {/* Inner dashed gold frame */}
                <rect x="40" y="4" width="120" height="74" rx="2" fill="none" stroke="#e9c46a" strokeWidth="0.5" strokeDasharray="3 2" />
                
                {/* Royal Seal Watermark */}
                <circle cx="100" cy="18" r="8" fill="#d4af37" opacity="0.95" />
                <path d="M 97 20 L 95 16 L 98 17 L 100 13 L 102 17 L 105 16 L 103 20 Z" fill="#fefae0" />
                
                {/* Navy handwriting lines */}
                <line x1="50" y1="36" x2="150" y2="36" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 2" />
                <line x1="50" y1="46" x2="150" y2="46" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 3" />
                <line x1="50" y1="56" x2="150" y2="56" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
                <line x1="50" y1="66" x2="110" y2="66" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 2" />
              </motion.g>

              {/* 4. Envelope Front Flaps */}
              <path d="M 30 75 L 30 155 L 100 115 Z" fill="#f6f4ed" stroke="#e3dfd5" strokeWidth="0.5" />
              <path d="M 170 75 L 170 155 L 100 115 Z" fill="#f6f4ed" stroke="#e3dfd5" strokeWidth="0.5" />
              <path d="M 30 155 L 170 155 L 100 115 Z" fill="#faf9f5" stroke="#e3dfd5" strokeWidth="0.5" />
              <path d="M 30 155 L 100 115 L 170 155" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* 5. Wax Seal */}
              <motion.g
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: [1, 1.15, 0], opacity: [1, 1, 0] }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' as const, type: 'tween' }}
              >
                <path
                  d="M 100 92 C 112 90, 118 102, 116 112 C 114 122, 106 128, 98 126 C 90 124, 84 116, 86 106 C 88 96, 90 94, 100 92 Z"
                  fill="#800020"
                />
                <circle cx="100" cy="109" r="12" fill="#5c0017" />
                <path
                  d="M 96 112 L 94 107 L 98 108 L 100 104 L 102 108 L 106 107 L 104 112 Z"
                  fill="#d4af37"
                />
              </motion.g>
            </g>
          </svg>
        );

      case 'scroll':
        return (
          <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            <g transform="translate(100, 100)" filter="url(#watercolorFilter)">
              {/* Parchment background */}
              <motion.rect
                x="-55"
                y="-60"
                width="110"
                height="120"
                rx="4"
                fill="#f5ebd0"
                stroke="#d4af37"
                strokeWidth="2.5"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' as const, type: 'tween' }}
                style={{ originY: 0.5 }}
              />

              {/* Royal handwritten lines */}
              <motion.path
                d="M -35 -30 L 35 -30"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ delay: 1.2, duration: 0.8, type: 'tween' }}
              />
              <motion.path
                d="M -40 -10 L 40 -10"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="5 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ delay: 1.5, duration: 0.8, type: 'tween' }}
              />
              <motion.path
                d="M -30 10 L 30 10"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="3 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ delay: 1.8, duration: 0.8, type: 'tween' }}
              />

              {/* Top Golden Roller */}
              <motion.g
                initial={{ y: 0 }}
                animate={{ y: -60 }}
                transition={{ duration: 1.5, ease: 'easeInOut' as const, type: 'tween' }}
              >
                <rect x="-60" y="-4" width="120" height="8" rx="2" fill="url(#goldGradient)" />
                <circle cx="-60" cy="0" r="6" fill="#b45309" />
                <circle cx="60" cy="0" r="6" fill="#b45309" />
              </motion.g>

              {/* Bottom Golden Roller */}
              <motion.g
                initial={{ y: 0 }}
                animate={{ y: 60 }}
                transition={{ duration: 1.5, ease: 'easeInOut' as const, type: 'tween' }}
              >
                <rect x="-60" y="-4" width="120" height="8" rx="2" fill="url(#goldGradient)" />
                <circle cx="-60" cy="0" r="6" fill="#b45309" />
                <circle cx="60" cy="0" r="6" fill="#b45309" />
              </motion.g>

              {/* Royal Wax Seal */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.2, type: 'spring', stiffness: 150, damping: 12 }}
              >
                <circle cx="0" cy="30" r="16" fill="#b91c1c" />
                <circle cx="0" cy="30" r="12" fill="none" stroke="#991b1b" strokeWidth="1" />
                <path
                  d="M -5 34 L -7 28 L -2 30 L 0 25 L 2 30 L 7 28 L 5 34 Z"
                  fill="#fde047"
                />
              </motion.g>
            </g>
          </svg>
        );

      case 'rose':
      default:
        return (
          <div className="relative w-48 h-48 flex items-center justify-center">
            <MotionImage
              src="/intro_rose.webp"
              alt="Rose"
              width={160}
              height={160}
              className="w-40 h-40 object-contain select-none z-10"
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 80, delay: 0.3 }}
            />
            {/* Floating petals */}
            {Array.from({ length: 5 }).map((_, i) => {
              const angle = (i * 72 * Math.PI) / 180;
              const distance = 55;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              return (
                <motion.div
                  key={i}
                  className="absolute w-3.5 h-3.5 bg-rose-200/70 z-0 pointer-events-none"
                  style={{ borderRadius: '60% 40% 55% 45% / 60% 40% 60% 40%' }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 0.8, 0],
                    opacity: [0, 0.8, 0.8, 0],
                    x: [x, x * 1.3],
                    y: [y, y - 25],
                    rotate: [0, i * 45 + 90]
                  }}
                  transition={{
                    delay: 0.8 + i * 0.25,
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    ease: 'easeOut'
                  }}
                />
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md px-6 space-y-8 select-none">
      {/* Global hidden SVG with filters */}
      <svg className="absolute w-0 h-0 invisible">
        <defs>
          <filter id="watercolorFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="0.4" />
          </filter>
        </defs>
      </svg>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const, type: 'tween' }}
          className="absolute w-36 h-36 bg-rose-200/50 rounded-full blur-2xl"
        />

        {renderAnimation()}
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
          transition={{ duration: 4.5, ease: 'easeInOut' as const }}
          className="h-full bg-rose-400"
        />
      </div>
    </div>
  );
}
