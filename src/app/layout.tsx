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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T5F8GKH7');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T5F8GKH7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          <JsonLd />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
