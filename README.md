# 🌸 Bloom Gift — Kado Kecil, Rasanya Panjang

**Bloom Gift** adalah aplikasi web kado digital interaktif yang memungkinkan Anda merangkai pesan cinta, kumpulan foto kenangan, dan musik latar favorit menjadi sebuah pengalaman animasi mekar yang elegan. Kado digital ini dapat dikunci menggunakan PIN atau pertanyaan rahasia khusus yang hanya diketahui oleh Anda dan pasangan Anda.

Aplikasi ini terinspirasi dari Laubloom, didesain dengan visual bertema botanical yang hangat, estetika modern, serta animasi halus yang dioptimalkan untuk perangkat seluler.

---

## ✨ Fitur Utama

1. **6-Step Creator Studio Wizard**:
   - **Langkah 1**: Pilih skema warna (Preset HSL hangat/pastel atau Slider Hue kustom) dan musik latar (preset instrumental romantis atau upload MP3 sendiri).
   - **Langkah 2**: Atur pengaman (PIN angka, pertanyaan rahasia dengan jawaban unik, atau tanpa pengunci).
   - **Langkah 3**: Kostumisasi teks pembuka (*Intro Stage*) beserta animasi mekar (Mawar, Hati, Kembang Api, Amplop Segel Lilin, atau Gulungan Naskah).
   - **Langkah 4**: Tulis cerita/surat cinta & unggah foto kenangan. Mendukung dua template: *Museum Slide* (galeri kartu geser) dan *Confession Card* (kartu pernyataan cinta interaktif).
   - **Langkah 5**: Pilih jenis buket bunga akhir beserta makna simbolisnya (Mawar merah, Tulip, Peony, Lavender, dll) dan pesan penutup.
   - **Langkah 6**: Publish kado Anda ke database cloud Supabase, dapatkan tautan unik instan beserta QR Code yang siap dibagikan.

2. **Real-time Opened Status Tracker**:
   - Creator dapat memantau apakah kado digital sudah dibuka oleh pasangannya langsung dari halaman publikasi secara real-time. Status terupdate otomatis begitu halaman kado di-unlock penerima!

3. **Responsive Phone Preview**:
   - Editor dilengkapi simulator ponsel langsung (WYSIWYG) di sebelah formulir, lengkap dengan tombol uji coba layar penuh untuk melihat animasi persis seperti tampilan di handphone penerima.

4. **Optimasi Performa Modern**:
   - Menggunakan format gambar **WebP** untuk loading super cepat di HP murah.
   - Menggunakan komponen **`next/image`** Next.js untuk lazy loading & responsive rendering otomatis.
   - Font Google (EB Garamond, Caveat, Dancing Script) di-load via **`next/font`** di sisi server (mencegah *flash of unstyled text*).

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 16 (React 19)
- **Styling**: TailwindCSS 4 & Vanilla CSS
- **Animasi**: Framer Motion
- **Database & Storage**: Supabase (PostgreSQL, Row Level Security, Storage Bucket)
- **Image Processing**: Sharp (untuk optimasi aset mekar di server)

---

## 🚀 Memulai Penggunaan (Lokal)

### Prerequisites
Pastikan Anda sudah menginstal **Node.js** (v18 ke atas) dan memiliki akun **Supabase** jika ingin menghubungkan fitur database cloud.

### 1. Kloning & Install Dependensi
```bash
git clone https://github.com/username/bloom-gift.git
cd bloom-gift
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env.local` di root direktori proyek dan isi dengan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database Supabase
Jalankan isi dari file [supabase-schema.sql](file:///c:/Users/naufa/.gemini/antigravity/scratch/bloom-gift/supabase-schema.sql) di dalam **SQL Editor** pada Dashboard Supabase Anda. Ini akan membuat:
- Tabel `gifts` lengkap dengan kolom pelacakan views.
- PostgreSQL RPC function `increment_gift_views` untuk pencatatan status buka secara aman.
- Storage bucket `gift-images` dengan RLS Policies yang sesuai untuk upload foto kenangan secara publik.

### 4. Jalankan Server Dev
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk mulai membuat kado digital pertama!

---

## 📂 Struktur Direktori Utama

```text
bloom-gift/
├── public/                  # Aset gambar WebP & Buket bunga
├── src/
│   ├── app/                 # Routing Next.js (App Router)
│   │   ├── layout.tsx       # Root layout & Centralized Font loading
│   │   ├── page.tsx         # Landing Page utama
│   │   └── g/[slug]/        # Halaman penampil kado penerima
│   ├── components/
│   │   ├── creator/         # Komponen wizard langkah pembuatan kado
│   │   ├── stages/          # Animasi tahapan mekar kado (Locked, Intro, Story, Finale)
│   │   └── GiftViewer.tsx   # Pengatur alur transisi stage kado
│   ├── data/
│   │   └── mockGifts.ts     # Struktur data type interfaces & data contoh
│   └── lib/
│       └── supabaseClient.ts# Inisialisasi client Supabase
└── supabase-schema.sql      # Script inisialisasi & migrasi database
```

---

## 🌸 Kontribusi & Lisensi

Dibuat dengan cinta untuk membagikan kebahagiaan kecil. Silakan gunakan template ini untuk membuat kado bagi orang spesial Anda!
*Copyright © 2026 Bloom Gift Studio.*
