'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GiftData } from '@/data/mockGifts';
import LockedStage from './stages/LockedStage';
import IntroStage from './stages/IntroStage';
import StoryStage from './stages/StoryStage';
import FinaleStage from './stages/FinaleStage';
import ConfessionStage from './stages/ConfessionStage';

interface GiftViewerProps {
  giftData: GiftData;
  isPreview?: boolean;
  activeStep?: number;
}

type Stage = 'LOCKED' | 'INTRO' | 'STORY' | 'FINALE';

export default function GiftViewer({ giftData, isPreview = false, activeStep = 1 }: GiftViewerProps) {
  const getInitialStage = () => {
    if (!isPreview) {
      return giftData.security.gateType === 'none' ? 'INTRO' : 'LOCKED';
    }
    switch (activeStep) {
      case 1:
      case 3:
        return 'INTRO';
      case 2:
        return giftData.security.gateType === 'none' ? 'INTRO' : 'LOCKED';
      case 4:
        return 'STORY';
      case 5:
        return 'FINALE';
      default:
        return 'INTRO';
    }
  };

  const [stage, setStage] = useState<Stage>(getInitialStage());
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const backgroundGradients: Record<string, string> = {
    pink: 'from-rose-50 via-rose-100/40 to-pink-100/60',
    red: 'from-red-50 via-rose-100/30 to-red-100/50',
    blue: 'from-sky-50 via-indigo-50/40 to-blue-100/50',
    yellow: 'from-amber-50 via-orange-50/40 to-yellow-100/50',
    white: 'from-stone-50 via-stone-100/30 to-stone-200/40',
    mixed: 'from-pink-50 via-indigo-50/30 to-amber-50/50'
  };

  const isCustom = giftData.theme.palette === 'custom' && giftData.theme.customColors;
  const gradientClass = !isCustom ? backgroundGradients[giftData.theme.palette] || backgroundGradients.pink : '';
  const customStyle = isCustom ? {
    background: `linear-gradient(to top right, ${giftData.theme.customColors?.from}, ${giftData.theme.customColors?.via || ''}, ${giftData.theme.customColors?.to})`
  } : {};

  const containerClassName = `${isPreview ? 'h-full' : 'min-h-screen'} w-full flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans ${!isCustom ? `bg-gradient-to-tr ${gradientClass}` : ''}`;


  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log('Autoplay blocked or audio load error:', err);
      });
    }
  };

  const handleUnlock = () => {
    setStage('INTRO');
    playMusic();
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  useEffect(() => {
    if (giftData.security.gateType === 'none' && stage === 'INTRO') {
      const handleFirstClick = () => {
        playMusic();
        document.removeEventListener('click', handleFirstClick);
      };
      document.addEventListener('click', handleFirstClick);
      return () => document.removeEventListener('click', handleFirstClick);
    }
  }, [giftData.security.gateType, stage]);

  return (
    <div className={containerClassName} style={customStyle}>
      <audio
        ref={audioRef}
        src={giftData.musicUrl}
        loop
        preload="auto"
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
        <div className="absolute top-10 left-10 w-4 h-4 bg-rose-300 rounded-full blur-sm animate-pulse" />
        <div className="absolute bottom-20 right-10 w-6 h-6 bg-pink-200 rounded-full blur-sm animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-rose-200 rounded-full blur-xs animate-bounce delay-500" />
      </div>

      <AnimatePresence mode="wait">
        {stage === 'LOCKED' && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center z-10"
          >
            <LockedStage security={giftData.security} onUnlock={handleUnlock} />
          </motion.div>
        )}

        {stage === 'INTRO' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center z-10"
          >
            <IntroStage 
              intro={giftData.intro} 
              flowerStyle={giftData.theme.flowerStyle} 
              onComplete={() => setStage('STORY')} 
            />
          </motion.div>
        )}

        {stage === 'STORY' && (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full flex justify-center z-10"
          >
            {giftData.templateId === 'confession' ? (
              <ConfessionStage
                confession={giftData.confession}
                senderName={giftData.confession?.senderName}
                recipientName={giftData.confession?.recipientName}
                onComplete={() => setStage('FINALE')}
              />
            ) : (
              <StoryStage
                content={giftData.content}
                musicUrl={giftData.musicUrl}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onComplete={() => setStage('FINALE')}
              />
            )}
          </motion.div>
        )}

        {stage === 'FINALE' && (
          <motion.div
            key="finale"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full flex justify-center z-10"
          >
            <FinaleStage
              message={giftData.finale.message}
              bouquetType={giftData.finale.bouquetType}
              onRestart={() => {
                setStage(giftData.security.gateType === 'none' ? 'INTRO' : 'LOCKED');
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.pause();
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
