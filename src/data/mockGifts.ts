export interface GiftContent {
  type: 'text' | 'image';
  body?: string;
  url?: string;
  caption?: string;
}

export interface GiftTheme {
  palette: 'pink' | 'red' | 'blue' | 'yellow' | 'white' | 'mixed' | 'custom';
  customColors?: {
    from: string;
    via?: string;
    to: string;
  };
  flowerStyle: string;
  fontFamily: string;
  cardStyle?: string;
}

export interface GiftSecurity {
  gateType: 'pin' | 'question' | 'none';
  passcode?: string;
  hint?: string;
  question?: string;
}

export interface ConfessionConfig {
  whispers: string[];
  scrollMessage: string;
  question: string;
  yesLabel: string;
  noLabel: string;
  certificateTitle: string;
  certificateBody: string;
  senderName?: string;
  recipientName?: string;
}

export interface GiftData {
  id: string;
  slug: string;
  status: 'draft' | 'active' | 'expired';
  templateId?: 'museum' | 'confession';
  theme: GiftTheme;
  security: GiftSecurity;
  musicUrl: string;
  intro: {
    title: string;
    subtitle: string;
  };
  content: GiftContent[];
  confession?: ConfessionConfig;
  finale: {
    message: string;
    subtitle?: string;
    bouquetType: string;
  };
  view_count?: number;
  opened_at?: string | null;
}

export const mockGifts: Record<string, GiftData> = {
  'untuk-nara': {
    id: 'gift_nara_123',
    slug: 'untuk-nara',
    status: 'active',
    theme: {
      palette: 'pink',
      flowerStyle: 'rose',
      fontFamily: 'font-serif',
      cardStyle: 'lined'
    },
    templateId: 'museum',
    security: {
      gateType: 'pin',
      passcode: '1206',
      hint: 'Tanggal jadian kita (format: DDMM)'
    },
    // Lagu instrumental lembut (Royalty-free)
    musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    intro: {
      title: 'Khusus untuk Naraa',
      subtitle: 'Dunia kecil kita yang mekar bersama'
    },
    content: [
      {
        type: 'text',
        body: 'Nara sayang, terima kasih ya sudah menemani langkahku sejauh ini. Setiap tawa, sedih, dan cerita kecil kita selalu tersimpan rapi.'
      },
      {
        type: 'image',
        url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        caption: 'Ini foto kenangan kencan pertama kita, kamu masih ingat?'
      },
      {
        type: 'text',
        body: 'Aku bersyukur sekali memilikimu. Semoga surat kecil ini bisa membuat harimu sedikit lebih cerah hari ini.'
      }
    ],
    finale: {
      message: 'Selamat Hari Jadi kita! Aku menyayangimu selalu, Nara.',
      bouquetType: 'pink_roses'
    }
  }
};
