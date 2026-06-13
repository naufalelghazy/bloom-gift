'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { GiftSecurity } from '@/data/mockGifts';

interface LockedStageProps {
  security: GiftSecurity;
  onUnlock: () => void;
}

export default function LockedStage({ security, onUnlock }: LockedStageProps) {
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === security.passcode) {
      onUnlock();
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
      setCode('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/20 shadow-xl text-center space-y-6"
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Kado Terkunci 🔐</h2>
        <p className="text-stone-500 text-sm">Surat ini dilindungi oleh kunci keamanan privat.</p>
      </div>

      {security.hint && (
        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-rose-700 text-sm italic">
          <strong>Petunjuk:</strong> {security.hint}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <input
            type="password"
            maxLength={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Masukkan kode rahasia..."
            className={`w-full px-4 py-3 rounded-2xl border text-center text-lg tracking-wider font-semibold focus:outline-none focus:ring-2 transition ${
              isError
                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                : 'border-stone-200 focus:ring-rose-300 focus:border-rose-400 bg-white/90'
            }`}
          />
        </motion.div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Buka Kado
        </button>
      </form>
    </motion.div>
  );
}
