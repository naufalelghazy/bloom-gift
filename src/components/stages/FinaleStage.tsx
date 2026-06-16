'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface FinaleStageProps {
  message: string;
  bouquetType: string;
  onRestart: () => void;
}

// Bouquet data: image + list of flowers with their meaning
const BOUQUET_DATA: Record<string, {
  image: string;
  label: string;
  subtitle: string;
  flowers: { name: string; meaning: string }[];
}> = {
  pink_roses: {
    image: '/bouquets/pink_roses.png',
    label: 'KASIH',
    subtitle: 'Untukmu, yang selalu hadir.',
    flowers: [
      { name: 'Pink rose', meaning: 'Tenderness' },
      { name: 'Baby\'s breath', meaning: 'Everlasting love' },
      { name: 'Eucalyptus', meaning: 'Protection' },
    ],
  },
  red_roses: {
    image: '/bouquets/red_roses.png',
    label: 'CINTA',
    subtitle: 'Sepenuh hati, hanya untukmu.',
    flowers: [
      { name: 'Red rose', meaning: 'Deep love' },
      { name: 'Pink rose', meaning: 'Admiration' },
      { name: 'Green leaf', meaning: 'Growth' },
    ],
  },
  tulips: {
    image: '/bouquets/tulips.png',
    label: 'KESETIAAN',
    subtitle: 'Bersamamu di setiap musim.',
    flowers: [
      { name: 'Pink tulip', meaning: 'Perfect love' },
      { name: 'Purple tulip', meaning: 'Royalty' },
      { name: 'White tulip', meaning: 'Forgiveness' },
    ],
  },
  sunflowers: {
    image: '/bouquets/sunflowers.png',
    label: 'KEBAHAGIAAN',
    subtitle: 'Seperti matahari, kamu selalu terang.',
    flowers: [
      { name: 'Sunflower', meaning: 'Adoration' },
      { name: 'Baby\'s breath', meaning: 'Purity' },
      { name: 'Eucalyptus', meaning: 'Healing' },
    ],
  },
  lilies: {
    image: '/bouquets/lilies.png',
    label: 'KESUCIAN',
    subtitle: 'Tulus dan apa adanya.',
    flowers: [
      { name: 'White lily', meaning: 'Purity' },
      { name: 'Pink rose', meaning: 'Gratitude' },
      { name: 'Freesia', meaning: 'Innocence' },
    ],
  },
  peonies: {
    image: '/bouquets/peonies.png',
    label: 'KEMEWAHAN',
    subtitle: 'Cinta yang berlimpah ruah.',
    flowers: [
      { name: 'Peony', meaning: 'Prosperity' },
      { name: 'Hydrangea', meaning: 'Gratitude' },
      { name: 'White daisy', meaning: 'Innocence' },
    ],
  },
  lavender: {
    image: '/bouquets/lavender.png',
    label: 'KETENANGAN',
    subtitle: 'Bersamamu, hatiku tenang.',
    flowers: [
      { name: 'Lavender', meaning: 'Devotion' },
      { name: 'White rose', meaning: 'Serenity' },
      { name: 'Chamomile', meaning: 'Calm' },
    ],
  },
  cherry_blossom: {
    image: '/bouquets/cherry_blossom.png',
    label: 'APRESIASI',
    subtitle: 'Terima kasih karena tetap ada.',
    flowers: [
      { name: 'Pink rose', meaning: 'Gratitude' },
      { name: 'Blue hydrangea', meaning: 'Gratitude' },
      { name: 'White daisy', meaning: 'Innocence' },
    ],
  },
};

const FALLBACK = BOUQUET_DATA['cherry_blossom'];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  type: 'heart' | 'petal';
}

export default function FinaleStage({ message, bouquetType, onRestart }: FinaleStageProps) {
  const [tapped, setTapped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const data = BOUQUET_DATA[bouquetType] ?? FALLBACK;

  const handleBouquetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spawn 6 random particles
    const newParticles: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      x,
      y,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.7,
      type: Math.random() > 0.4 ? 'petal' : 'heart'
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTapped(true);
  };

  const removeParticle = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col items-stretch bg-[#f8f5f0] relative overflow-hidden">

      {/* Bouquet Image — top half */}
      <motion.div
        className="relative w-full flex-1 flex items-end justify-center overflow-hidden"
        style={{ minHeight: '55%', maxHeight: '60%' }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        onClick={handleBouquetClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.image}
          alt="Bouquet"
          className="w-full h-full object-cover object-top cursor-pointer select-none"
          draggable={false}
        />

        {/* Tap ripple overlay */}
        <AnimatePresence>
          {tapped && (
            <motion.div
              key="ripple"
              className="absolute inset-0 bg-white/20 pointer-events-none z-20"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              onAnimationComplete={() => setTapped(false)}
              transition={{ duration: 0.4 }}
            />
          )}
        </AnimatePresence>

        {/* Floating particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0.9,
                scale: p.scale,
                x: p.x,
                y: p.y,
                rotate: p.rotation
              }}
              animate={{
                opacity: 0,
                y: p.y - 200 - Math.random() * 80,
                x: p.x + (Math.random() - 0.5) * 160,
                rotate: p.rotation + (Math.random() - 0.5) * 240,
                scale: p.scale * 0.6
              }}
              exit={{ opacity: 0 }}
              onAnimationComplete={() => removeParticle(p.id)}
              className="absolute pointer-events-none z-30 select-none text-xl"
              style={{ originX: 0.5, originY: 0.5 }}
              transition={{
                duration: 1.8 + Math.random() * 0.8,
                ease: 'easeOut'
              }}
            >
              {p.type === 'heart' ? (
                <span className="text-rose-400 drop-shadow-[0_1.5px_2px_rgba(244,63,94,0.2)]">❤️</span>
              ) : (
                <span 
                  className="inline-block w-4.5 h-3 bg-rose-200/90 border border-rose-300/30 shadow-xs"
                  style={{ borderRadius: '60% 40% 55% 45% / 60% 40% 60% 40%' }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Info Card — bottom half */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
        className="w-full bg-white/80 backdrop-blur-md rounded-t-3xl shadow-2xl px-6 pt-6 pb-4 flex flex-col gap-3 z-10"
        style={{ minHeight: '42%' }}
      >
        {/* Label */}
        <p className="text-[10px] font-bold tracking-[0.22em] text-[#9b6e6e] uppercase text-center">
          {data.label}
        </p>

        {/* Script title */}
        <h2
          className="text-center leading-snug text-[#6b3a3a] font-dancing-script"
          style={{ fontSize: '1.55rem', fontWeight: 700 }}
        >
          {message || 'Untukmu, yang selalu ada'}
        </h2>

        {/* Subtitle */}
        <p className="text-center text-sm text-[#7a5c5c]">{data.subtitle}</p>

        {/* Flower meaning tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {data.flowers.map((f) => (
            <span
              key={f.name}
              className="text-[11px] px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-stone-600"
            >
              <span className="font-semibold text-rose-700">{f.name}</span>
              <span className="text-stone-400"> · {f.meaning}</span>
            </span>
          ))}
        </div>

        {/* Tap hint */}
        <p className="text-center text-[11px] text-stone-400 mt-0.5">
          Ketuk buketnya pelan-pelan ♡
        </p>

        {/* Restart button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onRestart}
          className="mt-2 w-full py-3 rounded-full bg-[#9b3a4a] hover:bg-[#7f2e3d] text-white text-sm font-semibold shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Lihat buket lagi
        </motion.button>
      </motion.div>

    </div>
  );
}
