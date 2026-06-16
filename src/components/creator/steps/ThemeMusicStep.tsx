'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music, Upload, Loader2 } from 'lucide-react';
import { GiftData } from '@/data/mockGifts';
import { PALETTES, ANIMATIONS, PRESET_SONGS } from '../constants';

interface ThemeMusicStepProps {
  giftData: GiftData;
  setGiftData: React.Dispatch<React.SetStateAction<GiftData>>;
  updateTheme: (field: string, value: any) => void;
  updateCustomColor: (key: 'from' | 'via' | 'to', hue: number) => void;
  handleMusicUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMusicUploading: boolean;
  uploadedMusicName: string;
}

export default function ThemeMusicStep({
  giftData,
  setGiftData,
  updateTheme,
  updateCustomColor,
  handleMusicUpload,
  isMusicUploading,
  uploadedMusicName
}: ThemeMusicStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" /> 1. Tentukan Tema & Musik
        </h2>
        <p className="text-stone-500 text-sm">Pilih palette warna kado dan lagu pengiring.</p>
      </div>

      {/* Palette Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-600">Palette Warna:</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => updateTheme('palette', p.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                giftData.theme.palette === p.id
                  ? 'border-rose-400 ring-2 ring-rose-200 font-semibold bg-white'
                  : 'border-stone-200 bg-white/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${p.bg} mx-auto mb-2 border border-white shadow-sm`} />
              <span className="text-xs text-stone-700">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Color Palette Customizer inputs */}
        {giftData.theme.palette === 'custom' && (
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-4 mt-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
              Sesuaikan Warna Palet Kustom
            </span>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setGiftData((prev) => ({
                  ...prev,
                  theme: {
                    ...prev.theme,
                    customColors: { from: '#ffffff', via: '#ffffff', to: '#ffffff' }
                  }
                }))}
                className="w-8 h-8 rounded border border-gray-300 bg-white hover:scale-105 transition-transform"
                title="White"
              />
              <button
                type="button"
                onClick={() => setGiftData((prev) => ({
                  ...prev,
                  theme: {
                    ...prev.theme,
                    customColors: { from: '#000000', via: '#000000', to: '#000000' }
                  }
                }))}
                className="w-8 h-8 rounded border border-gray-300 bg-black hover:scale-105 transition-transform"
                title="Black"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-stone-500 block mb-1">Mulai (Awal)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={(() => { const match = /hsl\((\d+),/.exec(giftData.theme.customColors?.from || 'hsl(0,70%,60%)'); return match ? Number(match[1]) : 0; })()}
                    onChange={(e) => updateCustomColor('from', Number(e.target.value))}
                    className="w-full"
                  />
                  <div
                    style={{ backgroundColor: giftData.theme.customColors?.from || '#ffe4e6', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ccc' }}
                  ></div>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-stone-500 block mb-1">Tengah (Transisi)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={(() => { const match = /hsl\((\d+),/.exec(giftData.theme.customColors?.via || 'hsl(120,70%,60%)'); return match ? Number(match[1]) : 120; })()}
                    onChange={(e) => updateCustomColor('via', Number(e.target.value))}
                    className="w-full"
                  />
                  <div
                    style={{ backgroundColor: giftData.theme.customColors?.via || '#fbcfe8', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ccc' }}
                  ></div>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-stone-500 block mb-1">Akhir (Selesai)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={(() => { const match = /hsl\((\d+),/.exec(giftData.theme.customColors?.to || 'hsl(240,70%,60%)'); return match ? Number(match[1]) : 240; })()}
                    onChange={(e) => updateCustomColor('to', Number(e.target.value))}
                    className="w-full"
                  />
                  <div
                    style={{ backgroundColor: giftData.theme.customColors?.to || '#f472b6', width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ccc' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Selection */}
      <div className="space-y-3 pt-2">
        <label className="text-sm font-semibold text-stone-600">Gaya Animasi Pembuka:</label>
        <div className="grid grid-cols-3 gap-3">
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.id}
              onClick={() => updateTheme('flowerStyle', anim.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                giftData.theme.flowerStyle === anim.id
                  ? 'border-rose-400 ring-2 ring-rose-200 font-semibold bg-white'
                  : 'border-stone-200 bg-white/50 hover:bg-white hover:border-stone-300'
              }`}
            >
              <div className="text-2xl mb-1">{anim.icon}</div>
              <span className="text-xs text-stone-700 block font-semibold">{anim.name}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5 leading-tight">{anim.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Music Selection */}
      <div className="space-y-3 pt-2">
        <label className="text-sm font-semibold text-stone-600 flex items-center gap-1.5">
          <Music className="w-4 h-4 text-stone-400" /> Pilih Musik Latar:
        </label>
        <div className="space-y-2">
          {PRESET_SONGS.map((song) => (
            <button
              key={song.name}
              onClick={() => setGiftData(prev => ({ ...prev, musicUrl: song.url }))}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                giftData.musicUrl === song.url
                  ? 'border-rose-400 bg-rose-50/50 text-rose-700 font-semibold'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <span className="text-sm">{song.name}</span>
              {giftData.musicUrl === song.url && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />}
            </button>
          ))}
        </div>


        {/* Custom local MP3 uploader */}
        <div className="pt-2 border-t border-stone-100 mt-2">
          <label className="text-xs font-semibold text-stone-500 block mb-1.5">
            Atau Unggah File MP3 Dari Perangkat Anda:
          </label>
          <div className="relative">
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              onChange={handleMusicUpload}
              disabled={isMusicUploading}
              className="hidden"
              id="music-upload-input"
            />
            <label
              htmlFor="music-upload-input"
              className={`w-full p-4 rounded-2xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-stone-50 ${
                isMusicUploading
                  ? 'border-stone-200 bg-stone-50 cursor-not-allowed'
                  : 'border-stone-300 hover:border-rose-400'
              }`}
            >
              {isMusicUploading ? (
                <div className="flex items-center gap-2 text-stone-500 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  <span>Sedang mengunggah audio...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-stone-600 text-xs">
                  <Upload className="w-5 h-5 text-stone-400 mb-0.5" />
                  <span className="font-semibold text-stone-700">Pilih file audio (.mp3)</span>
                  <span className="text-[10px] text-stone-400">Maksimal ukuran file 10MB</span>
                </div>
              )}
            </label>
          </div>
          {uploadedMusicName && (
            <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5 bg-rose-50/50 p-2 rounded-xl border border-rose-100">
              <span className="text-stone-500 font-normal">File aktif:</span> {uploadedMusicName}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
