import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EcoNotes | Intelligent AI Audio Transcription & Note Taking",
    template: "%s | EcoNotes"
  },
  description: "Transform your voice into organized notes, summaries, and tasks with EcoNotes. The best AI audio transcription tool supporting Bengali and English. Perfect for meetings, lectures, and quick voice memos.",
  keywords: [
    "AI transcription",
    "audio to text",
    "voice to text",
    "Bengali audio transcription",
    "meeting minutes generator",
    "voice notes organizer",
    "EcoNotes",
    "speech recognition",
    "transcribe audio to text free",
    "AI note taking app"
  ],
  authors: [{ name: "EcoNotes Team" }],
  creator: "EcoNotes",
  publisher: "EcoNotes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "EcoNotes | Best AI Audio Transcription & Note Taking App",
    description: "Convert audio to text instantly. Support for Bengali & English. Generate meeting minutes, summaries, and tasks from your voice recordings.",
    url: "https://econotes.moinul4u.com",
    siteName: "EcoNotes",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "EcoNotes AI Transcription Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoNotes | Intelligent AI Audio Transcription",
    description: "Transform your voice into organized notes instantly with EcoNotes. Fast, accurate, and secure.",
    creator: "@econotes", // Update if there is a handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <Providers>
          <JsonLd />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
