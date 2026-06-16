'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Link2, Eye, Calendar } from 'lucide-react';
import { GiftData } from '@/data/mockGifts';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

interface PublishStepProps {
  giftData: GiftData;
  saveLocation: 'cloud' | 'local' | null;
  setIsPublished: (v: boolean) => void;
  setCurrentStep: (v: number) => void;
}

export default function PublishStep({ giftData, saveLocation, setIsPublished, setCurrentStep }: PublishStepProps) {
  const [status, setStatus] = useState<{ viewCount: number; openedAt: string | null }>({
    viewCount: 0,
    openedAt: null
  });

  useEffect(() => {
    let intervalId: any;
    
    async function checkStatus() {
      // 1. Check Supabase if configured and saved to cloud
      if (isSupabaseConfigured && saveLocation === 'cloud') {
        try {
          const { data, error } = await supabase
            .from('gifts')
            .select('view_count, opened_at')
            .eq('slug', giftData.slug)
            .single();
            
          if (data && !error) {
            setStatus({
              viewCount: data.view_count || 0,
              openedAt: data.opened_at || null
            });
            return;
          }
        } catch (err) {
          console.error('Failed to fetch gift status from Supabase:', err);
        }
      }
      
      // 2. Local fallback
      try {
        const localGiftsRaw = localStorage.getItem('bloom_gifts');
        if (localGiftsRaw) {
          const localGifts = JSON.parse(localGiftsRaw);
          if (localGifts[giftData.slug]) {
            setStatus({
              viewCount: localGifts[giftData.slug].view_count || 0,
              openedAt: localGifts[giftData.slug].opened_at || null
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse local gifts status:', e);
      }
    }
    
    checkStatus();
    intervalId = setInterval(checkStatus, 5000);
    
    return () => clearInterval(intervalId);
  }, [giftData.slug, saveLocation]);

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
        <Image
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            typeof window !== 'undefined' ? `${window.location.origin}/g/${giftData.slug}` : `https://bloom-gift/g/${giftData.slug}`
          )}`}
          alt="QR Code Kado"
          width={128}
          height={128}
          className="w-32 h-32 object-contain select-none"
          draggable={false}
          unoptimized
        />
        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider select-none">Pindai untuk Membuka 📱</span>
      </div>

      {/* Real-time Tracking Status Card */}
      <div className="bg-rose-50/50 border border-rose-100/60 p-4 rounded-2xl max-w-md mx-auto flex flex-col items-center gap-2 shadow-xs">
        <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Status Pembukaan Kado</span>
        {status.openedAt ? (
          <div className="flex flex-col items-center gap-1 select-none">
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Sudah Dibuka ✓
            </span>
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <Calendar className="w-3 h-3 text-stone-400" />
              <span>Pertama dibuka: {new Date(status.openedAt).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <Eye className="w-3 h-3 text-stone-400" />
              <span>Total kunjungan: {status.viewCount} kali</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 select-none">
            <span className="text-sm font-bold text-stone-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-300 animate-ping" />
              Menunggu dibuka...
            </span>
            <p className="text-[10px] text-stone-400 leading-relaxed text-center px-4">
              Kirimkan tautan unik di atas ke pasanganmu. Status ini akan diperbarui secara otomatis begitu kado dibuka!
            </p>
          </div>
        )}
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
