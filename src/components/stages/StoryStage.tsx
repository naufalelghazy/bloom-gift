'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { GiftContent } from '@/data/mockGifts';

interface StoryStageProps {
  content: GiftContent[];
  musicUrl: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onComplete: () => void;
}

export default function StoryStage({
  content,
  isMuted,
  onToggleMute,
  onComplete
}: StoryStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentItem = content[currentIndex];

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-between min-h-[500px] p-6 relative">
      {/* Floating Sound Toggle */}
      <div className="absolute -top-4 right-4 z-10 flex items-center gap-2">
        {!isMuted && (
          <div className="flex gap-0.5 items-end h-3">
            {[0.6, 0.3, 0.8, 0.4].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: ['15%', '100%', '15%'] }}
                transition={{ duration: h + 0.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 bg-rose-400"
              />
            ))}
          </div>
        )}
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-full bg-white/80 hover:bg-white shadow-md border border-stone-100 text-stone-600 transition hover:scale-105 active:scale-95"
          title={isMuted ? 'Turn Sound On' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-500" />}
        </button>
      </div>

      {/* Card Content Slider */}
      <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden py-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full bg-white/85 backdrop-blur-sm p-8 rounded-3xl border border-white/40 shadow-xl flex flex-col justify-center min-h-[320px] select-none"
          >
            {currentItem.type === 'text' && (
              <p className="text-stone-700 font-serif text-lg leading-relaxed text-center italic">
                “ {currentItem.body} ”
              </p>
            )}

            {currentItem.type === 'image' && (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-stone-100 shadow-inner max-h-56 flex items-center justify-center">
                  <img
                    src={currentItem.url}
                    alt={currentItem.caption || 'Memory'}
                    className="w-full h-full object-cover max-h-56"
                  />
                </div>
                {currentItem.caption && (
                  <p className="text-center text-sm font-medium text-stone-500 italic">
                    {currentItem.caption}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="w-full flex items-center justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full shadow border transition-all ${
            currentIndex === 0
              ? 'opacity-30 border-transparent bg-stone-50 text-stone-400 cursor-not-allowed'
              : 'bg-white hover:bg-stone-50 border-stone-100 text-stone-600 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          {currentIndex + 1} / {content.length}
        </span>

        <button
          onClick={handleNext}
          className={`flex items-center justify-center gap-1 transition-all ${
            currentIndex === content.length - 1
              ? 'px-5 py-3 rounded-full bg-rose-500 text-white font-medium shadow-md shadow-rose-200 hover:bg-rose-600 hover:scale-105 active:scale-95 text-sm'
              : 'p-3 rounded-full bg-white hover:bg-stone-50 border border-stone-100 text-stone-600 hover:scale-105 active:scale-95 shadow'
          }`}
        >
          {currentIndex === content.length - 1 ? (
            <>
              Lihat Kado 💐
            </>
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
