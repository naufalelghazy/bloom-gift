'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RestoreDraftModalProps {
  show: boolean;
  onRestore: () => void;
  onDiscard: () => void;
}

export default function RestoreDraftModal({ show, onRestore, onDiscard }: RestoreDraftModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#faf8f5] border border-[#eedcc5] rounded-[32px] p-8 max-w-sm w-full shadow-2xl text-center space-y-6"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-inner text-2xl">
              💾
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900 font-serif">Pulihkan Pekerjaan?</h3>
              <p className="text-stone-500 text-xs leading-relaxed">
                Kami menemukan draf kado yang belum selesai dari sesi sebelumnya. Apakah Anda ingin memulihkannya?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={onDiscard}
                className="flex-1 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 text-xs font-semibold rounded-2xl transition active:scale-[0.98]"
              >
                Mulai Baru
              </button>
              <button
                onClick={onRestore}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-2xl shadow-md shadow-rose-200 transition active:scale-[0.98]"
              >
                Pulihkan Draf
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
