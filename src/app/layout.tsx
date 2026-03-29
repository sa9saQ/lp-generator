import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LP構成ジェネレーター | セクション構成を自動提案",
  description:
    "業種・目的・ターゲットを選ぶだけで、最適なLPセクション構成を提案。配置理由と見出し例つき。",
  openGraph: {
    title: "LP構成ジェネレーター",
    description: "業種を選ぶだけで、最適なLPセクション構成を提案。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
