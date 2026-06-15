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
  { name: 'Warm Acoustic Guitar (Morning)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Morning.mp3' },
  { name: 'Romantic Guitar & Cello (Evening)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening.mp3' },
  { name: 'Soft Piano Jazz Lofi (Late Night Radio)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Late%20Night%20Radio.mp3' },
  { name: 'Relaxing Acoustic & Piano (Pleasant Porridge)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pleasant%20Porridge.mp3' }
];

const PALETTES = [
  { id: 'pink', name: 'Pink Pastel', bg: 'bg-rose-100', text: 'text-rose-500' },
  { id: 'red', name: 'Warm Red', bg: 'bg-red-100', text: 'text-red-500' },
  { id: 'blue', name: 'Dreamy Blue', bg: 'bg-sky-100', text: 'text-sky-500' },
  { id: 'yellow', name: 'Bright Yellow', bg: 'bg-amber-100', text: 'text-amber-500' },
  { id: 'mixed', name: 'Soft Rainbow', bg: 'bg-gradient-to-r from-rose-100 via-indigo-100 to-amber-100', text: 'text-stone-600' },
  { id: 'custom', name: 'Kustom', bg: 'bg-gradient-to-tr from-rose-300 via-indigo-300 to-amber-300', text: 'text-stone-700' }
];

const ANIMATIONS = [
  { id: 'rose', name: 'Mawar Mekar', desc: 'Animasi kelopak bunga klasik', icon: '🌸' },
  { id: 'heart', name: 'Detak Jantung', desc: 'Animasi hati yang berdenyut', icon: '❤️' },
  { id: 'fireworks', name: 'Kembang Api', desc: 'Pancaran cahaya meriah', icon: '✨' },
  { id: 'scroll', name: 'Surat Kerajaan', desc: 'Animasi gulungan naskah klasik', icon: '📜' },
  { id: 'envelope', name: 'Amplop Kerajaan', desc: 'Buka surat dengan segel lilin merah', icon: '✉️' }
];

