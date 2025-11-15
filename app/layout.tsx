"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/favicon.png" />
          <meta name="theme-color" content="#22c55e" />
        </head>
        <body>
          {children}
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </SessionProvider>
  );
}