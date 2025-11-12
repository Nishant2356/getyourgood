"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          {/* <Navbar /> */}
          {children}
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </SessionProvider>
  );
}
