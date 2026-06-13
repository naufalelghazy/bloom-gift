import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-tr from-rose-50 via-rose-100/30 to-pink-50 items-center justify-center p-6 text-stone-800">
      <main className="max-w-md w-full p-8 rounded-3xl bg-white/70 backdrop-blur-md border border-white/20 shadow-xl text-center space-y-6 select-none">
        {/* Flower Icon/Logo */}
        <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner text-3xl">
          🌸
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold tracking-tight bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
            Bloom Gift
          </h1>
          <p className="text-stone-500 italic text-sm">
            "Kado kecil, rasanya panjang."
          </p>
        </div>

        <div className="border-t border-rose-100/50 pt-4 text-stone-600 text-sm leading-relaxed space-y-4">
          <p>
            Rangkai pesan cinta, kumpulkan kenangan foto, iringan lagu, dan bungkus dengan kejutan animasi mekar yang indah.
          </p>
          <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-left text-xs space-y-1">
            <span className="font-semibold text-rose-700 block">💡 Petunjuk Demo:</span>
            <ul className="list-disc pl-4 text-stone-500 space-y-1">
              <li>Klik tombol di bawah untuk melihat kado contoh.</li>
              <li>Masukkan PIN: <strong className="text-rose-600">1206</strong> untuk membukanya.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/g/untuk-nara"
            className="block w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Buka Demo Kado 🎁
          </Link>
          <Link
            href="/edit"
            className="block w-full py-3.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Buat Kado Sendiri ✨
          </Link>
        </div>
      </main>

      <footer className="mt-8 text-stone-400 text-xs">
        © 2026 Bloom Gift Studio. Inspirasi dari Laubloom.
      </footer>
    </div>
  );
}
