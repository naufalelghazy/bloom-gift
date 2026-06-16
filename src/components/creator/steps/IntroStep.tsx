'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GiftData } from '@/data/mockGifts';

interface IntroStepProps {
  giftData: GiftData;
  updateIntro: (field: string, value: string) => void;
}

export default function IntroStep({ giftData, updateIntro }: IntroStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" /> 3. Layar Intro Pembuka
        </h2>
        <p className="text-stone-500 text-sm">Tulis judul kejutan saat bunga mekar selesai diputar.</p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
        <div>
          <label className="text-xs font-semibold text-stone-600 block mb-1">Judul Utama:</label>
          <input
            type="text"
            value={giftData.intro.title}
            onChange={(e) => updateIntro('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-rose-200 focus:border-rose-400 focus:outline-none text-sm font-medium"
            placeholder="e.g. Selamat Ulang Tahun Sayang!"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone-600 block mb-1">Sub-judul / Kalimat Pengantar:</label>
          <textarea
            value={giftData.intro.subtitle}
            onChange={(e) => updateIntro('subtitle', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-rose-200 focus:border-rose-400 focus:outline-none text-sm"
            placeholder="e.g. Kado kecil ini mekar khusus untukmu hari ini."
          />
        </div>
      </div>
    </motion.div>
  );
}
