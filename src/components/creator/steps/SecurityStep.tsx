'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { GiftData } from '@/data/mockGifts';

interface SecurityStepProps {
  giftData: GiftData;
  updateSecurity: (field: string, value: string) => void;
}

export default function SecurityStep({ giftData, updateSecurity }: SecurityStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Lock className="w-5 h-5 text-rose-500" /> 2. Kunci Keamanan
        </h2>
        <p className="text-stone-500 text-sm">Lindungi kado Anda agar hanya bisa dibuka oleh orang spesial.</p>
      </div>

      {/* Gate Type */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'pin', name: 'Kode PIN (Angka)' },
          { id: 'question', name: 'Pertanyaan Rahasia' },
          { id: 'none', name: 'Tanpa Kunci (Langsung)' }
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => updateSecurity('gateType', type.id)}
            className={`p-3.5 rounded-2xl border text-center text-xs transition-all ${
              giftData.security.gateType === type.id
                ? 'border-rose-400 bg-rose-50/50 text-rose-700 font-semibold shadow-sm'
                : 'border-stone-200 bg-white hover:bg-stone-50'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Security Fields */}
      {giftData.security.gateType !== 'none' && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
          {giftData.security.gateType === 'question' && (
            <div>
              <label className="text-xs font-semibold text-stone-600 block mb-1">
                Teks Pertanyaan (yang akan dilihat penerima):
              </label>
              <input
                type="text"
                value={giftData.security.question || ''}
                onChange={(e) => updateSecurity('question', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-rose-200 focus:border-rose-400 focus:outline-none text-sm"
                placeholder="e.g. Apa nama restoran pertama kita?"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              {giftData.security.gateType === 'pin' ? 'Masukkan PIN Keamanan (Angka/Huruf):' : 'Jawaban Rahasia (Sensitif Huruf Kapital):'}
            </label>
            <input
              type="text"
              value={giftData.security.passcode || ''}
              onChange={(e) => updateSecurity('passcode', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-rose-200 focus:border-rose-400 focus:outline-none text-sm"
              placeholder={giftData.security.gateType === 'pin' ? 'e.g. 1206' : 'e.g. Mocca'}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              Petunjuk Kunci (Hint):
            </label>
            <input
              type="text"
              value={giftData.security.hint || ''}
              onChange={(e) => updateSecurity('hint', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-rose-200 focus:border-rose-400 focus:outline-none text-sm"
              placeholder={giftData.security.gateType === 'pin' ? 'e.g. Tanggal jadian kita' : 'e.g. Rasa es krim kesukaanmu'}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
