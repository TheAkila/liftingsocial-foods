import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lifting Social Foods — Eat Like You Train",
    template: "%s | Lifting Social Foods",
  },
  description:
    "Chef-crafted, macro-tracked protein meals built for lifters. Delivered across Sri Lanka.",
  metadataBase: new URL("https://foods.theliftingsocial.com"),
  openGraph: {
    title: "Lifting Social Foods — Eat Like You Train",
    description:
      "Chef-crafted, macro-tracked protein meals built for lifters. Delivered across Sri Lanka.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
