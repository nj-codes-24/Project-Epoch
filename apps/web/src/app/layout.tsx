import type { Metadata } from "next";
import { Source_Serif_4, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Knowledge Hub",
  description: "Curated research for your learning journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-background text-on-surface">{children}</body>
    </html>
  );
}
