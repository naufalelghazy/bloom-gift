'use client';

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface FinaleStageProps {
  message: string;
  bouquetType: string;
  onRestart: () => void;
}

export default function FinaleStage({ message, bouquetType, onRestart }: FinaleStageProps) {
  const hearts = Array.from({ length: 6 });

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/20 shadow-xl text-center space-y-8 flex flex-col items-center relative overflow-hidden">
      {/* Floating Sparkles/Hearts particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {hearts.map((_, idx) => (
          <motion.div
            key={idx}
            initial={{
              opacity: 0,
              y: 200,
              x: Math.random() * 200 - 100 + 100,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: -50,
              x: Math.random() * 300 - 150 + 100,
            }}
            transition={{
              duration: Math.random() * 2.5 + 2.5,
              repeat: Infinity,
              delay: idx * 0.8,
              ease: 'easeInOut'
            }}
            className="absolute text-rose-400 text-xl"
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Animated Bouquet SVG */}
      <div className="w-40 h-40 relative">
        <motion.svg
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
          className="w-full h-full drop-shadow-md overflow-visible"
          viewBox="0 0 100 100"
        >
          {/* Bouquet wrapper */}
          <path d="M 30 70 L 50 90 L 70 70 L 60 50 L 40 50 Z" fill="#dbeade" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M 50 90 L 35 60 L 65 60 Z" fill="#e2e8f0" />
          {/* Ribbon */}
          <path d="M 45 75 Q 50 72 55 75 L 53 79 Q 50 76 47 79 Z" fill="#ef4444" />
          <circle cx="50" cy="75" r="3" fill="#f59e0b" />

          {/* Left Rose */}
          <g transform="translate(35, 45) scale(0.7)">
            <circle cx="0" cy="0" r="15" fill="#fda4af" />
            <path d="M-8 -5 C-5 -15 5 -15 8 -5 C12 5 -12 5 -8 -5" fill="#ef4444" />
            <path d="M-5 -2 C0 -10 10 -2 5 3 C0 8 -10 3 -5 -2" fill="#f43f5e" />
          </g>

          {/* Right Rose */}
          <g transform="translate(65, 45) scale(0.7)">
            <circle cx="0" cy="0" r="15" fill="#fda4af" />
            <path d="M-8 -5 C-5 -15 5 -15 8 -5 C12 5 -12 5 -8 -5" fill="#ef4444" />
            <path d="M-5 -2 C0 -10 10 -2 5 3 C0 8 -10 3 -5 -2" fill="#f43f5e" />
          </g>

          {/* Center Rose */}
          <g transform="translate(50, 35)">
            <circle cx="0" cy="0" r="15" fill="#fecdd3" />
            <path d="M-8 -5 C-5 -15 5 -15 8 -5 C12 5 -12 5 -8 -5" fill="#ef4444" />
            <path d="M-5 -2 C0 -10 10 -2 5 3 C0 8 -10 3 -5 -2" fill="#e11d48" />
          </g>

          {/* Green leaves */}
          <path d="M 22 55 Q 15 45 25 45 Z" fill="#86efac" />
          <path d="M 78 55 Q 85 45 75 45 Z" fill="#86efac" />
          <path d="M 50 22 Q 40 15 45 28 Z" fill="#86efac" />
        </motion.svg>
      </div>

      {/* Message Card */}
      <div className="space-y-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-serif font-bold text-stone-800 leading-snug"
        >
          {message}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-stone-500 text-sm"
        >
          Hadiah digital ini mekar saat dibuka dan akan tersimpan sebagai kenangan indah.
        </motion.p>
      </div>

      {/* Replay/Restart Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        onClick={onRestart}
        className="flex items-center justify-center gap-2 mx-auto px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 hover:border-stone-300 transition-all hover:scale-105 active:scale-95 text-xs shadow-sm relative z-10"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Buka Kembali Kado
      </motion.button>
    </div>
  );
}
