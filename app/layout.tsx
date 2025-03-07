import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BlobBackground from "@/components/BlobBackground";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Profiler",
  description: "All things about your spotify profile",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto text-white`}
      >
        {/* ! TODO:Add cn function to enable className calls in BlobBackground  */}
        <BlobBackground>
          <Nav />
          {children}
        </BlobBackground>
      </body>
    </html>
  );
}
