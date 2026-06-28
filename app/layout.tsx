import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RS Khusus Mata Provinsi Sumatera Selatan - Pelayanan Kesehatan Mata Terpadu",
  description: "Pusat rujukan utama kesehatan mata di wilayah Sumatera Selatan. Menghadirkan pelayanan prima, berteknologi tinggi, serta dokter spesialis & subspesialis terpercaya.",
  keywords: ["RSKM Prov Sumsel", "RS Khusus Mata Sumsel", "Rumah Sakit Mata Palembang", "Dokter Mata Palembang", "Katarak Sumsel", "Satu Data Diskominfo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased text-size-base`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-950 font-sans">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
