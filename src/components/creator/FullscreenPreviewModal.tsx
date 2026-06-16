'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftData } from '@/data/mockGifts';
import GiftViewer from '../GiftViewer';

interface FullscreenPreviewModalProps {
  show: boolean;
  onClose: () => void;
  giftData: GiftData;
  previewKey: number;
  activeStep: number;
}

export default function FullscreenPreviewModal({ show, onClose, giftData, previewKey, activeStep }: FullscreenPreviewModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-[340px] aspect-[9/18] max-h-[94vh] bg-stone-900 rounded-[48px] border-[10px] border-stone-800 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close Button overlay */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-40 p-2.5 bg-black/60 hover:bg-black/80 border border-white/10 text-white rounded-full transition shadow-md focus:outline-none cursor-pointer"
              title="Tutup Pratinjau"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
              <GiftViewer
                key={`fullscreen-${previewKey}-${activeStep}-${giftData.theme.flowerStyle}-${giftData.theme.palette}`}
                giftData={giftData}
                isPreview={true}
                activeStep={activeStep}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
