import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "EcoNotes | Intelligent AI Audio Transcription",
  description: "Transform your voice into organized notes with EcoNotes. High-precision AI transcription, multi-language support, and seamless audio recording for professionals and students.",
  keywords: ["AI transcription", "audio to text", "EcoNotes", "voice notes", "speech recognition", "bengali transcription"],
  openGraph: {
    title: "EcoNotes | Intelligent AI Audio Transcription",
    description: "Transform your voice into organized notes instantly with EcoNotes. Fast, accurate, and secure.",
    url: "https://econotes.moinul4u.com",
    siteName: "EcoNotes",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoNotes | Intelligent AI Audio Transcription",
    description: "Transform your voice into organized notes instantly with EcoNotes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
