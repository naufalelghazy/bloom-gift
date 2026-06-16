'use client';

import { useState, useEffect } from 'react';
import { GiftData, GiftContent } from '@/data/mockGifts';
import { supabase } from '@/lib/supabaseClient';
import { DEFAULT_GIFT_DATA } from './constants';

export function useGiftEditor() {
  const [currentStep, setCurrentStep] = useState(1);
  const [slugError, setSlugError] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveLocation, setSaveLocation] = useState<'cloud' | 'local' | null>(null);
  const [isUploading, setIsUploading] = useState<Record<number, boolean>>({});
  const [isMusicUploading, setIsMusicUploading] = useState(false);
  const [uploadedMusicName, setUploadedMusicName] = useState('');
  const [giftData, setGiftData] = useState<GiftData>(DEFAULT_GIFT_DATA);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('bloom_creator_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.slug !== undefined) {
          setShowRestorePrompt(true);
        }
      } catch (e) {
        console.error('Failed to parse draft:', e);
      }
    }
  }, []);

  // Save draft to localStorage whenever giftData changes
  useEffect(() => {
    if (showRestorePrompt || isPublished) return;

    const saveDraft = () => {
      localStorage.setItem('bloom_creator_draft', JSON.stringify(giftData));
      setIsDraftSaved(true);
      const timer = setTimeout(() => setIsDraftSaved(false), 2000);
      return () => clearTimeout(timer);
    };

    const debounceTimer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(debounceTimer);
  }, [giftData, showRestorePrompt, isPublished]);

  // --- Draft handlers ---
  const handleRestoreDraft = () => {
    const savedDraft = localStorage.getItem('bloom_creator_draft');
    if (savedDraft) {
      try {
        setGiftData(JSON.parse(savedDraft));
      } catch (e) {
        console.error('Failed to parse draft during restore:', e);
      }
    }
    setShowRestorePrompt(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem('bloom_creator_draft');
    setShowRestorePrompt(false);
  };

  // --- Update helpers ---
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

  // --- Content array handlers ---
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
    if (giftData.content.length <= 1) return;
    setGiftData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  // --- File upload helpers ---
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setIsUploading((prev) => ({ ...prev, [index]: true }));

    try {
      const isSupabaseUrlPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                                        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

      if (isSupabaseUrlPlaceholder) {
        throw new Error('Supabase not configured');
      }

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
      console.warn('Supabase storage not available, falling back to local Base64 uploader:', err.message || err);
      try {
        const base64Url = await readFileAsDataURL(file);
        handleContentChange(index, 'url', base64Url);
      } catch (readErr) {
        alert('Gagal membaca file lokal.');
      }
    } finally {
      setIsUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file musik terlalu besar. Maksimal 10MB.');
      return;
    }

    setIsMusicUploading(true);

    try {
      const isSupabaseUrlPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                                        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

      if (isSupabaseUrlPlaceholder) {
        throw new Error('Supabase not configured');
      }

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
      console.warn('Supabase storage not available, falling back to local Base64 audio:', err.message || err);
      try {
        const base64Url = await readFileAsDataURL(file);
        setGiftData((prev) => ({ ...prev, musicUrl: base64Url }));
        setUploadedMusicName(file.name);
      } catch (readErr) {
        alert('Gagal membaca file lokal.');
      }
    } finally {
      setIsMusicUploading(false);
    }
  };

  // --- Slug & Publish ---
  const handleSlugChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setGiftData((prev) => ({ ...prev, slug: sanitized, id: 'gift_' + sanitized }));

    if (sanitized.length < 3) {
      setSlugError('Link kado minimal harus 3 karakter.');
    } else {
      setSlugError('');
    }
  };

  const handlePublish = async () => {
    if (!giftData.slug || slugError) {
      setSlugError('Mohon isi link kado yang valid.');
      return;
    }

    if (giftData.security.gateType === 'pin' && !giftData.security.passcode) {
      alert('Kode PIN tidak boleh kosong jika pengaman PIN aktif.');
      return;
    }

    if (giftData.security.gateType === 'question' && (!giftData.security.question || !giftData.security.passcode)) {
      alert('Pertanyaan dan Jawaban rahasia tidak boleh kosong jika pengaman Pertanyaan aktif.');
      return;
    }

    setIsSubmitting(true);
    let savedToCloud = false;

    try {
      const isSupabaseUrlPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                                        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';
      if (isSupabaseUrlPlaceholder) {
        throw new Error('Supabase not configured');
      }

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

    localStorage.removeItem('bloom_creator_draft');
    setIsSubmitting(false);
    setIsPublished(true);
    setCurrentStep(6);
  };

  const restartPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  return {
    // State
    currentStep, setCurrentStep,
    giftData, setGiftData,
    slugError, setSlugError,
    isPublished, setIsPublished,
    previewKey,
    isSubmitting,
    saveLocation,
    isUploading,
    isMusicUploading,
    uploadedMusicName,
    showRestorePrompt,
    isDraftSaved,
    isFullscreenPreview, setIsFullscreenPreview,

    // Handlers
    handleRestoreDraft,
    handleDiscardDraft,
    updateTheme,
    updateCustomColor,
    updateSecurity,
    updateIntro,
    updateFinale,
    updateConfessionField,
    handleContentChange,
    addContentItem,
    removeContentItem,
    handleImageUpload,
    handleMusicUpload,
    handleSlugChange,
    handlePublish,
    restartPreview,
  };
}
