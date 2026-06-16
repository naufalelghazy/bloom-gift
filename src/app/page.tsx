'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-gradient-to-tr from-[#faf6f0] via-[#fbf3eb] to-[#eedcc5] items-center justify-between p-6 overflow-hidden text-stone-800 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap');
        .font-garamond {
          font-family: 'EB Garamond', serif;
        }
      `}</style>

      {/* Background soft botanical illustrations */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 pointer-events-none opacity-20 select-none z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/intro_rose.png" alt="Rose Deco" className="w-full h-full object-contain rotate-12" />
      </div>
      <div className="absolute top-12 -right-16 w-56 h-56 pointer-events-none opacity-15 select-none z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/intro_heart.png" alt="Heart Deco" className="w-full h-full object-contain -rotate-12" />
      </div>

      {/* Decorative hanging rose ornament at the top */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none select-none z-10 overflow-hidden h-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lock_ornament.png?v=3"
          alt="Rose Ornament"
          className="w-48 object-contain -translate-y-4 opacity-90 drop-shadow-xs"
        />
      </div>

      {/* Floating Watercolor Petals in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {isMounted && Array.from({ length: 12 }).map((_, i) => {
          const delay = i * 1.5;
          const duration = 8 + Math.random() * 6;
          const left = `${Math.random() * 100}%`;
          const size = 15 + Math.random() * 20;
          return (
            <motion.div
              key={i}
              initial={{ top: '-10%', left, opacity: 0, rotate: 0 }}
              animate={{
                top: '110%',
                opacity: [0, 0.7, 0.7, 0],
                rotate: 360,
                x: [0, (Math.random() - 0.5) * 150]
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'linear'
              }}
              className="absolute bg-rose-200/40"
              style={{
                width: size,
                height: size,
                borderRadius: '60% 40% 55% 45% / 60% 40% 60% 40%',
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3)'
              }}
            />
          );
        })}
      </div>

      {/* Header / Navbar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 select-none z-10">
        <div className="flex items-center gap-1.5 font-serif font-bold text-lg text-[#7c5e49]">
          <span>🌸</span>
          <span className="tracking-wide">Bloom Gift</span>
        </div>
        <Link
          href="/edit"
          className="text-xs font-semibold px-4 py-2.5 rounded-full border border-[#eedcc5] bg-white/60 hover:bg-white text-stone-700 transition-colors shadow-xs"
        >
          Mulai Buat
        </Link>
      </header>

      {/* Hero Content Section */}
      <main className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-8 select-none z-10 py-12 px-4">
        {/* Ornate Flower Ring / Watercolor Rose representation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-100 to-pink-50 flex items-center justify-center border border-rose-200/30 shadow-inner relative"
        >
          <span className="text-4xl">🌸</span>
          <div className="absolute -top-1 -right-1 text-xs animate-ping">✨</div>
        </motion.div>

        <div className="space-y-4">
          <h1 className="font-garamond italic text-5xl md:text-6xl font-bold tracking-tight text-[#7c5e49] leading-tight">
            Rangkai Kejutan Cinta<br />
            <span className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-600 bg-clip-text text-transparent font-sans not-italic font-extrabold">
              Dalam Mekar Bunga
            </span>
          </h1>
          
          <p className="font-garamond italic text-xl md:text-2xl text-[#a48c82] font-semibold">
            "Kado kecil, rasanya panjang."
          </p>
        </div>

        <p className="text-sm md:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
          Bungkus pesan cinta, foto kenangan, dan lagu pengiring favorit Anda ke dalam kejutan animasi mekar yang elegan. Kado rahasia digital terindah untuk orang tersayang.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center pt-2">
          <Link
            href="/edit"
            className="flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-rose-200 transition-all hover:scale-[1.03] active:scale-[0.97] text-center"
          >
            Buat Kado Kejutan ✨
          </Link>
          <Link
            href="/g/untuk-nara"
            className="flex-1 py-4 px-6 rounded-full border border-stone-200 bg-white/70 backdrop-blur-xs hover:bg-white text-stone-700 font-semibold text-sm transition-all hover:scale-[1.03] active:scale-[0.97] text-center shadow-xs"
          >
            Buka Contoh Demo 🎁
          </Link>
        </div>

        {/* Floating Demo Key Instruction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 bg-white/50 border border-[#eedcc5]/50 px-4 py-2.5 rounded-full shadow-xs backdrop-blur-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>Petunjuk Demo: Klik "Buka Contoh Demo" & Masukkan PIN <strong className="text-rose-600">1206</strong></span>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-stone-400 text-xs border-t border-[#eedcc5]/30 select-none z-10">
        © 2026 Bloom Gift Studio. Inspirasi dari Laubloom.
      </footer>
    </div>
  );
}
