'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Link2 } from 'lucide-react';
import { GiftData } from '@/data/mockGifts';

interface PublishStepProps {
  giftData: GiftData;
  saveLocation: 'cloud' | 'local' | null;
  setIsPublished: (v: boolean) => void;
  setCurrentStep: (v: number) => void;
}

export default function PublishStep({ giftData, saveLocation, setIsPublished, setCurrentStep }: PublishStepProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-serif">Kado Digital Berhasil Dibuat! 🎉</h2>
        {saveLocation === 'cloud' ? (
          <p className="text-emerald-600 text-sm font-medium">Kado telah disimpan secara publik di database cloud Supabase.</p>
        ) : (
          <div className="space-y-1">
            <p className="text-amber-600 text-sm font-medium">Supabase belum terkonfigurasi di server.</p>
            <p className="text-stone-500 text-xs">Kado disimpan secara lokal di browser Anda (masih bisa diuji di komputer ini).</p>
          </div>
        )}
      </div>

      {/* Dynamic URL Block */}
      <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200/50 text-center max-w-md mx-auto space-y-2">
        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Tautan Unik Kado Anda</span>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-stone-200">
          <Link2 className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <span className="text-xs font-mono font-semibold text-rose-600 truncate">
            {typeof window !== 'undefined' ? `${window.location.origin}/g/${giftData.slug}` : `/g/${giftData.slug}`}
          </span>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="bg-white p-4 rounded-[24px] border border-stone-200 max-w-[190px] mx-auto shadow-xs flex flex-col items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            typeof window !== 'undefined' ? `${window.location.origin}/g/${giftData.slug}` : `https://bloom-gift/g/${giftData.slug}`
          )}`}
          alt="QR Code Kado"
          className="w-32 h-32 object-contain select-none"
          draggable={false}
        />
        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider select-none">Pindai untuk Membuka 📱</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
        <a
          href={`/g/${giftData.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-2xl shadow-md shadow-rose-200 transition text-center text-sm"
        >
          Buka Kado Baru 🎁
        </a>
        <button
          onClick={() => {
            setIsPublished(false);
            setCurrentStep(1);
          }}
          className="flex-1 py-3 border border-stone-200 hover:border-stone-300 bg-white text-stone-600 font-medium rounded-2xl transition text-sm"
        >
          Buat Kado Lain
        </button>
      </div>
    </motion.div>
  );
}
