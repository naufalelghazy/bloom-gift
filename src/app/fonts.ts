import { EB_Garamond, Caveat, Dancing_Script } from 'next/font/google';

export const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-garamond',
});

export const caveat = Caveat({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

export const dancingScript = Dancing_Script({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing-script',
});
