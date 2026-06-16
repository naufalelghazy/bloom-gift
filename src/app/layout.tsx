import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ebGaramond, caveat, dancingScript } from "./fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bloom Gift — Kado Kecil, Rasanya Panjang 🌸",
  description: "Rangkai pesan cinta, kumpulkan kenangan foto, iringan lagu, dan bungkus dengan kejutan animasi mekar yang indah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} ${caveat.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
