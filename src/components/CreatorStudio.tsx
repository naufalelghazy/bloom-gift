'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Music, 
  Lock, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Share2, 
  Link2, 
  CheckCircle2,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { GiftData, GiftContent } from '@/data/mockGifts';
import GiftViewer from './GiftViewer';
import { supabase } from '@/lib/supabaseClient';

const PRESET_SONGS = [
  { name: 'Relaxing Acoustic Guitar', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Soft Piano Lofi', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Sweet Cinematic Instrumental', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

const PALETTES = [
  { id: 'pink', name: 'Pink Pastel', bg: 'bg-rose-100', text: 'text-rose-500' },
  { id: 'red', name: 'Warm Red', bg: 'bg-red-100', text: 'text-red-500' },
  { id: 'blue', name: 'Dreamy Blue', bg: 'bg-sky-100', text: 'text-sky-500' },
  { id: 'yellow', name: 'Bright Yellow', bg: 'bg-amber-100', text: 'text-amber-500' },
  { id: 'mixed', name: 'Soft Rainbow', bg: 'bg-gradient-to-r from-rose-100 via-indigo-100 to-amber-100', text: 'text-stone-600' }
];

export default function CreatorStudio() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [slugError, setSlugError] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // To force refresh phone preview
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveLocation, setSaveLocation] = useState<'cloud' | 'local' | null>(null);
  const [isUploading, setIsUploading] = useState<Record<number, boolean>>({});

  const [giftData, setGiftData] = useState<GiftData>({
    id: '',
    slug: '',
    status: 'active',
    theme: {
      palette: 'pink',
      flowerStyle: 'rose',
      fontFamily: 'font-serif'
    },
    security: {
      gateType: 'pin',
      passcode: '1234',
      hint: 'Kode PIN default'
    },
    musicUrl: PRESET_SONGS[0].url,
    intro: {
      title: 'Khusus untuk Kamu 🌸',
      subtitle: 'Sebuah kejutan kecil yang mekar untukmu...'
    },
    content: [
      {
        type: 'text',
        body: 'Aku ingin meluangkan waktu sejenak untuk menulis pesan ini kepadamu...'
      },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        caption: 'Ini kenangan kecil kita.'
      }
    ],
    finale: {
      message: 'Terima kasih sudah membaca sampai akhir. I love you!',
      bouquetType: 'pink_roses'
    }
  });

  // Handle updates to nested objects
  const updateTheme = (field: string, value: string) => {
    setGiftData((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value }
    }));
  };

  const updateSecurity = (field: string, value: string) => {
    setGiftData((prev) => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  const updateIntro = (field: string, value: string) => {
    setGiftData((prev) => ({
      ...prev,
      intro: { ...prev.intro, [field]: value }
    }));
  };

  const updateFinale = (field: string, value: string) => {
    setGiftData((prev) => ({
      ...prev,
      finale: { ...prev.finale, [field]: value }
    }));
  };

  // Content Array Handlers
  const handleContentChange = (index: number, field: keyof GiftContent, value: string) => {
    setGiftData((prev) => {
      const newContent = [...prev.content];
      newContent[index] = { ...newContent[index], [field]: value };
      return { ...prev, content: newContent };
    });
  };

  const addContentItem = (type: 'text' | 'image') => {
    setGiftData((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        type === 'text' 
          ? { type: 'text', body: 'Tulis ceritamu di sini...' } 
          : { type: 'image', url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', caption: 'Tambahkan keterangan foto...' }
      ]
    }));
  };

  const removeContentItem = (index: number) => {
    if (giftData.content.length <= 1) return; // Keep at least one
    setGiftData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setIsUploading((prev) => ({ ...prev, [index]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${randomString}_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('gift-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('gift-images')
        .getPublicUrl(fileName);

      handleContentChange(index, 'url', publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(`Gagal mengunggah gambar: ${err.message || 'Error tidak diketahui. Pastikan Anda telah membuat bucket storage "gift-images" di dashboard Supabase.'}`);
    } finally {
      setIsUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Handle Slug/Link validation
  const handleSlugChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setGiftData((prev) => ({ ...prev, slug: sanitized, id: 'gift_' + sanitized }));
    
    if (sanitized.length < 3) {
      setSlugError('Link kado minimal harus 3 karakter.');
    } else {
      setSlugError('');
    }
  };

  // Save/Publish Gift to localStorage & Supabase
  const handlePublish = async () => {
    if (!giftData.slug || slugError) {
      setSlugError('Mohon isi link kado yang valid.');
      return;
    }

    setIsSubmitting(true);
    let savedToCloud = false;

    // 1. Coba simpan ke Supabase
    try {
      const { error } = await supabase
        .from('gifts')
        .insert([giftData]);

      if (!error) {
        savedToCloud = true;
        setSaveLocation('cloud');
      } else {
        console.error('Supabase save error:', error.message, '| Details:', error.details, '| Hint:', error.hint);
      }
    } catch (err) {
      console.error('Supabase connection failed:', err);
    }

    // 2. Simpan ke localStorage sebagai cadangan/fallback
    const localGiftsRaw = localStorage.getItem('bloom_gifts');
    let localGifts: Record<string, GiftData> = {};

    if (localGiftsRaw) {
      try {
        localGifts = JSON.parse(localGiftsRaw);
      } catch (e) {
        console.error(e);
      }
    }

    localGifts[giftData.slug] = giftData;
    localStorage.setItem('bloom_gifts', JSON.stringify(localGifts));
    
    if (!savedToCloud) {
      setSaveLocation('local');
    }

    setIsSubmitting(false);
    setIsPublished(true);
    setCurrentStep(5);
  };

  // Refresh dynamic preview on phone mock
  const restartPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row text-stone-800">
      
      {/* LEFT COLUMN: The Wizard Editor */}
      <div className="w-full md:w-[60%] p-6 md:p-12 overflow-y-auto max-h-screen flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">Bloom Gift Studio 🌸</h1>
            <p className="text-stone-500 text-xs mt-1">Rangkai hadiah digital kejutanmu</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-100 text-rose-600 rounded-full">
            Langkah {currentStep} dari 5
          </span>
        </div>

        {/* Wizard Form Sections */}
        <div className="flex-1 space-y-6">
          
          {/* STEP 1: Tema & Musik */}
          {currentStep === 1 && (
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
                <div className="pt-2">
                  <label className="text-xs text-stone-400 block mb-1">Atau masukkan URL musik MP3 Anda sendiri:</label>
                  <input
                    type="text"
                    value={giftData.musicUrl}
                    onChange={(e) => setGiftData(prev => ({ ...prev, musicUrl: e.target.value }))}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl bg-white text-xs focus:ring-rose-200 focus:border-rose-400 focus:outline-none"
                    placeholder="https://example.com/song.mp3"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Keamanan */}
          {currentStep === 2 && (
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
          )}

          {/* STEP 3: Intro */}
          {currentStep === 3 && (
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
          )}

          {/* STEP 4: Konten Cerita */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-rose-500" /> 4. Isi Surat & Kenangan
                  </h2>
                  <p className="text-stone-500 text-sm">Tambahkan kartu pesan cinta dan foto slide Anda.</p>
                </div>
              </div>

              {/* Dynamic Content Builder */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {giftData.content.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200 relative group shadow-sm">
                    <button
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
                            <div className="w-24 h-24 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group/preview shadow-inner">
                              {isUploading[idx] ? (
                                <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                              ) : item.url ? (
                                <>
                                  <img src={item.url} alt="Pratinjau" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
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
                  onClick={() => addContentItem('text')}
                  className="flex-1 py-3 border border-dashed border-rose-300 hover:border-rose-400 text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-rose-50/30 transition"
                >
                  <Plus className="w-4 h-4" /> Tambah Kartu Tulisan
                </button>
                <button
                  onClick={() => addContentItem('image')}
                  className="flex-1 py-3 border border-dashed border-rose-300 hover:border-rose-400 text-rose-500 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold hover:bg-rose-50/30 transition"
                >
                  <Plus className="w-4 h-4" /> Tambah Kartu Gambar
                </button>
              </div>

              {/* Finale message input */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2 mt-4">
                <label className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Kalimat Penutup Akhir (Buket Finale):
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
          )}

          {/* STEP 5: Selesai & Bagikan */}
          {currentStep === 5 && (
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
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {!isPublished && (
          <div className="flex items-center justify-between border-t border-stone-200 pt-6 mt-8">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${
                currentStep === 1
                  ? 'opacity-30 border-transparent text-stone-400 cursor-not-allowed'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="flex items-center gap-1 py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3 w-[45%]">
                <input
                  type="text"
                  placeholder="slug-kado (e.g. kado-nara)"
                  value={giftData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none text-xs ${
                    slugError ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                  }`}
                />
                <button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex-shrink-0 py-2.5 px-5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-rose-100 disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim...' : 'Terbitkan 🚀'}
                </button>
              </div>
            )}
          </div>
        )}
        
        {slugError && (
          <p className="text-red-500 text-xs font-semibold mt-2 text-right">{slugError}</p>
        )}

      </div>

      {/* RIGHT COLUMN: The Sticky Phone Mockup Live Preview */}
      <div className="w-full md:w-[40%] bg-stone-100 border-l border-stone-200 flex flex-col items-center justify-center p-6 py-12 md:py-6 relative min-h-[600px] md:min-h-screen">
        
        {/* Floating instruction / reload */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-200/50 px-2.5 py-1 rounded-full">
            Live Preview
          </span>
          <button
            onClick={restartPreview}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 transition"
            title="Muat Ulang Pratinjau"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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
            <GiftViewer key={previewKey} giftData={giftData} />
          </div>
        </div>
      </div>

    </div>
  );
}
