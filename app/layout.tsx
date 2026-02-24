import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { LenisScroll } from "@/components/lenis-scroll";

// Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Lofy AI - Your Personal AI Assistant",
    template: "%s | Lofy AI",
  },
  description: "Lofy AI is your intelligent personal assistant designed to help you manage tasks, memories, and daily activities seamlessly.",
  keywords: ["AI assistant", "personal assistant", "productivity", "task management", "Lofy AI"],
  openGraph: {
    title: "Lofy AI - Your Personal AI Assistant",
    description: "Lofy AI is your intelligent personal assistant designed to help you manage tasks, memories, and daily activities seamlessly.",
    url: "/",
    siteName: "Lofy AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lofy AI - Your Personal AI Assistant",
    description: "Lofy AI is your intelligent personal assistant designed to help you manage tasks, memories, and daily activities seamlessly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased overflow-x-hidden`}>
        <LenisScroll />
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
