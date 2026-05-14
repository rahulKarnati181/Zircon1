import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/site-footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zircon34 — Design Studio",
  description:
    "Zircon34 is a design studio crafting residences shaped by light, material, and landscape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
        <Navbar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
