-- SQL Schema untuk Bloom Gift
-- Jalankan query ini di SQL Editor Supabase Anda (https://supabase.com) untuk membuat tabel dan kebijakan keamanan yang diperlukan.

-- 1. Membuat tabel 'gifts'
CREATE TABLE IF NOT EXISTS public.gifts (
  id TEXT NOT NULL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  "templateId" TEXT DEFAULT 'museum',
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  security JSONB NOT NULL DEFAULT '{}'::jsonb,
  "musicUrl" TEXT NOT NULL,
  intro JSONB NOT NULL DEFAULT '{}'::jsonb,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  confession JSONB DEFAULT '{}'::jsonb,
  finale JSONB NOT NULL DEFAULT '{}'::jsonb,
  view_count INTEGER NOT NULL DEFAULT 0,
  opened_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrasi: Tambahkan kolom jika tabel sudah ada sebelumnya
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS "templateId" TEXT DEFAULT 'museum';
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS confession JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE;

-- 2. Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

-- 3. Membuat Kebijakan (Policies) Keamanan RLS
-- Hapus policy lama jika ada untuk mencegah error
DROP POLICY IF EXISTS "Allow public read access for gifts" ON public.gifts;
DROP POLICY IF EXISTS "Allow public write access for gifts" ON public.gifts;

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
-- SECURE VIEW COUNT & OPENED STATUS TRACKING
-- =========================================================================

-- Fungsi Postgres untuk mencatat pembukaan kado secara aman tanpa memberikan hak UPDATE penuh ke publik
CREATE OR REPLACE FUNCTION public.increment_gift_views(gift_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.gifts
  SET 
    view_count = COALESCE(view_count, 0) + 1,
    opened_at = COALESCE(opened_at, timezone('utc'::text, now()))
  WHERE id = gift_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- KONFIGURASI SUPABASE STORAGE (Untuk Upload Gambar Kado)
-- =========================================================================

-- 1. Membuat bucket penyimpanan bernama 'gift-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-images', 'gift-images', true)
ON CONFLICT (id) DO NOTHING;

-- Hapus policy storage lama jika ada untuk mencegah error
DROP POLICY IF EXISTS "Allow public read access for gift images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload access for gift images" ON storage.objects;

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
