'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, ChevronRight, Check, Heart, Loader2 } from 'lucide-react';
import { ConfessionConfig } from '@/data/mockGifts';

interface ConfessionStageProps {
  confession?: ConfessionConfig;
  senderName?: string;
  recipientName?: string;
  onComplete: () => void;
}

type Substage = 
  | 'WAX_SEAL'
  | 'WHISPERS'
  | 'SCROLL'
  | 'DECISION'
  | 'SCANNER'
  | 'CERTIFICATE';

const DEFAULT_CONFESSION: ConfessionConfig = {
  whispers: [
    "Aku nggak tahu ini kelihatan berani atau nekat, tapi aku mau jujur.",
    "Kamu tuh punya bakat bikin hari biasa jadi kerasa lucu sendiri.",
    "Aku suka cara kamu hadir, bahkan pas cuma lewat chat singkat.",
    "Jadi kalau akhir-akhir ini aku agak salting, ya... tersangkanya kamu.",
    "Oke, tarik napas dulu. Habis ini ada pertanyaan penting."
  ],
  scrollMessage: `Dear Kamu,\n\nAku nggak mau bikin ini kaku kayak pidato. Intinya, aku nyaman banget sama kamu. Cara kamu ketawa, cara kamu balas hal kecil, semuanya bikin aku pengin lebih sering ada di cerita kamu.\n\nJadi kalau kamu juga mau, aku pengin kita coba jalan bareng. Pelan-pelan aja, tapi beneran.`,
  question: "Mau jadi pacarku?",
  yesLabel: "Iya, gas! 💖",
  noLabel: "Mikir dulu... 🥺",
  certificateTitle: "Sertifikat Jadi Kita",
  certificateBody: "Dengan ini kita resmi boleh saling bikin salting, saling kabarin, dan pelan-pelan punya cerita yang cuma kita yang paham. Dari Aku, buat Kamu."
};

