import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BlobBackground from "@/components/BlobBackground";
import Nav from "@/components/Nav";
import { Analytics } from "@vercel/analytics/react"
import { LogRocketProvider } from "@/utils/LogRocketProvider";
// import ErrorBoundary from "@/components/ErrorBoundary";

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
      <head>
        <script async src="https://umami.xavierkhew.com/script.js" data-website-id="6ea34660-8aae-4a07-a6c5-238f369892d3"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased container mx-auto text-white`}
      >
        {/* ! TODO:Add cn function to enable className calls in BlobBackground  */}
        <BlobBackground>
          <Nav />
          <Analytics />
          <LogRocketProvider>
            {/* <ErrorBoundary> */}
            {children}
            {/* </ErrorBoundary> */}
          </LogRocketProvider>
        </BlobBackground>
      </body>
    </html>
  );
}
