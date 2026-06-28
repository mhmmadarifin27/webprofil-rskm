"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useData } from "@/app/context/DataContext";
import { LibraryItem } from "@/lib/db";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Download,
  FileText,
  Presentation,
  Archive,
} from "lucide-react";

export default function PerpustakaanPage() {
  const { libraryItems } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "Semua Kategori", icon: Archive },
    { value: "buku", label: "Buku Saku", icon: BookOpen },
    { value: "jurnal", label: "Jurnal Medis", icon: FileText },
    { value: "panduan", label: "Panduan Pasien", icon: FileText },
    { value: "presentasi", label: "Bahan Presentasi", icon: Presentation },
  ];

  // Filter items
  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Base64 file download
  const handleDownload = (item: LibraryItem) => {
    const link = document.createElement("a");
    link.href = item.file_url;
    link.download = item.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "buku":
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case "jurnal":
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case "panduan":
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case "presentasi":
        return <Presentation className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
            Perpustakaan & Publikasi RSKM
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight uppercase">
            Perpustakaan Digital
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Temukan panduan pelayanan, jurnal oftalmologi, buku saku edukasi kesehatan mata, dan bahan presentasi resmi dari RSKM Prov Sumatera Selatan.
          </p>
        </div>

        {/* Search & Filter Row */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-6 mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul dokumen atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Library Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 flex items-center justify-center rounded-full mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-700 mb-1">Dokumen Tidak Ditemukan</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Maaf, dokumen dengan kata kunci atau kategori tersebut belum terdaftar di perpustakaan digital kami.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs hover-lift flex flex-col justify-between"
              >
                <div>
                  {/* Cover Photo */}
                  <div className="w-full h-44 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] font-black px-2.5 py-0.5 rounded-md shadow-xs uppercase">
                      {item.category}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase truncate">
                        {item.file_name}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-800 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Download Button */}
                <div className="p-5 pt-0 border-t border-slate-50 mt-2">
                  <button
                    onClick={() => handleDownload(item)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Dokumen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
