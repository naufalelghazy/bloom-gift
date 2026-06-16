# 🌸 Bloom Gift — Kado Kecil, Rasanya Panjang

**Bloom Gift** adalah aplikasi web kado digital interaktif yang memungkinkan Anda merangkai pesan cinta, kumpulan foto kenangan, dan musik latar favorit menjadi sebuah pengalaman animasi mekar yang elegan. Kado digital ini dapat dikunci menggunakan PIN atau pertanyaan rahasia khusus yang hanya diketahui oleh Anda dan pasangan Anda.

Aplikasi ini terinspirasi dari Laubloom, didesain dengan visual bertema botanical yang hangat, estetika modern, serta animasi halus yang dioptimalkan untuk perangkat seluler.

---

## ✨ Fitur Utama

1. **6-Step Creator Studio Wizard**:
   - **Langkah 1**: Pilih skema warna (Preset HSL hangat/pastel atau Slider Hue kustom) dan musik latar (preset instrumental romantis atau upload MP3 sendiri).
   - **Langkah 2**: Atur pengaman (PIN angka, pertanyaan rahasia dengan jawaban unik, atau tanpa pengunci).
   - **Langkah 3**: Kostumisasi teks pembuka (_Intro Stage_) beserta animasi mekar (Mawar, Hati, Kembang Api, Amplop Segel Lilin, atau Gulungan Naskah).
   - **Langkah 4**: Tulis cerita/surat cinta & unggah foto kenangan. Mendukung dua template: _Museum Slide_ (galeri kartu geser) dan _Confession Card_ (kartu pernyataan cinta interaktif).
   - **Langkah 5**: Pilih jenis buket bunga akhir beserta makna simbolisnya (Mawar merah, Tulip, Peony, Lavender, dll) dan pesan penutup.
   - **Langkah 6**: Publish kado Anda ke database cloud Supabase, dapatkan tautan unik instan beserta QR Code yang siap dibagikan.

2. **Real-time Opened Status Tracker**:
   - Creator dapat memantau apakah kado digital sudah dibuka oleh pasangannya langsung dari halaman publikasi secara real-time. Status terupdate otomatis begitu halaman kado di-unlock penerima!

3. **Responsive Phone Preview**:
   - Editor dilengkapi simulator ponsel langsung (WYSIWYG) di sebelah formulir, lengkap dengan tombol uji coba layar penuh untuk melihat animasi persis seperti tampilan di handphone penerima.

4. **Optimasi Performa Modern**:
   - Menggunakan format gambar **WebP** untuk loading super cepat di HP murah.
   - Menggunakan komponen **`next/image`** Next.js untuk lazy loading & responsive rendering otomatis.
   - Font Google (EB Garamond, Caveat, Dancing Script) di-load via **`next/font`** di sisi server (mencegah _flash of unstyled text_).

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 16 (React 19)
- **Styling**: TailwindCSS 4 & Vanilla CSS
- **Animasi**: Framer Motion
- **Database & Storage**: Supabase (PostgreSQL, Row Level Security, Storage Bucket)
- **Image Processing**: Sharp (untuk optimasi aset mekar di server)

---

## 🚀 Coba Aplikasi Secara Langsung

Anda dapat langsung mencoba dan membuat kado digital Anda melalui tautan berikut:
👉 **[bloom-ten-gilt.vercel.app](https://bloom-ten-gilt.vercel.app)**

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
_Copyright © 2026 Bloom Gift Studio._
