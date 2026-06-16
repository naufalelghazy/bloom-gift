'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { GiftData } from '@/data/mockGifts';
import { BOUQUETS } from '../constants';

interface BouquetStepProps {
  giftData: GiftData;
  updateFinale: (field: string, value: string) => void;
}

export default function BouquetStep({ giftData, updateFinale }: BouquetStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🌸 5. Pilih Bouquet Akhir
        </h2>
        <p className="text-stone-500 text-sm">Pilih buket bunga yang akan muncul di tampilan akhir kado sebagai penutup.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {BOUQUETS.map((bouquet) => {
          const isSelected = giftData.finale.bouquetType === bouquet.id;
          return (
            <button
              key={bouquet.id}
              onClick={() => updateFinale('bouquetType', bouquet.id)}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                isSelected
                  ? 'border-rose-400 bg-rose-50/60 shadow-md shadow-rose-100 ring-2 ring-rose-200'
                  : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
              }`}
            >
              <div className="text-3xl">{bouquet.emoji}</div>
              <div>
                <p className={`text-sm font-bold ${ isSelected ? 'text-rose-700' : 'text-stone-700' }`}>
                  {bouquet.name}
                </p>
                <p className="text-[11px] text-stone-400 leading-snug mt-0.5">{bouquet.meaning}</p>
              </div>
              {isSelected && (
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">✓ Dipilih</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Finale message */}
      <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2 mt-2">
        <label className="text-xs font-bold text-rose-700 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Kalimat Penutup:
        </label>
        <input
          type="text"
          value={giftData.finale.message}
          onChange={(e) => updateFinale('message', e.target.value)}
          className="w-full px-4 py-2 border border-rose-200 rounded-xl focus:ring-rose-300 focus:border-rose-400 focus:outline-none text-sm bg-white"
          placeholder="e.g. I love you, Nara."
        />
      </div>
    </motion.div>
  );
}
