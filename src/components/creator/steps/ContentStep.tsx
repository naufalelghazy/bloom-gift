'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { GiftData, GiftContent } from '@/data/mockGifts';
import { CARD_THEMES } from '../constants';
import Image from 'next/image';

interface ContentStepProps {
  giftData: GiftData;
  setGiftData: React.Dispatch<React.SetStateAction<GiftData>>;
  updateTheme: (field: string, value: any) => void;
  handleContentChange: (index: number, field: keyof GiftContent, value: string) => void;
  addContentItem: (type: 'text' | 'image') => void;
  removeContentItem: (index: number) => void;
  handleImageUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: Record<number, boolean>;
  updateConfessionField: (field: string, value: any) => void;
}

export default function ContentStep({
  giftData,
  setGiftData,
  updateTheme,
  handleContentChange,
  addContentItem,
  removeContentItem,
  handleImageUpload,
  isUploading,
  updateConfessionField
}: ContentStepProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" /> 4. Isi Surat & Kenangan
          </h2>
          <p className="text-stone-500 text-sm">Tambahkan cerita kenangan atau atur kado pengakuan romantis Anda.</p>
        </div>
      </div>

      {/* Template Selection Tabs */}
      <div className="flex gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/50">
        <button
          type="button"
          onClick={() => setGiftData(prev => ({ ...prev, templateId: 'museum' }))}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            (giftData.templateId || 'museum') === 'museum'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50/50'
          }`}
        >
          Museum Slide (Default)
        </button>
        <button
          type="button"
          onClick={() => setGiftData(prev => ({ ...prev, templateId: 'confession' }))}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all ${
            giftData.templateId === 'confession'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50/50'
          }`}
        >
          Kartu Pengakuan (Confession)
        </button>
      </div>

      {/* TEMPLATE A: Museum Slide (Default) */}
      {(giftData.templateId || 'museum') === 'museum' && (
        <div className="space-y-6">
          {/* Card Style Selection */}
          <div className="space-y-3 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wide block">
              Gaya Kartu Slide:
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => updateTheme('cardStyle', theme.id)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    (giftData.theme.cardStyle || 'lined') === theme.id
                      ? 'border-rose-400 ring-2 ring-rose-200 font-semibold bg-white'
                      : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xl mb-1">{theme.icon}</div>
                  <span className="text-xs text-stone-700 block font-semibold leading-tight">{theme.name}</span>
                  <span className="text-[9px] text-stone-400 block mt-0.5 leading-tight">{theme.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Content Builder */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {giftData.content.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200 relative group shadow-sm">
                <button
                  type="button"
                  onClick={() => removeContentItem(idx)}
                  disabled={giftData.content.length <= 1}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-500 transition disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-3">
                  Kartu {idx + 1} ({item.type === 'text' ? 'Tulisan' : 'Gambar'})
                </span>

                {item.type === 'text' ? (
                  <textarea
                    value={item.body || ''}
                    onChange={(e) => handleContentChange(idx, 'body', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:ring-rose-200 focus:border-rose-400 focus:outline-none text-sm"
                    placeholder="Tulis pesan romantis atau cerita di kartu ini..."
                  />
                ) : (
                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2">Unggah Foto Kado:</label>
                      <div className="flex flex-col sm:flex-row items-center gap-4">

                        {/* Image Preview / Upload Status Area */}
                        <div className="relative w-24 h-24 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0 group/preview shadow-inner">
                          {isUploading[idx] ? (
                            <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                          ) : item.url ? (
                            <>
                              <Image
                                src={item.url}
                                alt="Pratinjau"
                                fill
                                sizes="96px"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <button
                                  type="button"
                                  onClick={() => handleContentChange(idx, 'url', '')}
                                  className="text-white text-xs font-semibold hover:underline"
                                >
                                  Hapus
                                </button>
                              </div>
                            </>
                          ) : (
                            <ImageIcon className="w-8 h-8 text-stone-300" />
                          )}
                        </div>

                        {/* Upload Button & Dropzone */}
                        <div className="flex-1 w-full">
                          <label className={`w-full py-4 px-6 border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                            isUploading[idx]
                              ? 'border-rose-200 bg-rose-50/10 pointer-events-none'
                              : 'border-stone-200 hover:border-rose-300 hover:bg-rose-50/10'
                          }`}>
                            <Upload className={`w-5 h-5 mb-1 ${isUploading[idx] ? 'text-rose-400 animate-pulse' : 'text-stone-400'}`} />
                            <span className="text-xs font-semibold text-stone-600">
                              {isUploading[idx] ? 'Mengunggah...' : 'Pilih file gambar'}
                            </span>
                            <span className="text-[9px] text-stone-400 mt-0.5">JPG, PNG, GIF up to 5MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(idx, e)}
                              className="hidden"
                              disabled={isUploading[idx]}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* URL Fallback Input (Manual) */}
                    <div className="border-t border-stone-100 pt-3">
                      <label className="text-[9px] font-semibold text-stone-400 block mb-1">
                        Atau tempelkan URL gambar manual (opsional):
                      </label>
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={(e) => handleContentChange(idx, 'url', e.target.value)}
                        className="w-full px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-300 text-xs bg-stone-50/50"
                        placeholder="https://example.com/foto.jpg"
                      />
                    </div>

                    {/* Caption Field */}
                    <div>
                      <label className="text-[10px] font-semibold text-stone-500 block mb-1">Keterangan Gambar (Caption):</label>
                      <input
                        type="text"
                        value={item.caption || ''}
                        onChange={(e) => handleContentChange(idx, 'caption', e.target.value)}
                        className="w-full px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-300 text-xs"
                        placeholder="Keterangan singkat..."
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add item buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => addContentItem('text')}
              className="flex-1 py-3 border border-dashed border-rose-300 hover:border-rose-400 text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-rose-50/30 transition"
            >
              <Plus className="w-4 h-4" /> Tambah Kartu Tulisan
            </button>
            <button
              type="button"
              onClick={() => addContentItem('image')}
              className="flex-1 py-3 border border-dashed border-rose-300 hover:border-rose-400 text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-rose-50/30 transition"
            >
              <Plus className="w-4 h-4" /> Tambah Kartu Gambar
            </button>
          </div>
        </div>
      )}

      {/* TEMPLATE B: Kartu Pengakuan (Confession) */}
      {giftData.templateId === 'confession' && (
        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">

          {/* Whisper Cards */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Kartu Bisik-Bisik (Urutan 1 - 5)</span>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-[10px] font-bold text-stone-400 bg-stone-100 w-5 h-5 rounded-full flex items-center justify-center mt-2 flex-shrink-0">{idx + 1}</span>
                  <textarea
                    value={giftData.confession?.whispers?.[idx] || ''}
                    onChange={(e) => {
                      const newWhispers = [...(giftData.confession?.whispers || [])];
                      newWhispers[idx] = e.target.value;
                      updateConfessionField('whispers', newWhispers);
                    }}
                    rows={2}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-rose-200 focus:border-rose-400 text-xs"
                    placeholder={`Tulis bisikan ke-${idx + 1}...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Message */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Isi Surat Utama (Gulungan Naskah)</span>
            <textarea
              value={giftData.confession?.scrollMessage || ''}
              onChange={(e) => updateConfessionField('scrollMessage', e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-rose-200 focus:border-rose-400 text-xs"
              placeholder="Tulis surat rahasiamu di sini..."
            />
          </div>

          {/* Proposal Question & Action buttons */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Pertanyaan & Pilihan Jawaban</span>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-stone-500 block mb-1">Pertanyaan Utama:</label>
                <input
                  type="text"
                  value={giftData.confession?.question || ''}
                  onChange={(e) => updateConfessionField('question', e.target.value)}
                  className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:outline-none text-xs font-medium"
                  placeholder="e.g. Mau jadi pacarku?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-1">Teks Setuju (Yes):</label>
                  <input
                    type="text"
                    value={giftData.confession?.yesLabel || ''}
                    onChange={(e) => updateConfessionField('yesLabel', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:outline-none text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 block mb-1">Teks Mikir (No):</label>
                  <input
                    type="text"
                    value={giftData.confession?.noLabel || ''}
                    onChange={(e) => updateConfessionField('noLabel', e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Customize */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Desain Sertifikat Resmi</span>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-stone-500 block mb-1">Judul Dokumen:</label>
                <input
                  type="text"
                  value={giftData.confession?.certificateTitle || ''}
                  onChange={(e) => updateConfessionField('certificateTitle', e.target.value)}
                  className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:outline-none text-xs font-bold"
                  placeholder="e.g. Sertifikat Jadi Kita"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-stone-500 block mb-1">Isi Surat Pernyataan:</label>
                <textarea
                  value={(() => {
                    const text = giftData.confession?.certificateBody || '';
                    const idx = text.toLowerCase().indexOf('dari');
                    return idx !== -1 ? text.substring(0, idx).trim() : text;
                  })()}
                  onChange={(e) => {
                    const sender = giftData.confession?.senderName || 'Aku';
                    const recipient = giftData.confession?.recipientName || 'Kamu';
                    const signature = ` Dari ${sender}, buat ${recipient}.`;
                    updateConfessionField('certificateBody', e.target.value + signature);
                  }}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-stone-200 rounded-xl focus:outline-none text-xs"
                  placeholder="Deklarasi resmi hubungan..."
                />
              </div>

              {/* Tanda Tangan: Dari...buat... */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Tanda Tangan Sertifikat</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-stone-500 block mb-1">Dari (Pengirim):</label>
                    <input
                      type="text"
                      value={giftData.confession?.senderName || ''}
                      onChange={(e) => {
                        updateConfessionField('senderName', e.target.value);
                        const text = giftData.confession?.certificateBody || '';
                        const idx = text.toLowerCase().indexOf('dari');
                        const body = idx !== -1 ? text.substring(0, idx).trim() : text;
                        const recipient = giftData.confession?.recipientName || 'Kamu';
                        updateConfessionField('certificateBody', `${body} Dari ${e.target.value}, buat ${recipient}.`);
                      }}
                      className="w-full px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none text-xs font-medium"
                      placeholder="e.g. Raka"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-stone-500 block mb-1">Buat (Penerima):</label>
                    <input
                      type="text"
                      value={giftData.confession?.recipientName || ''}
                      onChange={(e) => {
                        updateConfessionField('recipientName', e.target.value);
                        const text = giftData.confession?.certificateBody || '';
                        const idx = text.toLowerCase().indexOf('dari');
                        const body = idx !== -1 ? text.substring(0, idx).trim() : text;
                        const sender = giftData.confession?.senderName || 'Aku';
                        updateConfessionField('certificateBody', `${body} Dari ${sender}, buat ${e.target.value}.`);
                      }}
                      className="w-full px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none text-xs font-medium"
                      placeholder="e.g. Nara"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 italic">
                  Preview: <span className="text-rose-500 font-medium">Dari {giftData.confession?.senderName || 'Aku'}, buat {giftData.confession?.recipientName || 'Kamu'}.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </motion.div>
  );
}
