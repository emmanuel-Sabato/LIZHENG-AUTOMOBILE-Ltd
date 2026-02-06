"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SocialSidebar from "@/components/SocialSidebar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        <title>LIZHENG AUTOMOBILE Ltd | Quality Cars Rwanda</title>
        <meta name="description" content="Quality Cars. Trusted Deals. The premier car dealership in Rwanda." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-accent selection:text-primary`}
      >
        {!isAdminRoute && <Navbar />}
        {!isAdminRoute && <SocialSidebar />}
        <main>{children}</main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <WhatsAppButton />}
        <Analytics />
        <SpeedInsights />
        <AnalyticsTracker />
      </body>
    </html>
  );
}

