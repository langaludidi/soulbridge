import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  metadataBase: new URL('https://soulbridge.co.za'),
  title: {
    default: "SoulBridge - Honouring Every Life. Connecting Every Soul",
    template: "%s | SoulBridge Memorials"
  },
  description: "Create beautiful, lasting digital memorials for loved ones. Celebrate their life, share memories, and keep their legacy alive forever.",
  keywords: ['memorial', 'obituary', 'tribute', 'remembrance', 'digital memorial', 'online memorial', 'funeral', 'celebration of life', 'legacy', 'South Africa'],
  authors: [{ name: 'SoulBridge' }],
  creator: 'SoulBridge',
  publisher: 'SoulBridge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://soulbridge.co.za',
    siteName: 'SoulBridge Memorial Platform',
    title: 'SoulBridge - Honouring Every Life. Connecting Every Soul',
    description: 'Create beautiful, lasting digital memorials for loved ones. Celebrate their life, share memories, and keep their legacy alive forever.',
    images: [
      {
        url: '/logo-banner.png',
        width: 1200,
        height: 630,
        alt: 'SoulBridge Memorial Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoulBridge - Honouring Every Life. Connecting Every Soul',
    description: 'Create beautiful, lasting digital memorials for loved ones.',
    images: ['/logo-banner.png'],
    creator: '@soulbridge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
