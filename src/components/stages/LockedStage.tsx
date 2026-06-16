'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GiftSecurity } from '@/data/mockGifts';

interface LockedStageProps {
  security: GiftSecurity;
  onUnlock: () => void;
}

export default function LockedStage({ security, onUnlock }: LockedStageProps) {
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);

  const isQuestion = security.gateType === 'question';
  const pinLength = security.passcode?.length || 4;

  const handleKeyPress = (num: string) => {
    if (isError) return;

    if (num === 'backspace') {
      setCode(prev => prev.slice(0, -1));
      return;
    }
    if (num === '') return;

    if (code.length < pinLength) {
      const newCode = code + num;
      setCode(newCode);

      if (newCode.length === pinLength) {
        // Check password
        if (newCode === security.passcode) {
          setTimeout(() => {
            onUnlock();
          }, 300);
        } else {
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
            setCode('');
          }, 600);
        }
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isError) return;

    if (code.trim().toLowerCase() === security.passcode?.trim().toLowerCase()) {
      onUnlock();
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setCode('');
      }, 800);
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#f5ebe0] via-[#f0e3d4] to-[#e6d5c3] flex items-center justify-center p-4 z-20 overflow-hidden">



      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
        <div className="absolute top-10 left-10 w-24 h-24 bg-rose-200/50 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-100/60 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`w-full max-w-[340px] bg-[#faf8f5] border border-[#eedcc5] rounded-[32px] shadow-xl p-6 relative flex flex-col items-center pt-24 pb-8 transition-all duration-300 ${
          isQuestion ? 'min-h-[360px] justify-center' : 'min-h-[480px] justify-between'
        }`}
      >
        {/* Lock header illustration */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-[140px] h-[140px] pointer-events-none select-none z-30 drop-shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lock_header.png?v=2" alt="Lock" className="w-full h-full object-contain" />
        </div>

        <motion.div
          animate={isError ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`flex flex-col items-center w-full h-full ${
            isQuestion ? 'justify-center gap-5' : 'flex-1 justify-between gap-4'
          }`}
        >
          {/* Title / Question / Hint message */}
          <div className="text-center space-y-1.5 select-none z-10 w-full px-2">
            <h3 className="font-garamond italic text-[22px] leading-snug text-[#7c5e49] tracking-wide font-medium">
              {isQuestion ? 'ada pertanyaan untukmu 💌' : (security.hint || 'hayolo, apa yaa kode nyaa')}
            </h3>
            {isQuestion && security.question && (
              <p className="font-sans text-sm text-[#9c6644] font-medium leading-relaxed bg-[#eedcc5]/20 border border-[#eedcc5]/40 rounded-xl px-4 py-2 mt-2">
                {security.question}
              </p>
            )}
          </div>

          {/* Form for Secret Question */}
          {isQuestion ? (
            <form onSubmit={handleFormSubmit} className="w-full flex flex-col items-center gap-4.5 z-10 mt-1">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Tulis jawabanmu di sini..."
                className={`w-full max-w-[270px] px-4 py-3 rounded-2xl border-2 text-center font-sans text-[#7c5e49] focus:outline-none focus:ring-2 focus:ring-[#c47c85]/20 focus:border-[#c47c85] transition-all bg-[#faf8f5] shadow-sm ${
                  isError ? 'border-red-400 bg-red-50/20' : 'border-[#eedcc5]/60'
                }`}
              />
              {isError && (
                <p className="text-red-500 text-[11px] font-sans -mt-2">
                  Jawaban kurang tepat, coba lagi ya 🥺
                </p>
              )}
              <button
                type="submit"
                className="w-full max-w-[270px] py-3 rounded-2xl bg-[#9c6644] hover:bg-[#855333] text-[#faf8f5] font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-900/10 mt-1"
              >
                Buka Kado 💌
              </button>
            </form>
          ) : (
            /* Passcode Input Display & Keypad */
            <div className="w-full flex flex-col items-center gap-6">
              {/* Dots */}
              <div className="flex justify-center gap-4 z-10">
                {Array.from({ length: pinLength }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 border-[#d9c5b2] transition-all duration-150 ${
                      i < code.length ? 'bg-[#9c6644] border-[#9c6644] scale-110 shadow-sm' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>

              {isError && (
                <p className="text-red-500 text-[11px] font-sans -mt-3 animate-pulse">
                  Kode salah, coba lagi!
                </p>
              )}

              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-x-5 gap-y-3.5 w-full max-w-[270px] z-10">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'].map((keyVal, idx) => {
                  if (keyVal === '') {
                    return <div key={idx} className="w-full aspect-[1.45/1]" />;
                  }

                  if (keyVal === 'backspace') {
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleKeyPress('backspace')}
                        className="w-full aspect-[1.45/1] rounded-2xl border border-[#eedcc5]/60 bg-[#FAF8F5]/60 flex items-center justify-center text-[#7c5e49] hover:bg-[#eedcc5]/20 active:scale-95 transition-all shadow-xs"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                        </svg>
                      </button>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleKeyPress(keyVal)}
                      className="w-full aspect-[1.45/1] rounded-2xl border border-[#eedcc5]/60 bg-[#FAF8F5]/60 flex items-center justify-center text-lg font-sans font-medium text-[#7c5e49] hover:bg-[#eedcc5]/20 active:scale-95 transition-all shadow-xs"
                    >
                      {keyVal}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
