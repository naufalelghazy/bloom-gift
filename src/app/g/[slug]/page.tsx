'use client';

import { useEffect, useState, use } from 'react';
import { mockGifts, GiftData } from '@/data/mockGifts';
import GiftViewer from '@/components/GiftViewer';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { HeartOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GiftPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGift() {
      setIsLoading(true);

      // 1. Coba ambil dari Database Supabase (Hanya jika terkonfigurasi)
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('gifts')
            .select('*')
            .eq('slug', slug)
            .single();

          if (data && !error) {
            setGiftData(data as GiftData);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error('Supabase fetch failed, falling back to local storage:', err);
        }
      }

      // 2. Fallback: Coba ambil dari localStorage browser
      const localGiftsRaw = localStorage.getItem('bloom_gifts');
      if (localGiftsRaw) {
        try {
          const localGifts = JSON.parse(localGiftsRaw) as Record<string, GiftData>;
          if (localGifts[slug]) {
            setGiftData(localGifts[slug]);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing local gifts:', e);
        }
      }

      // 3. Fallback terakhir: Coba ambil dari mockGifts.ts
      if (mockGifts[slug]) {
        setGiftData(mockGifts[slug]);
      }
      
      setIsLoading(false);
    }

    loadGift();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-rose-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
      </div>
    );
  }

  if (!giftData) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-tr from-rose-50 via-stone-50 to-rose-100/30 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/20 shadow-xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shadow-inner">
            <HeartOff className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-stone-800">Kado Tidak Ditemukan 😔</h2>
            <p className="text-stone-500 text-sm">
              Link kado digital ini mungkin salah atau masa aktifnya telah habis.
            </p>
          </div>
          <Link
            href="/"
            className="block w-full py-3 rounded-2xl bg-stone-800 hover:bg-stone-900 text-white font-medium shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return <GiftViewer giftData={giftData} />;
}
