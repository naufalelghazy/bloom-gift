'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { GiftData } from '@/data/mockGifts';
import GiftViewer from '../GiftViewer';

interface PhonePreviewProps {
  giftData: GiftData;
  previewKey: number;
  currentStep: number;
  restartPreview: () => void;
  setIsFullscreenPreview: (v: boolean) => void;
}

export default function PhonePreview({
  giftData,
  previewKey,
  currentStep,
  restartPreview,
  setIsFullscreenPreview
}: PhonePreviewProps) {
  return (
    <div className="hidden md:flex md:w-[40%] bg-stone-100 border-l border-stone-200 flex-col items-center justify-center p-6 py-12 md:py-6 relative min-h-[600px] md:min-h-screen">

      {/* Floating instruction / reload */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-200/50 px-2.5 py-1 rounded-full select-none">
            Live Preview
          </span>
          <button
            onClick={restartPreview}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
            title="Muat Ulang Pratinjau"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={() => setIsFullscreenPreview(true)}
          className="text-[10px] font-bold text-[#c47c85] hover:text-[#b56f77] uppercase tracking-wider bg-rose-50 hover:bg-rose-100/70 border border-rose-200/60 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
        >
          🔍 Uji Layar Penuh
        </button>
      </div>

      {/* The Mobile Phone Frame Mockup */}
      <div className="relative w-[310px] h-[610px] rounded-[48px] bg-stone-900 shadow-2xl border-[10px] border-stone-800 flex items-center justify-center overflow-hidden">
        {/* Speaker bar */}
        <div className="absolute top-3 w-32 h-4 bg-stone-800 rounded-full z-20 flex items-center justify-center">
          <div className="w-12 h-1 bg-stone-900 rounded-full" />
        </div>

        {/* Screen area inside phone */}
        <div className="w-full h-full bg-white relative overflow-hidden rounded-[36px]">
          <GiftViewer
            key={`${previewKey}-${currentStep}-${giftData.theme.flowerStyle}-${giftData.theme.palette}`}
            giftData={giftData}
            isPreview={true}
            activeStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
}
