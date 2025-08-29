import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VIS Service Verifier",
  description: "Veteran Information System - Service Verification Portal with 97% Vadir Accuracy",
  keywords: "veteran, VA, claims, service verification, Vadir, DD-214",
  authors: [{ name: "VIS Team" }],
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