export default function ConfessionStage({ 
  confession = DEFAULT_CONFESSION, 
  senderName = "Aku",
  recipientName = "Kamu",
  onComplete 
}: ConfessionStageProps) {
  const [substage, setSubstage] = useState<Substage>('WAX_SEAL');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  
  // Whisper cards state
  const [whisperIdx, setWhisperIdx] = useState(0);
  
  // Scroll unroll state
  const [isScrollOpen, setIsScrollOpen] = useState(false);
  
  // Decision state
  const [noClicks, setNoClicks] = useState(0);
  
  // Scanner state
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('TAP_TO_SCAN'); // TAP_TO_SCAN, SCANNING, SUCCESS
  const [scanMessage, setScanMessage] = useState('Sentuh pemindai sidik jari di bawah...');

  // PERSUASIVE MESSAGES for "Mikir Dulu" button clicks
  const noButtonMessages = [
    "Pilih salah satu jawaban di bawah...",
    "Waduh, tombol ini cuma buat pemanasan ya?",
    "Gapapa, aku kasih waktu. Tapi tombol iya lagi dadah-dadah tuh.",
    "Aku pura-pura kuat dulu. Coba pikirin sekali lagi.",
    "Oke, terakhir. Setelah ini tombol iya makin susah diabaikan."
  ];

  // Scan progress handler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanStatus === 'SCANNING') {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStatus('SUCCESS');
            setScanMessage('♥ ♥ ♥ STATUS: DITERIMA ♥ ♥ ♥');
            setTimeout(() => {
              setSubstage('CERTIFICATE');
            }, 1800);
            return 100;
          }
          const next = prev + 4;
          if (next > 75) {
            setScanMessage('Hampir selesai... status aman!');
          } else if (next > 40) {
            setScanMessage('Mengecek kadar salting...');
          } else {
            setScanMessage('Memindai jawaban...');
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [scanStatus]);

  const handleNextWhisper = () => {
    if (whisperIdx < confession.whispers.length - 1) {
      setWhisperIdx(prev => prev + 1);
    } else {
      setSubstage('SCROLL');
    }
  };

  const handleNoClick = () => {
    setNoClicks(prev => Math.min(prev + 1, 4));
  };

  const handleStartScan = () => {
    setSubstage('SCANNER');
    setScanStatus('SCANNING');
    setScanProgress(0);
  };

  const formattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('id-ID', options);
  };

  return (
    <div className="w-full max-w-md p-4 flex flex-col justify-center items-center min-h-[500px]">
      {/* Global Style Injector for Caveat font and lined paper */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
        .font-caveat {
          font-family: 'Caveat', cursive;
        }
        .lined-paper-envelope {
          background-color: #faf6f0;
          background-image: linear-gradient(rgba(219, 119, 128, 0.04) 1.2px, transparent 1.2px);
          background-size: 100% 24px;
          background-position: 0 12px;
        }
        .lined-paper-whisper {
          background-color: #fcf8f2;
          background-image: linear-gradient(rgba(219, 119, 128, 0.05) 1.5px, transparent 1.5px);
          background-size: 100% 28px;
          background-position: 0 16px;
        }
      `}</style>
      
      {substage === 'WAX_SEAL' && (
        <motion.div
          key="wax-seal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full flex flex-col items-center justify-center space-y-6 min-h-[440px] px-4"
        >
          {/* Top text instructions (laubloom style header) */}
          <div className="text-center px-4 select-none space-y-3 mb-2 flex flex-col items-center">
            <h1 className="font-caveat text-xl font-bold text-[#5c4a3e] leading-[1.15] tracking-wide select-none">
              Eh, aku mau<br />ngomong sesuatu
            </h1>
            <div className="text-[#a48c82] text-xs leading-relaxed font-sans max-w-[280px]">
              Tap seal ini sekali aja. Tenang, ini bukan spam,<br />cuma aku yang lagi berani.
            </div>
          </div>

          {/* Envelope Main Container */}
          <div className="relative w-[240px] h-[160px] flex items-center justify-center select-none my-4">
            
            {/* 1. Envelope Back Pocket */}
            <div className="absolute inset-0 bg-[#f8eff0] border border-[#eadae0] rounded-xl shadow-md overflow-hidden z-0" />
            
            {/* 2. Sliding Card (Starts hidden in pocket, slides up) */}
            <motion.div
              initial={{ y: 8, opacity: 0, scale: 0.95 }}
              animate={isEnvelopeOpen ? { y: -105, opacity: 1, scale: 1 } : { y: 8, opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.0, delay: 0.6, ease: "easeOut" }}
              className="absolute w-[200px] h-[120px] rounded-xl shadow-lg lined-paper-envelope z-10 flex flex-col justify-center items-center border border-[#eae2d5] p-4 cursor-pointer"
            >
              <div className="text-center flex flex-col justify-center items-center">
                <span className="font-caveat text-2xl font-bold text-[#5c4a3e]">
                  buka dulu ya
                </span>
                <span className="text-[9px] font-bold text-[#a48c82]/85 tracking-widest uppercase mt-1">
                  ada sesuatu di dalamnya
                </span>
              </div>
            </motion.div>

            {/* 3. Top Flap (Animated folding path) */}
            <motion.div
              className="absolute inset-x-0 top-0 w-full h-[160px] pointer-events-none"
              animate={{ zIndex: isEnvelopeOpen ? 5 : 25 }}
              transition={{ delay: isEnvelopeOpen ? 0.6 : 0 }}
            >
              <svg 
                className="w-full h-full overflow-visible drop-shadow-sm" 
                viewBox="0 0 240 160"
                style={{ clipPath: isEnvelopeOpen ? "none" : "inset(0px round 12px)" }}
              >
                <motion.path
                  d={isEnvelopeOpen ? "M 0 0 L 120 -90 L 240 0" : "M 0 0 L 120 95 L 240 0"}
                  fill="#fcf8f8"
                  stroke="#ebdadd"
                  strokeWidth="0.8"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            {/* 4. Envelope Front Bottom Flaps (Left, Right, Center) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
              <svg 
                className="w-full h-full drop-shadow-sm" 
                viewBox="0 0 240 160"
                style={{ clipPath: "inset(0px round 12px)" }}
              >
                {/* Left Flap */}
                <path d="M 0 0 L 120 95 L 0 160 Z" fill="#fcf8f8" stroke="#ebdadd" strokeWidth="0.8" />
                {/* Right Flap */}
                <path d="M 240 0 L 120 95 L 240 160 Z" fill="#fcf8f8" stroke="#ebdadd" strokeWidth="0.8" />
                {/* Bottom Flap */}
                <path d="M 0 160 L 240 160 L 120 95 Z" fill="#fdfbf8" stroke="#eadae0" strokeWidth="0.8" />
                {/* Lip Border */}
                <path d="M 0 160 L 120 95 L 240 160" fill="none" stroke="#dca4ad" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* 5. Wax Seal Button (Irregular 3D shape) */}
            <motion.button
              type="button"
              onClick={() => {
                setIsEnvelopeOpen(true);
                setTimeout(() => {
                  setSubstage('WHISPERS');
                }, 2000);
              }}
              disabled={isEnvelopeOpen}
              animate={isEnvelopeOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute top-[63px] left-[88px] w-16 h-16 cursor-pointer z-30 flex items-center justify-center active:scale-95 transition-transform"
              style={{
                borderRadius: '48% 52% 45% 55% / 50% 48% 52% 50%',
                background: 'radial-gradient(circle at 35% 35%, #e0a2ac 0%, #cc808b 30%, #a6515c 80%, #7d333c 100%)',
                boxShadow: '2px 4px 8px rgba(0,0,0,0.3), inset 2px 2px 3px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(0,0,0,0.3)',
                border: '1px solid #d48f99'
              }}
            >
              <div 
                className="w-[72%] h-[72%] flex items-center justify-center"
                style={{
                  borderRadius: '50% 48% 52% 48% / 48% 52% 48% 52%',
                  background: 'radial-gradient(circle at 30% 30%, #cc808b 0%, #b26570 70%, #8c3f48 100%)',
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.45), inset -1px -1px 2px rgba(255,255,255,0.2)'
                }}
              >
                <Heart className="w-5 h-5 text-white/90 fill-white/10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
              </div>
            </motion.button>

          </div>

          {/* Bottom text instructions */}
          <p className="text-[#a48c82]/90 text-[11px] select-none text-center italic font-sans max-w-[280px]">
            Tap sealnya. Surat kecilnya bakal kebuka sendiri.
          </p>
        </motion.div>
      )}

      {/* 2. WHISPER CARDS SUBSTAGE */}
      {substage === 'WHISPERS' && (
        <motion.div
          key="whispers"
          initial={{ opacity: 0, rotate: 1, scale: 0.95 }}
          animate={{ opacity: 1, rotate: -1.5, scale: 1 }}
          exit={{ opacity: 0, rotate: 1, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-full max-w-[290px] aspect-[4/5] lined-paper-whisper p-6 rounded-[28px] shadow-xl relative flex flex-col justify-between items-center overflow-hidden border border-[#eae2d5] select-none"
        >

          {/* Top-Left Floral Deco */}
          <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none select-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 0 0 C 15 20, 25 35, 40 45" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 12 18 C 10 26, 18 26, 18 18 C 18 10, 10 10, 12 18 Z" fill="#a8c19c" opacity="0.85" />
              <path d="M 28 32 C 24 38, 32 38, 32 32 C 32 26, 24 26, 28 32 Z" fill="#a8c19c" opacity="0.85" />
              <circle cx="15" cy="12" r="5" fill="#db9ba3" />
              <circle cx="12" cy="15" r="4" fill="#db9ba3" />
              <circle cx="17" cy="17" r="4" fill="#db9ba3" />
              <circle cx="28" cy="27" r="6" fill="#db9ba3" />
              <circle cx="34" cy="28" r="4" fill="#db9ba3" />
              <circle cx="15" cy="15" r="2.2" fill="#fff" />
              <circle cx="31" cy="28" r="2.2" fill="#fff" />
            </svg>
          </div>

          {/* Bottom-Right Floral Deco */}
          <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none select-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 100 100 C 80 80, 65 65, 55 45" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 85 80 C 75 80, 75 72, 85 72 C 95 72, 95 80, 85 80 Z" fill="#a8c19c" opacity="0.85" />
              <path d="M 68 60 C 58 60, 58 52, 68 52 C 78 52, 78 60, 68 60 Z" fill="#a8c19c" opacity="0.85" />
              <circle cx="82" cy="82" r="9" fill="#db9ba3" />
              <circle cx="76" cy="85" r="8" fill="#e5abb3" />
              <circle cx="85" cy="88" r="7" fill="#e5abb3" />
              <circle cx="88" cy="80" r="8" fill="#db9ba3" />
              <circle cx="82" cy="83" r="3" fill="#fff" />
              <circle cx="58" cy="52" r="5" fill="#db9ba3" />
              <circle cx="50" cy="45" r="3.5" fill="#e5abb3" />
            </svg>
          </div>

          {/* Card Header (Cursive progress) */}
          <div className="text-center pt-2">
            <span className="font-caveat text-lg text-[#db7780] tracking-wide italic">
              bisik-bisik {whisperIdx + 1}/{confession.whispers.length}
            </span>
          </div>

          {/* Card Text Content */}
          <div className="flex-1 flex items-center justify-center px-2 py-2 z-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={whisperIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="font-caveat text-[22px] leading-[30px] text-[#5c4a3e] text-center font-bold tracking-wide"
              >
                {confession.whispers[whisperIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Navigation (Centered Dusty Pink Button) */}
          <div className="pb-3 z-10 w-full flex justify-center">
            <button
              onClick={handleNextWhisper}
              className="py-2 px-8 rounded-full bg-[#c47c85] hover:bg-[#b56f77] text-white text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 duration-200"
            >
              {whisperIdx === confession.whispers.length - 1 ? 'Buka suratnya' : 'Lanjut, aku siap'}
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. SCROLL LETTER SUBSTAGE */}
      {substage === 'SCROLL' && (
        <motion.div
          key="scroll-stage"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="w-full flex flex-col items-center justify-center space-y-6 select-none"
        >
          {/* Scroll Container */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Scroll Body Wrapper */}
            <motion.div
              animate={{ 
                height: isScrollOpen ? 380 : 80,
                width: 290
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden cursor-pointer"
              onClick={!isScrollOpen ? () => setIsScrollOpen(true) : undefined}
            >
              {/* Paper Background between the rolls */}
              <motion.div
                animate={{ 
                  height: isScrollOpen ? 356 : 56
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[12px] left-[5px] right-[5px] bg-[#faf6f0] border-l border-r border-[#eadae0] lined-paper-whisper shadow-inner overflow-hidden"
              >
                {/* Lined paper visual wrapper */}
                <div className="w-full h-full p-4 relative flex flex-col justify-between">
                  
                  {/* Floral Deco Bottom-Right (shows when open) */}
                  {isScrollOpen && (
                    <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-45 select-none z-0">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <path d="M 100 100 C 80 80, 65 65, 55 45" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        <path d="M 85 80 C 75 80, 75 72, 85 72 C 95 72, 95 80, 85 80 Z" fill="#a8c19c" opacity="0.85" />
                        <path d="M 68 60 C 58 60, 58 52, 68 52 C 78 52, 78 60, 68 60 Z" fill="#a8c19c" opacity="0.85" />
                        <circle cx="82" cy="82" r="9" fill="#db9ba3" />
                        <circle cx="76" cy="85" r="8" fill="#e5abb3" />
                        <circle cx="85" cy="88" r="7" fill="#e5abb3" />
                        <circle cx="88" cy="80" r="8" fill="#db9ba3" />
                        <circle cx="82" cy="83" r="3" fill="#fff" />
                        <circle cx="58" cy="52" r="5" fill="#db9ba3" />
                        <circle cx="50" cy="45" r="3.5" fill="#e5abb3" />
                      </svg>
                    </div>
                  )}

                  {/* Closed Content: Wax Seal showing inside */}
                  {!isScrollOpen && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Realistic 3D Mini Wax Seal */}
                      <div
                        className="w-10 h-10 flex items-center justify-center animate-pulse"
                        style={{
                          borderRadius: '48% 52% 45% 55% / 50% 48% 52% 50%',
                          background: 'radial-gradient(circle at 35% 35%, #e0a2ac 0%, #cc808b 30%, #a6515c 80%, #7d333c 100%)',
                          boxShadow: '1px 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(0,0,0,0.3)',
                          border: '1.2px solid #d48f99'
                        }}
                      >
                        <div 
                          className="w-[70%] h-[70%] flex items-center justify-center"
                          style={{
                            borderRadius: '50% 48% 52% 48% / 48% 52% 48% 52%',
                            background: 'radial-gradient(circle at 30% 30%, #cc808b 0%, #b26570 70%, #8c3f48 100%)',
                            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.45)'
                          }}
                        >
                          <Heart className="w-3 h-3 text-white/90 fill-white/10" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Open Content: Text message & next button */}
                  {isScrollOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="w-full h-full flex flex-col justify-between z-10"
                    >
                      {/* Scroll Header */}
                      <div className="text-center pt-2 space-y-1">
                        <span className="font-caveat text-sm text-[#c47c85] tracking-wide block italic font-semibold">
                          dari {senderName}
                        </span>
                        <h2 className="font-caveat text-xl font-bold text-[#5c4a3e] leading-snug">
                          Oke, ini bagian seriusnya dikit
                        </h2>
                      </div>

                      {/* Letter Scrollable Body */}
                      <div className="flex-1 my-3 overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-stone-200">
                        <p className="font-caveat text-lg leading-[24px] text-[#5c4a3e] whitespace-pre-line font-bold pl-2">
                          {confession.scrollMessage}
                        </p>
                      </div>

                      {/* Navigation Button */}
                      <div className="flex justify-center pb-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubstage('DECISION');
                          }}
                          className="py-2 px-8 rounded-full bg-[#c47c85] hover:bg-[#b56f77] text-white text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 duration-200"
                        >
                          Oke, lanjut
                        </button>
                      </div>
                    </motion.div>
                  )}

                </div>
              </motion.div>

              {/* 3D Top Cylinder Roll */}
              <div 
                className="absolute top-0 left-0 right-0 h-[24px] z-20 flex items-center justify-between"
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(to bottom, #eae0e2 0%, #ffffff 30%, #ffffff 50%, #d8bfc3 85%, #bfa2a7 100%)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.16), inset 0 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                {/* Left/Right caps of the roll */}
                <div className="w-[8px] h-full rounded-full bg-[#a38287] shadow-inner" />
                <div className="w-[8px] h-full rounded-full bg-[#a38287] shadow-inner" />
              </div>

              {/* 3D Bottom Cylinder Roll */}
              <motion.div 
                animate={{ 
                  top: isScrollOpen ? 356 : 56
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 h-[24px] z-20 flex items-center justify-between"
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(to bottom, #bfa2a7 0%, #d8bfc3 15%, #ffffff 50%, #ffffff 70%, #eae0e2 100%)',
                  boxShadow: '0 -3px 6px rgba(0,0,0,0.16), inset 0 -1px 2px rgba(255,255,255,0.6)'
                }}
              >
                {/* Left/Right caps of the roll */}
                <div className="w-[8px] h-full rounded-full bg-[#a38287] shadow-inner" />
                <div className="w-[8px] h-full rounded-full bg-[#a38287] shadow-inner" />
              </motion.div>

            </motion.div>

            {/* Instruction helper text underneath (shows only when closed) */}
            {!isScrollOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center pt-2"
              >
                <p className="font-caveat text-2xl font-bold text-[#5c4a3e] tracking-wide animate-pulse">
                  tap buat buka surat
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* 4. DECISION SUBSTAGE */}
      {substage === 'DECISION' && (
        <motion.div
          key="decision"
          initial={{ opacity: 0, rotate: -1, scale: 0.95 }}
          animate={{ opacity: 1, rotate: 1, scale: 1 }}
          exit={{ opacity: 0, rotate: -1, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-full max-w-[320px] min-h-[360px] aspect-square bg-[#faf6f0] lined-paper-whisper p-6 rounded-[28px] shadow-xl relative flex flex-col justify-between items-center border border-[#eae2d5] select-none"
        >
          {/* Top-Left Floral Deco */}
          <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none select-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 0 0 C 15 20, 25 35, 40 45" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 12 18 C 10 26, 18 26, 18 18 C 18 10, 10 10, 12 18 Z" fill="#a8c19c" opacity="0.85" />
              <path d="M 28 32 C 24 38, 32 38, 32 32 C 32 26, 24 26, 28 32 Z" fill="#a8c19c" opacity="0.85" />
              <circle cx="15" cy="12" r="5" fill="#db9ba3" />
              <circle cx="12" cy="15" r="4" fill="#db9ba3" />
              <circle cx="17" cy="17" r="4" fill="#db9ba3" />
              <circle cx="28" cy="27" r="6" fill="#db9ba3" />
              <circle cx="34" cy="28" r="4" fill="#db9ba3" />
              <circle cx="15" cy="15" r="2.2" fill="#fff" />
              <circle cx="31" cy="28" r="2.2" fill="#fff" />
            </svg>
          </div>

          {/* Bottom-Right Floral Deco */}
          <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none select-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path d="M 100 100 C 80 80, 65 65, 55 45" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 85 80 C 75 80, 75 72, 85 72 C 95 72, 95 80, 85 80 Z" fill="#a8c19c" opacity="0.85" />
              <path d="M 68 60 C 58 60, 58 52, 68 52 C 78 52, 78 60, 68 60 Z" fill="#a8c19c" opacity="0.85" />
              <circle cx="82" cy="82" r="9" fill="#db9ba3" />
              <circle cx="76" cy="85" r="8" fill="#e5abb3" />
              <circle cx="85" cy="88" r="7" fill="#e5abb3" />
              <circle cx="88" cy="80" r="8" fill="#db9ba3" />
              <circle cx="82" cy="83" r="3" fill="#fff" />
              <circle cx="58" cy="52" r="5" fill="#db9ba3" />
              <circle cx="50" cy="45" r="3.5" fill="#e5abb3" />
            </svg>
          </div>

          {/* Subtitle Header */}
          <div className="text-center pt-3 z-10">
            <span className="font-caveat text-lg text-[#c47c85] tracking-wide font-bold italic">
              mini mission buat {recipientName}
            </span>
          </div>

          {/* Question & Persuasive Warning */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 z-10 space-y-3">
            <h2 className="font-caveat text-[28px] leading-tight text-[#5c4a3e] text-center font-bold tracking-wide">
              {confession.question}
            </h2>
            {noClicks > 0 && (
              <p className="font-caveat text-lg text-[#c47c85] font-bold text-center leading-snug animate-pulse max-w-[240px]">
                {noButtonMessages[noClicks]}
              </p>
            )}
          </div>

          {/* Yes and No Buttons (Side-by-Side) */}
          <div className="pb-6 w-full flex items-center justify-center gap-4 z-10 px-2">
            {/* Yes Button (Grows on No click) */}
            <motion.button
              onClick={handleStartScan}
              animate={{ scale: 1 + noClicks * 0.22 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="py-2.5 px-6 rounded-full bg-[#c47c85] hover:bg-[#b56f77] text-white text-xs font-semibold shadow-md active:scale-95 duration-100 origin-center min-w-[95px] text-center whitespace-nowrap"
            >
              {confession.yesLabel}
            </motion.button>

            {/* No Button (Disappears after 4 clicks) */}
            {noClicks < 4 && (
              <button
                onClick={handleNoClick}
                className="py-2.5 px-6 rounded-full border border-[#eadae0] bg-white/95 hover:bg-[#fbf9f6] text-[#5c4a3e] text-xs font-semibold shadow-sm active:scale-95 transition-all min-w-[95px] text-center whitespace-nowrap"
              >
                {confession.noLabel}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* 5. RADAR SCANNER SUBSTAGE */}
      {substage === 'SCANNER' && (
        <motion.div
          key="scanner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full flex flex-col items-center justify-center space-y-6"
        >
          {/* Header */}
          <div className="space-y-2 select-none flex flex-col items-center text-center">
            <div className="text-[10px] font-bold text-[#c47c85] uppercase tracking-widest font-sans">FINAL CHECK</div>
            <h3 className="font-caveat text-4xl font-bold text-[#5c4a3e] leading-[1.15]">scan dulu biar sah</h3>
            <div className="text-[#a48c82] text-xs leading-relaxed font-sans max-w-[280px]">
              Jawaban Kamu masuk ruang pemeriksaan.<br />
              Kalau cahayanya selesai, sertifikatnya langsung keluar.
            </div>
          </div>

          {/* Scanner Outer Device Box */}
          <div className="w-[220px] h-[220px] p-3.5 bg-[#fdfbf8] border border-[#eadae0] rounded-[36px] shadow-lg flex items-center justify-center relative my-2">
            {/* Inner Red Screen */}
            <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-[#c82236] to-[#700c19] relative flex flex-col items-center justify-between py-6 px-4 overflow-hidden shadow-inner">
              
              {/* Laser light line (animating top to bottom during scan) */}
              {scanStatus === 'SCANNING' && (
                <motion.div
                  initial={{ top: "5%" }}
                  animate={{ top: ["5%", "90%", "5%"] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-1.5 bg-rose-300/90 shadow-[0_0_12px_#fda4af,0_0_4px_#fda4af] z-20 pointer-events-none"
                />
              )}

              {/* Ornate 3D Heart Wax Seal */}
              <svg 
                width="104" 
                height="96" 
                viewBox="0 0 120 110" 
                className="drop-shadow-md z-10 transition-transform active:scale-95 cursor-pointer mt-1"
                onClick={scanStatus === 'TAP_TO_SCAN' ? handleStartScan : undefined}
              >
                <defs>
                  <radialGradient id="heartOuterGrad" cx="35%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#e8b2b9" />
                    <stop offset="40%" stopColor="#db9ba3" />
                    <stop offset="90%" stopColor="#b86b76" />
                    <stop offset="100%" stopColor="#964b55" />
                  </radialGradient>
                  <radialGradient id="heartInnerGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ebaeb7" />
                    <stop offset="70%" stopColor="#c87b86" />
                    <stop offset="100%" stopColor="#9c4c57" />
                  </radialGradient>
                </defs>
                {/* Outer Wax Heart base */}
                <path 
                  d="M60,15 C40,-10 0,5 0,45 C0,80 60,110 60,110 C60,110 120,80 120,45 C120,5 80,-10 60,15 Z" 
                  fill="url(#heartOuterGrad)" 
                />
                {/* Ornate Leaf swirls on the left/right borders */}
                <path d="M 22 45 C 22 30, 48 30, 48 45 C 48 55, 60 65, 60 75" fill="none" stroke="#f2d2d6" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 98 45 C 98 30, 72 30, 72 45 C 72 55, 60 65, 60 75" fill="none" stroke="#f2d2d6" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
                {/* Inner Heart stamp shape */}
                <path 
                  d="M60,25 C45,5 15,18 15,50 C15,78 60,100 60,100 C60,100 105,78 105,50 C105,18 75,5 60,25 Z" 
                  fill="url(#heartInnerGrad)" 
                />
              </svg>

              {/* Tap button */}
              <button
                onClick={scanStatus === 'TAP_TO_SCAN' ? handleStartScan : undefined}
                disabled={scanStatus !== 'TAP_TO_SCAN'}
                className="px-6 py-1.5 bg-white rounded-full text-[#700c19] text-[10px] font-bold tracking-widest shadow-md uppercase select-none active:scale-95 transition-transform z-30 font-sans"
              >
                {scanStatus === 'SCANNING' ? 'SCANNING...' : scanStatus === 'SUCCESS' ? 'SUCCESS! 💖' : 'TAP TO SCAN'}
              </button>

            </div>
          </div>

          {/* Progress bar and Messages */}
          <div className="space-y-2.5 w-full max-w-[220px] text-center">
            {scanStatus === 'SCANNING' && (
              <div className="w-full bg-[#f5ebe6] h-1.5 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                  className="h-full bg-[#c47c85]"
                />
              </div>
            )}
            <p className="text-[#a48c82] text-xs font-semibold animate-pulse leading-snug px-2 min-h-[18px] font-sans">
              {scanStatus === 'TAP_TO_SCAN' ? 'Sentuh pemindai sidik jari di atas...' : scanMessage}
            </p>
          </div>
        </motion.div>
      )}

      {/* 6. CERTIFICATE SUBSTAGE */}
      {substage === 'CERTIFICATE' && (
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          <motion.div
            key="certificate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[320px] min-h-[460px] bg-[#faf6f0] lined-paper-whisper p-6 rounded-[28px] shadow-xl relative flex flex-col justify-between items-center border border-[#eae2d5] select-none"
          >
            {/* Top-Right Confetti Ornament */}
            <div className="absolute top-2 right-2 w-16 h-16 pointer-events-none select-none z-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path d="M 90 10 C 80 15, 85 25, 75 30 C 65 35, 70 45, 60 50" fill="none" stroke="#b08bb4" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                <path d="M 95 25 C 88 32, 90 40, 82 45 C 75 50, 78 58, 70 65" fill="none" stroke="#db9ba3" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
                <circle cx="85" cy="15" r="3" fill="#f5d59e" />
                <circle cx="68" cy="28" r="2.5" fill="#a8c19c" />
                <polygon points="75,8 77,11 80,11 78,13 79,16 76,14 73,16 74,13 72,11 75,11" fill="#f5d59e" />
                <polygon points="62,40 63,42 65,42 64,43 64,45 62,44 60,45 61,43 60,42 62,42" fill="#db9ba3" />
              </svg>
            </div>

            {/* Bottom-Left Floral Deco */}
            <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none opacity-95 select-none z-0">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path d="M 0 100 C 20 80, 35 65, 45 55" stroke="#9bb591" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                <path d="M 15 80 C 25 80, 25 72, 15 72 C 5 72, 5 80, 15 80 Z" fill="#a8c19c" opacity="0.85" />
                <path d="M 32 60 C 42 60, 42 52, 32 52 C 22 52, 22 60, 32 60 Z" fill="#a8c19c" opacity="0.85" />
                {/* Roses */}
                <circle cx="18" cy="18" r="9" fill="#db9ba3" transform="translate(0, 64)" />
                <circle cx="24" cy="15" r="8" fill="#e5abb3" transform="translate(0, 64)" />
                <circle cx="15" cy="12" r="7" fill="#e5abb3" transform="translate(0, 64)" />
                <circle cx="12" cy="20" r="8" fill="#db9ba3" transform="translate(0, 64)" />
                <circle cx="18" cy="17" r="3" fill="#fff" transform="translate(0, 64)" />
                
                <circle cx="42" cy="48" r="5" fill="#db9ba3" transform="translate(-10, 30)" />
                <circle cx="50" cy="55" r="3.5" fill="#e5abb3" transform="translate(-10, 30)" />
              </svg>
            </div>

            {/* Header */}
            <div className="text-center pt-3 z-10 space-y-1">
              <span className="font-caveat text-sm text-[#c47c85] tracking-wide font-bold italic">
                hasil scan: valid
              </span>
              <h2 className="font-caveat text-3xl font-bold text-[#5c4a3e] leading-snug">
                {confession.certificateTitle}
              </h2>
            </div>

            {/* Certificate Declaration Statement */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 z-10 text-center space-y-4">
              <p className="font-caveat text-[18px] leading-[25px] text-[#5c4a3e] font-bold">
                {(() => {
                  const text = confession.certificateBody || "";
                  const idx = text.toLowerCase().indexOf("dari");
                  return idx !== -1 ? text.substring(0, idx).trim() : text;
                })()}
              </p>

              {/* Circular Distressed Ink Stamp SVG */}
              <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto my-1 drop-shadow-xs">
                <defs>
                  {/* Distressed / Ink Bleed SVG filter */}
                  <filter id="inkStampFilter" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                    <feGaussianBlur in="displaced" stdDeviation="0.4" />
                  </filter>
                </defs>
                
                {/* Stamp Group with Filter applied */}
                <g filter="url(#inkStampFilter)" fill="none" stroke="#d66874" strokeWidth="2" opacity="0.8">
                  {/* Outer rough circular border */}
                  <circle cx="50" cy="50" r="44" strokeWidth="2.5" />
                  {/* Inner thin circle */}
                  <circle cx="50" cy="50" r="38" strokeWidth="1" />
                  {/* Inner decorative dotted ring */}
                  <circle cx="50" cy="50" r="34" strokeWidth="1.2" strokeDasharray="3 3" />
                  
                  {/* Ornate Heart in Center */}
                  <path 
                    d="M 50 34 C 44 22, 25 28, 25 44 C 25 58, 50 72, 50 72 C 50 72, 75 58, 75 44 C 75 28, 56 22, 50 34 Z" 
                    strokeWidth="2.5"
                  />
                  
                  {/* Sprouting plant/flourish inside the heart */}
                  <path d="M 50 70 L 50 56" strokeWidth="2" />
                  <path d="M 50 56 C 45 52, 40 45, 45 38" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 50 56 C 55 52, 60 45, 55 38" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 50 56 C 47 48, 53 48, 50 38" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Ornate leaves outside the heart (left and right) */}
                  <path d="M 24 54 C 20 62, 32 68, 40 68" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 76 54 C 80 62, 68 68, 60 68" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Tiny stars or dots inside stamp */}
                  <circle cx="28" cy="32" r="1" fill="#d66874" stroke="none" />
                  <circle cx="72" cy="32" r="1" fill="#d66874" stroke="none" />
                </g>
              </svg>

              {/* Dynamic Footer text */}
              <p className="font-sans text-xs text-[#a48c82] font-semibold leading-relaxed">
                {(() => {
                  const text = confession.certificateBody || "";
                  const idx = text.toLowerCase().indexOf("dari");
                  if (idx !== -1) {
                    let footer = text.substring(idx).trim();
                    
                    // Remove "screenshot..." instruction from footer text to avoid double styling
                    const ssIdx = footer.toLowerCase().indexOf("screenshot");
                    if (ssIdx !== -1) {
                      footer = footer.substring(0, ssIdx).trim();
                      footer = footer.replace(/[.,\s\-/]+$/, "").trim();
                    }

                    const lowerFooter = footer.toLowerCase();
                    if (!lowerFooter.includes("simpan baik-baik") && !lowerFooter.endsWith("ya.") && !lowerFooter.endsWith("ya")) {
                      footer += ". Simpan baik-baik ya.";
                    } else if (!footer.endsWith(".") && footer.length > 0) {
                      footer += ".";
                    }
                    return footer;
                  }
                  return `Dari ${senderName}, buat ${recipientName}. Simpan baik-baik ya.`;
                })()}
              </p>
            </div>

            {/* Screenshot info box */}
            <div className="w-full max-w-[240px] px-4 py-2 bg-[#c47c85]/5 border border-[#c47c85]/20 rounded-full text-[#c47c85] text-[10px] font-semibold text-center tracking-wide font-sans select-none z-10 my-2">
              Screenshot ini, terus kirim ke {senderName}.
            </div>

            {/* Action Trigger */}
            <div className="pb-3 w-full flex justify-center z-10">
              <button
                onClick={onComplete}
                className="py-2.5 px-8 rounded-full bg-[#c47c85] hover:bg-[#b56f77] text-white text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 duration-200 font-sans"
              >
                Lanjut ke bouquet
              </button>
            </div>
          </motion.div>

          {/* Reset Link (Ulang dari awal) */}
          <span
            onClick={() => {
              setIsEnvelopeOpen(false);
              setWhisperIdx(0);
              setIsScrollOpen(false);
              setNoClicks(0);
              setScanProgress(0);
              setScanStatus('TAP_TO_SCAN');
              setScanMessage('Sentuh pemindai sidik jari di atas...');
              setSubstage('WAX_SEAL');
            }}
            className="text-[#a48c82] hover:text-[#5c4a3e] underline text-xs font-sans mt-4 cursor-pointer select-none transition-colors"
          >
            Ulang dari awal
          </span>
        </div>
      )}

    </div>
  );
}
