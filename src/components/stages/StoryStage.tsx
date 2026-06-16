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
  cardStyle?: string;
}

export default function StoryStage({
  content,
  isMuted,
  onToggleMute,
  onComplete,
  cardStyle = 'lined'
}: StoryStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; caption?: string } | null>(null);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 320 : -320,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring' as const, stiffness: 280, damping: 28 },
        opacity: { duration: 0.25 }
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

  // Card theme configurations
  const themeStyles = {
    lined: {
      cardClass: 'bg-[#faf8f5] border-[#eedcc5] lined-paper-story',
      textClass: 'text-[#5c4a3e]',
      quoteColor: 'text-[#db7780]/20',
      topLeftDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 0 0 C 15 20, 25 35, 40 45" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 12 18 C 10 26, 18 26, 18 18 C 18 10, 10 10, 12 18 Z" fill="#a8c19c" opacity="0.85" />
          <path d="M 28 32 C 24 38, 32 38, 32 32 C 32 26, 24 26, 28 32 Z" fill="#a8c19c" opacity="0.85" />
          <circle cx="15" cy="12" r="5" fill="#db9ba3" />
          <circle cx="12" cy="15" r="4" fill="#db9ba3" />
          <circle cx="17" cy="17" r="4" fill="#db9ba3" />
          <circle cx="28" cy="27" r="6" fill="#db9ba3" />
          <circle cx="34" cy="28" r="4" fill="#db9ba3" />
          <circle cx="15" cy="15" r="2.2" fill="#fff" />
          <circle cx="31" cy="28" r="2.2" fill="#fff" />
        </svg>
      ),
      bottomRightDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 100 100 C 80 80, 65 65, 55 45" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 85 80 C 75 80, 75 72, 85 72 C 95 72, 95 80, 85 80 Z" fill="#a8c19c" opacity="0.85" />
          <path d="M 68 60 C 58 60, 58 52, 68 52 C 78 52, 78 60, 68 60 Z" fill="#a8c19c" opacity="0.85" />
          <circle cx="82" cy="82" r="9" fill="#db9ba3" />
          <circle cx="76" cy="85" r="8" fill="#e5abb3" />
          <circle cx="85" cy="88" r="7" fill="#e5abb3" />
          <circle cx="88" cy="80" r="8" fill="#db9ba3" />
          <circle cx="82" cy="83" r="3" fill="#fff" />
          <circle cx="58" cy="52" r="5" fill="#db9ba3" />
          <circle cx="50" cy="45" r="3.5" fill="#e5abb3" />
        </svg>
      )
    },
    parchment: {
      cardClass: 'bg-[#f3e9dc] border-4 border-double border-[#b58a63]/50',
      textClass: 'text-[#4e3526]',
      quoteColor: 'text-[#b58a63]/25',
      topLeftDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 4 4 L 45 4 M 4 4 L 4 45" stroke="#b58a63" strokeWidth="1.5" fill="none" />
          <path d="M 8 8 Q 25 25 35 35" stroke="#d4af37" strokeWidth="1.2" fill="none" />
          <circle cx="35" cy="35" r="2.5" fill="#d4af37" />
          <path d="M 12 8 C 12 15, 20 20, 25 12" stroke="#b58a63" strokeWidth="0.8" fill="none" />
          <path d="M 8 12 C 15 12, 20 20, 12 25" stroke="#b58a63" strokeWidth="0.8" fill="none" />
        </svg>
      ),
      bottomRightDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 96 96 L 55 96 M 96 96 L 96 55" stroke="#b58a63" strokeWidth="1.5" fill="none" />
          <path d="M 92 92 Q 75 75 65 65" stroke="#d4af37" strokeWidth="1.2" fill="none" />
          <circle cx="65" cy="65" r="2.5" fill="#d4af37" />
          <path d="M 88 92 C 88 85, 80 80, 75 88" stroke="#b58a63" strokeWidth="0.8" fill="none" />
          <path d="M 92 88 C 85 88, 80 80, 88 75" stroke="#b58a63" strokeWidth="0.8" fill="none" />
        </svg>
      )
    },
    midnight: {
      cardClass: 'bg-gradient-to-br from-[#1b1b2f] to-[#0d0d1a] border-[#3a3a5c] shadow-[0_0_20px_rgba(167,139,250,0.08)]',
      textClass: 'text-[#f5ebd0]',
      quoteColor: 'text-[#a78bfa]/20',
      topLeftDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <line x1="10" y1="10" x2="35" y2="20" stroke="#a78bfa" strokeWidth="0.6" opacity="0.5" />
          <line x1="35" y1="20" x2="45" y2="40" stroke="#a78bfa" strokeWidth="0.6" opacity="0.5" />
          <circle cx="10" cy="10" r="2.5" fill="#fff" />
          <circle cx="35" cy="20" r="1.5" fill="#a78bfa" />
          <circle cx="45" cy="40" r="2" fill="#fff" />
          <path d="M 12 15 L 20 30" stroke="#a78bfa" strokeWidth="0.6" opacity="0.3" fill="none" />
          <polygon points="25,8 26,10 28,10 27,11 27,13 25,12 23,13 24,11 22,10 24,10" fill="#fde047" />
        </svg>
      ),
      bottomRightDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <line x1="90" y1="90" x2="65" y2="80" stroke="#a78bfa" strokeWidth="0.6" opacity="0.5" />
          <line x1="65" y1="80" x2="55" y2="60" stroke="#a78bfa" strokeWidth="0.6" opacity="0.5" />
          <circle cx="90" cy="90" r="2.5" fill="#fff" />
          <circle cx="65" cy="80" r="1.5" fill="#a78bfa" />
          <circle cx="55" cy="60" r="2" fill="#fff" />
          <polygon points="75,92 76,94 78,94 77,95 77,97 75,96 73,97 74,95 72,94 74,94" fill="#fde047" />
        </svg>
      )
    },
    sakura: {
      cardClass: 'bg-[#fff0f3] border-[#ffccd5]',
      textClass: 'text-[#590d22]',
      quoteColor: 'text-[#ffb3c1]/30',
      topLeftDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 0 0 C 15 15, 20 28, 38 32" stroke="#6f4e37" strokeWidth="1" fill="none" />
          <circle cx="15" cy="15" r="4.5" fill="#ffb3c1" />
          <circle cx="18" cy="18" r="3.5" fill="#ff85a1" />
          <circle cx="32" cy="27" r="4" fill="#ffb3c1" />
          <circle cx="12" cy="12" r="2.5" fill="#fff" />
          <circle cx="30" cy="25" r="2" fill="#fff" />
          <path d="M 25 38 C 22 42, 28 45, 28 40 C 28 35, 22 35, 25 38 Z" fill="#ffccd5" opacity="0.9" />
        </svg>
      ),
      bottomRightDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 100 100 C 85 85, 80 72, 62 68" stroke="#6f4e37" strokeWidth="1" fill="none" />
          <circle cx="85" cy="85" r="4.5" fill="#ffb3c1" />
          <circle cx="82" cy="82" r="3.5" fill="#ff85a1" />
          <circle cx="68" cy="73" r="4" fill="#ffb3c1" />
          <circle cx="88" cy="88" r="2.5" fill="#fff" />
          <circle cx="70" cy="75" r="2" fill="#fff" />
          <path d="M 75 62 C 78 58, 72 55, 72 60 C 72 65, 78 65, 75 62 Z" fill="#ffccd5" opacity="0.9" />
        </svg>
      )
    },
    eucalyptus: {
      cardClass: 'bg-[#f4f9f4] border-[#d8e2dc]',
      textClass: 'text-[#2f3e46]',
      quoteColor: 'text-[#9bb591]/20',
      topLeftDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 0 0 C 15 15, 25 25, 30 40" stroke="#7f9c7f" strokeWidth="1" fill="none" />
          <path d="M 8 8 Q 15 2, 20 8 Q 15 15, 8 8 Z" fill="#9bb591" opacity="0.85" />
          <path d="M 18 18 Q 28 15, 28 22 Q 22 28, 18 18 Z" fill="#9bb591" opacity="0.85" />
          <path d="M 24 30 Q 34 32, 30 38 Q 26 38, 24 30 Z" fill="#a4bfa7" opacity="0.8" />
        </svg>
      ),
      bottomRightDeco: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 100 100 C 85 85, 75 75, 70 60" stroke="#7f9c7f" strokeWidth="1" fill="none" />
          <path d="M 92 92 Q 85 98, 80 92 Q 85 85, 92 92 Z" fill="#9bb591" opacity="0.85" />
          <path d="M 82 82 Q 72 85, 72 78 Q 78 72, 82 82 Z" fill="#9bb591" opacity="0.85" />
          <path d="M 76 70 Q 66 68, 70 62 Q 74 62, 76 70 Z" fill="#a4bfa7" opacity="0.8" />
        </svg>
      )
    }
  };

  const currentTheme = themeStyles[cardStyle as keyof typeof themeStyles] || themeStyles.lined;

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-between min-h-[500px] p-6 relative">
      <style>{`
        .lined-paper-story {
          background-color: #faf8f5;
          background-image: linear-gradient(rgba(219, 119, 128, 0.045) 1.5px, transparent 1.5px);
          background-size: 100% 28px;
          background-position: 0 16px;
        }
      `}</style>

      {/* Floating Sound Toggle */}
      <div className="absolute -top-4 right-4 z-10 flex items-center gap-2">
        {!isMuted && (
          <div className="flex gap-0.5 items-end h-3">
            {[0.6, 0.3, 0.8, 0.4].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: ['15%', '100%', '15%'] }}
                transition={{ duration: h + 0.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-0.5 bg-[#c47c85]"
              />
            ))}
          </div>
        )}
        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md border border-[#eedcc5]/50 text-stone-600 transition hover:scale-105 active:scale-95"
          title={isMuted ? 'Turn Sound On' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#c47c85]" />}
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
            className={`w-full p-8 rounded-[32px] border shadow-xl flex flex-col justify-center min-h-[340px] select-none relative overflow-hidden transition-all duration-300 ${currentTheme.cardClass}`}
          >
            {/* Midnight Galaxy Background Stars */}
            {cardStyle === 'midnight' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
                {/* Glowing purple nebulae with pulsing animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.18, 0.1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute top-1/4 left-1/3 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.08, 0.15, 0.08]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2
                  }}
                  className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl"
                />
                
                {/* Shooting stars */}
                {[
                  { top: '10%', left: '80%', delay: 4 },
                  { top: '30%', left: '90%', delay: 8 },
                  { top: '50%', left: '70%', delay: 12 }
                ].map((s, idx) => (
                  <motion.div
                    key={`shooting-${idx}`}
                    className="absolute h-[1.5px] w-12 bg-gradient-to-r from-white via-amber-100 to-transparent pointer-events-none rounded-full"
                    style={{
                      top: s.top,
                      left: s.left,
                      transform: 'rotate(-45deg)',
                      transformOrigin: 'left center',
                    }}
                    animate={{
                      x: [0, -180],
                      y: [0, 180],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      repeatDelay: s.delay,
                      ease: 'easeOut'
                    }}
                  />
                ))}

                {/* Scattered stars */}
                {[
                  { top: '15%', left: '10%', size: 'w-1.5 h-1.5', delay: '0s' },
                  { top: '25%', left: '80%', size: 'w-1 h-1', delay: '1s' },
                  { top: '45%', left: '15%', size: 'w-1 h-1', delay: '1.5s' },
                  { top: '35%', left: '85%', size: 'w-2 h-2 bg-amber-200', delay: '0.5s', sparkle: true },
                  { top: '70%', left: '12%', size: 'w-1 h-1', delay: '2s' },
                  { top: '80%', left: '75%', size: 'w-1.5 h-1.5', delay: '0.8s' },
                  { top: '60%', left: '88%', size: 'w-1 h-1', delay: '1.2s' },
                  { top: '85%', left: '25%', size: 'w-2 h-2 bg-amber-200', delay: '2.4s', sparkle: true },
                  { top: '50%', left: '50%', size: 'w-1 h-1', delay: '0.3s' },
                  { top: '10%', left: '60%', size: 'w-1 h-1', delay: '1.7s' },
                ].map((star, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: star.top,
                      left: star.left,
                      animationDelay: star.delay
                    }}
                    className={`rounded-full bg-white animate-pulse ${star.size} ${
                      star.sparkle ? 'shadow-[0_0_8px_#fde047]' : 'opacity-60'
                    }`}
                  />
                ))}
              </div>
            )}
            {/* Top-Left Floral Deco */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none select-none z-0">
              {currentTheme.topLeftDeco}
            </div>

            {/* Bottom-Right Floral Deco */}
            <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none select-none z-0">
              {currentTheme.bottomRightDeco}
            </div>

            {currentItem.type === 'text' && (
              <div className="relative flex flex-col justify-center items-center py-6 px-2 w-full min-h-[200px]">
                {/* Large decorative quotation marks */}
                <span className={`absolute top-0 left-0 font-serif text-5xl select-none ${currentTheme.quoteColor}`}>“</span>
                <span className={`absolute bottom-0 right-0 font-serif text-5xl select-none ${currentTheme.quoteColor}`}>”</span>
                
                <p className={`font-garamond italic text-[21px] leading-[30px] text-center font-bold z-10 px-4 ${currentTheme.textClass}`}>
                  {currentItem.body}
                </p>
              </div>
            )}

            {currentItem.type === 'image' && (
              <div className="flex flex-col items-center w-full z-10 gap-3">
                {/* Image Container directly on card */}
                <div 
                  className="w-full max-w-[240px] aspect-square overflow-hidden rounded-2xl border border-[#eedcc5]/60 shadow-sm bg-stone-50 cursor-zoom-in active:scale-98 transition-transform"
                  onClick={() => {
                    if (currentItem.url) {
                      setLightboxItem({ url: currentItem.url, caption: currentItem.caption });
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentItem.url}
                    alt={currentItem.caption || 'Memory'}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                {/* Caption directly on the card background */}
                {currentItem.caption && (
                  <p className={`text-center font-garamond italic text-[18px] font-bold px-2 leading-relaxed ${currentTheme.textClass}`}>
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

        <span className="text-xs font-semibold uppercase tracking-widest text-[#a48c82]">
          {currentIndex + 1} / {content.length}
        </span>

        <button
          onClick={handleNext}
          className={`flex items-center justify-center gap-1 transition-all ${
            currentIndex === content.length - 1
              ? 'px-5 py-3 rounded-full bg-[#9c6644] text-[#faf8f5] font-medium shadow-md shadow-amber-900/10 hover:bg-[#855333] hover:scale-105 active:scale-95 text-sm'
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

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4 cursor-zoom-out select-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition cursor-pointer z-50"
              title="Tutup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="max-w-md w-full flex flex-col items-center gap-4 p-2"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image container itself
            >
              <div className="w-full aspect-square overflow-hidden rounded-[24px] border border-white/10 bg-black/20 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.caption || 'Memory Detail'}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
              {lightboxItem.caption && (
                <p className="text-white text-center font-garamond italic text-[20px] font-semibold px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-relaxed">
                  {lightboxItem.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
