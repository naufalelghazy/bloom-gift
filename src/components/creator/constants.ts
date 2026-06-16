import { GiftData } from '@/data/mockGifts';

export const PRESET_SONGS = [
  { name: 'Warm Acoustic Guitar (Morning)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Morning.mp3' },
  { name: 'Romantic Guitar & Cello (Evening)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening.mp3' },
  { name: 'Soft Piano Jazz Lofi (Late Night Radio)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Late%20Night%20Radio.mp3' },
  { name: 'Relaxing Acoustic & Piano (Pleasant Porridge)', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pleasant%20Porridge.mp3' }
];

export const PALETTES = [
  { id: 'pink', name: 'Pink Pastel', bg: 'bg-rose-100', text: 'text-rose-500' },
  { id: 'red', name: 'Warm Red', bg: 'bg-red-100', text: 'text-red-500' },
  { id: 'blue', name: 'Dreamy Blue', bg: 'bg-sky-100', text: 'text-sky-500' },
  { id: 'yellow', name: 'Bright Yellow', bg: 'bg-amber-100', text: 'text-amber-500' },
  { id: 'mixed', name: 'Soft Rainbow', bg: 'bg-gradient-to-r from-rose-100 via-indigo-100 to-amber-100', text: 'text-stone-600' },
  { id: 'custom', name: 'Kustom', bg: 'bg-gradient-to-tr from-rose-300 via-indigo-300 to-amber-300', text: 'text-stone-700' }
];

export const ANIMATIONS = [
  { id: 'rose', name: 'Mawar Mekar', desc: 'Animasi kelopak bunga klasik', icon: '🌸' },
  { id: 'heart', name: 'Detak Jantung', desc: 'Animasi hati yang berdenyut', icon: '❤️' },
  { id: 'fireworks', name: 'Kembang Api', desc: 'Pancaran cahaya meriah', icon: '✨' },
  { id: 'scroll', name: 'Surat Kerajaan', desc: 'Animasi gulungan naskah klasik', icon: '📜' },
  { id: 'envelope', name: 'Amplop Kerajaan', desc: 'Buka surat dengan segel lilin merah', icon: '✉️' }
];

export const CARD_THEMES = [
  { id: 'lined', name: 'Buku Catatan', desc: 'Bergaris manis dengan mawar', icon: '📝' },
  { id: 'parchment', name: 'Kertas Klasik', desc: 'Vintage dengan daun emas', icon: '📜' },
  { id: 'midnight', name: 'Galaksi Malam', desc: 'Indigo dengan bintang', icon: '🌌' },
  { id: 'sakura', name: 'Musim Sakura', desc: 'Pink dengan bunga sakura', icon: '🌸' },
  { id: 'eucalyptus', name: 'Sage Minimalis', desc: 'Tenang dengan eucalyptus', icon: '🌿' }
];

export const BOUQUETS = [
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
];

export const DEFAULT_GIFT_DATA: GiftData = {
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
    subtitle: 'Untukmu, yang selalu hadir.',
    bouquetType: 'pink_roses'
  }
};
