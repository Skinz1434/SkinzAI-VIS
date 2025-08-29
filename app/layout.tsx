import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Skinz' Better VIS - Service Verification Suite",
  description: "Enhanced Veteran Information System - Advanced Service Verification Suite with Real-Time Analytics & TERA Analysis",
  keywords: "veteran, VA, claims, service verification, Vet Profile, DD-214, PACT Act, toxic exposure, disability rating",
  authors: [{ name: "Skinz AI" }],
  openGraph: {
    title: "Skinz' Better VIS",
    description: "Advanced Service Verification Suite",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0b0d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