const CARD_THEMES = [
  { id: 'lined', name: 'Buku Catatan', desc: 'Bergaris manis dengan mawar', icon: '📝' },
  { id: 'parchment', name: 'Kertas Klasik', desc: 'Vintage dengan daun emas', icon: '📜' },
  { id: 'midnight', name: 'Galaksi Malam', desc: 'Indigo dengan bintang', icon: '🌌' },
  { id: 'sakura', name: 'Musim Sakura', desc: 'Pink dengan bunga sakura', icon: '🌸' },
  { id: 'eucalyptus', name: 'Sage Minimalis', desc: 'Tenang dengan eucalyptus', icon: '🌿' }
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
  const [isMusicUploading, setIsMusicUploading] = useState(false);
  const [uploadedMusicName, setUploadedMusicName] = useState('');

  const [giftData, setGiftData] = useState<GiftData>({
    id: '',
    slug: '',
    status: 'active',
    templateId: 'museum',
    theme: {
      palette: 'pink',
      flowerStyle: 'rose',
      fontFamily: 'font-serif',
      cardStyle: 'lined',
      customColors: {
        from: '#ffe4e6',
        via: '#fbcfe8',
        to: '#f472b6'
      }
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
    confession: {
      whispers: [
        "Aku nggak tahu ini kelihatan berani atau nekat, tapi aku mau jujur.",
        "Kamu tuh punya bakat bikin hari biasa jadi kerasa lucu sendiri.",
        "Aku suka cara kamu hadir, bahkan pas cuma lewat chat singkat.",
        "Jadi kalau akhir-akhir ini aku agak salting, ya... tersangkanya kamu.",
        "Oke, tarik napas dulu. Habis ini ada pertanyaan penting."
      ],
      scrollMessage: "Dear Kamu,\n\nAku nggak mau bikin ini kaku kayak pidato. Intinya, aku nyaman banget sama kamu. Cara kamu ketawa, cara kamu balas hal kecil, semuanya bikin aku pengin lebih sering ada di cerita kamu.\n\nJadi kalau kamu juga mau, aku pengin kita coba jalan bareng. Pelan-pelan aja, tapi beneran.",
      question: "Mau jadi pacarku?",
      yesLabel: "Iya, gas! 💖",
      noLabel: "Mikir dulu... 🥺",
      certificateTitle: "Sertifikat Jadi Kita",
      certificateBody: "Dengan ini kita resmi boleh saling bikin salting, saling kabarin, dan pelan-pelan punya cerita yang cuma kita yang paham. Dari Raka, buat Nara. Simpan baik-baik ya. Screenshot ini, terus kirim ke Raka.",
      senderName: "Raka",
      recipientName: "Nara"
    },
    finale: {
      message: 'Terima kasih sudah membaca sampai akhir. I love you!',
      bouquetType: 'pink_roses'
    }
  });

  // Handle updates to nested objects
  const updateTheme = (field: string, value: any) => {
    setGiftData((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value }
    }));
  };

  const updateCustomColor = (key: 'from' | 'via' | 'to', hue: number) => {
    const hsl = `hsl(${hue}, 70%, 60%)`;
    setGiftData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        customColors: {
          from: prev.theme.customColors?.from || 'hsl(0,70%,60%)',
          via: prev.theme.customColors?.via || 'hsl(120,70%,60%)',
          to: prev.theme.customColors?.to || 'hsl(240,70%,60%)',
          [key]: hsl
        }
      }
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

  const updateConfessionField = (field: string, value: any) => {
    setGiftData((prev) => ({
      ...prev,
      confession: {
        ...(prev.confession || {
          whispers: [],
          scrollMessage: '',
          question: '',
          yesLabel: '',
          noLabel: '',
          certificateTitle: '',
          certificateBody: '',
          senderName: '',
          recipientName: ''
        }),
        [field]: value
      }
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

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Limit size to 10MB for audio
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file musik terlalu besar. Maksimal 10MB.');
      return;
    }

    setIsMusicUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `music_${randomString}_${Date.now()}.${fileExt}`;

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

      setGiftData((prev) => ({ ...prev, musicUrl: publicUrl }));
      setUploadedMusicName(file.name);
    } catch (err: any) {
      console.error('Music upload error:', err);
      alert(`Gagal mengunggah musik: ${err.message || 'Error tidak diketahui.'}`);
    } finally {
      setIsMusicUploading(false);
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
    setCurrentStep(6);
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
            Langkah {currentStep} dari 6
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
                                // rebuild certificateBody with new sender
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
                                // rebuild certificateBody with new recipient
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
          )}

          {/* STEP 5: Pilih Bouquet */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🌸 5. Pilih Bouquet Akhir
                </h2>
                <p className="text-stone-500 text-sm">Pilih buket bunga yang akan muncul di tampilan akhir kado sebagai penutup.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: 'pink_roses',
                    emoji: '🌸',
                    name: 'Mawar Pink',
                    meaning: 'Kasih sayang lembut, kekaguman, dan ketulusan hati yang dalam.',
                    color: 'rose'
                  },
                  {
                    id: 'red_roses',
                    emoji: '🌹',
                    name: 'Mawar Merah',
                    meaning: 'Cinta yang membara, passion, dan komitmen yang tak tergoyahkan.',
                    color: 'red'
                  },
                  {
                    id: 'tulips',
                    emoji: '🌷',
                    name: 'Tulip',
                    meaning: 'Cinta yang sempurna, keanggunan, dan kesetiaan abadi.',
                    color: 'pink'
                  },
                  {
                    id: 'sunflowers',
                    emoji: '🌻',
                    name: 'Bunga Matahari',
                    meaning: 'Kebahagiaan, kehangatan, dan loyalitas — selalu memandang terang.',
                    color: 'amber'
                  },
                  {
                    id: 'lilies',
                    emoji: '🌼',
                    name: 'Lily',
                    meaning: 'Kesucian, keindahan, dan harapan akan hari-hari yang lebih baik.',
                    color: 'yellow'
                  },
                  {
                    id: 'peonies',
                    emoji: '💮',
                    name: 'Peony',
                    meaning: 'Kemewahan, kemakmuran cinta, dan hubungan yang penuh berkah.',
                    color: 'purple'
                  },
                  {
                    id: 'lavender',
                    emoji: '💜',
                    name: 'Lavender',
                    meaning: 'Ketenangan, kesetiaan, dan cinta yang tumbuh perlahan namun pasti.',
                    color: 'violet'
                  },
                  {
                    id: 'cherry_blossom',
                    emoji: '🌺',
                    name: 'Sakura',
                    meaning: 'Keindahan sesaat yang tak terlupakan — setiap momen bersamamu adalah hadiah.',
                    color: 'pink'
                  }
                ].map((bouquet) => {
                  const isSelected = giftData.finale.bouquetType === bouquet.id;
                  return (
                    <button
                      key={bouquet.id}
                      onClick={() => updateFinale('bouquetType', bouquet.id)}
                      className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                        isSelected
                          ? 'border-rose-400 bg-rose-50/60 shadow-md shadow-rose-100 ring-2 ring-rose-200'
                          : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                      }`}
                    >
                      <div className="text-3xl">{bouquet.emoji}</div>
                      <div>
                        <p className={`text-sm font-bold ${ isSelected ? 'text-rose-700' : 'text-stone-700' }`}>
                          {bouquet.name}
                        </p>
                        <p className="text-[11px] text-stone-400 leading-snug mt-0.5">{bouquet.meaning}</p>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">✓ Dipilih</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Finale message */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2 mt-2">
                <label className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Kalimat Penutup:
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

          {/* STEP 6: Selesai & Bagikan */}
          {currentStep === 6 && (
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

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                className="flex items-center gap-1 py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            ) : currentStep === 5 ? (
              <button
                onClick={() => setCurrentStep(6)}
                className="flex items-center gap-1 py-2.5 px-5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-rose-100"
              >
                Lanjut ke Terbitkan <ChevronRight className="w-4 h-4" />
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
            <GiftViewer 
              key={`${previewKey}-${currentStep}-${giftData.theme.flowerStyle}-${giftData.theme.palette}`} 
              giftData={giftData} 
              isPreview={true} 
              activeStep={currentStep}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
