-- SQL Schema untuk Bloom Gift
-- Jalankan query ini di SQL Editor Supabase Anda (https://supabase.com) untuk membuat tabel dan kebijakan keamanan yang diperlukan.

-- 1. Membuat tabel 'gifts'
CREATE TABLE IF NOT EXISTS public.gifts (
  id TEXT NOT NULL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  security JSONB NOT NULL DEFAULT '{}'::jsonb,
  "musicUrl" TEXT NOT NULL,
  intro JSONB NOT NULL DEFAULT '{}'::jsonb,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  finale JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- 3. Membuat Kebijakan (Policies) Keamanan RLS
-- Kebijakan Membaca (SELECT): Mengizinkan siapa saja (anonim dan terautentikasi) untuk membaca data kado
CREATE POLICY "Allow public read access for gifts" 
ON public.gifts 
FOR SELECT 
TO public 
USING (true);

-- Kebijakan Menulis (INSERT): Mengizinkan siapa saja untuk membuat kado baru
CREATE POLICY "Allow public write access for gifts" 
ON public.gifts 
FOR INSERT 
TO public 
WITH CHECK (true);

-- =========================================================================
-- KONFIGURASI SUPABASE STORAGE (Untuk Upload Gambar Kado)
-- =========================================================================

-- 1. Membuat bucket penyimpanan bernama 'gift-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-images', 'gift-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Kebijakan RLS untuk membaca file (SELECT) secara publik
CREATE POLICY "Allow public read access for gift images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'gift-images' );

-- 3. Kebijakan RLS untuk mengunggah file (INSERT) secara publik
CREATE POLICY "Allow public upload access for gift images"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'gift-images' );

