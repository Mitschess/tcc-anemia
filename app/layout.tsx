import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AnemiaSense - Mobile Health",
  description: "Skrining awal risiko anemia berdasarkan data wearable dan siklus menstruasi.",
  icons: {
    icon: [
      { url: "/images.webp", type: "image/webp" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/images.webp",
    apple: "/images.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="icon" href="/images.webp" type="image/webp" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images.webp" />
      </head>
      <body className="min-h-full flex flex-col bg-stone-900 text-stone-100 font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
