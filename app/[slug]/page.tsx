"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useData } from "@/app/context/DataContext";
import { ArrowLeft, FileText, Image, Grid, Eye, Clock, User, Bed, Calendar } from "lucide-react";

export default function DynamicContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { pages, doctors, beds, directors } = useData();
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // Find page by slug
  const page = pages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-455 flex items-center justify-center rounded-full mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Halaman Tidak Ditemukan</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Mohon maaf, halaman dengan alamat "/{slug}" tidak terdaftar atau belum diterbitkan oleh administrator.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-12 md:py-16">
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

        {/* ================= LAYOUT 1: STANDARD ================= */}
        {page.layout_type === "standard" && slug !== "jajaran-direksi" && slug !== "struktur-organisasi" && (
          <article className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <header className="space-y-3 text-center border-b border-slate-100 pb-6">
              <span className="inline-block bg-slate-100 text-slate-500 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Menu {page.menu_group.replace("_", " ")}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                {page.title}
              </h2>
            </header>

            {/* Display Cover Image if present */}
            {page.image_url && (
              <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-md border border-slate-150">
                <img src={page.image_url} alt={page.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Rich Text Body */}
            <div
              className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 font-medium font-sans"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </article>
        )}

        {/* ================= LAYOUT 2: SPLIT ================= */}
        {page.layout_type === "split" && (
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-fade-in">
            {/* Image (Left) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md h-[300px] md:h-[420px] rounded-3xl overflow-hidden shadow-xl border border-slate-150 hover-lift">
                <img
                  src={page.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80"}
                  alt={page.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content (Right) */}
            <div className="lg:col-span-7 space-y-6">
              <header className="space-y-2">
                <span className="inline-block bg-slate-100 text-slate-500 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Menu {page.menu_group.replace("_", " ")}
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                  {page.title}
                </h2>
              </header>

              {/* Rich Text Body */}
              <div
                className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 font-medium"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </article>
        )}

        {/* ================= LAYOUT 3: GRID ================= */}
        {page.layout_type === "grid" && (
          <article className="space-y-12 animate-fade-in">
            <header className="space-y-3 text-center max-w-2xl mx-auto border-b border-slate-100 pb-6">
              <span className="inline-block bg-slate-100 text-slate-500 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Menu {page.menu_group.replace("_", " ")}
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                {page.title}
              </h2>
            </header>

            {/* Cover photo if uploaded */}
            {page.image_url && (
              <div className="w-full h-[300px] md:h-[420px] rounded-3xl overflow-hidden shadow-md border border-slate-150 max-w-5xl mx-auto">
                <img src={page.image_url} alt={page.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Description Text */}
            <div
              className="prose prose-slate max-w-3xl mx-auto text-sm text-slate-655 font-medium"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            {/* Gallery Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase text-center flex items-center justify-center gap-1.5">
                <Grid className="w-4 h-4 text-primary" />
                <span>Galeri Penunjang Halaman</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {(page.grid_images && page.grid_images.length > 0 ? page.grid_images : [
                  "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=400&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=400&auto=format&fit=crop&q=80"
                ]).map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedGalleryImg(imgUrl)}
                    className="relative rounded-2xl overflow-hidden h-48 border border-slate-150 shadow-xs hover-lift group cursor-pointer"
                  >
                    <img src={imgUrl} alt="Gallery Item" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        )}

        {/* ================= DYNAMIC WIDGET 1: TEMPAT TIDUR ================= */}
        {slug === "tempat-tidur" && (
          <div className="max-w-4xl mx-auto mt-12 p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 shadow-xs animate-fade-in">
            <div className="border-b border-slate-250 pb-4">
              <h3 className="text-lg font-black text-slate-800">
                Informasi Real-Time Ketersediaan Tempat Tidur
              </h3>
              <p className="text-xs text-slate-550 font-semibold mt-1">
                Data okupansi kamar rawat inap RS Khusus Mata Provinsi Sumatera Selatan yang terintegrasi dengan Satu Data Diskominfo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {beds.map((bed) => {
                const pct = Math.round((bed.filled / bed.total_capacity) * 100);
                return (
                  <div key={bed.id} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-slate-800">{bed.class_name}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        Tersedia: {bed.available} Bed
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-550 font-bold">
                      <span>Terisi: {bed.filled} / {bed.total_capacity} Bed</span>
                      <span>{pct}% Terisi</span>
                    </div>
                    
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-2xl text-xs font-semibold leading-relaxed">
              * Data ketersediaan bed di atas diperbarui setiap ada perubahan pasien masuk/keluar. Pendaftaran rawat inap memerlukan rujukan poliklinik spesialis atau kondisi darurat UGD.
            </div>
          </div>
        )}

        {/* ================= DYNAMIC WIDGET 2: DOKTER KAMI ================= */}
        {slug === "dokter-kami" && (
          <div className="max-w-6xl mx-auto mt-12 space-y-8 animate-fade-in">
            <div className="border-b border-slate-200 pb-4 text-center max-w-xl mx-auto">
              <h3 className="text-xl font-black text-slate-800">
                Jadwal Praktek Dokter Spesialis Mata
              </h3>
              <p className="text-xs text-slate-550 font-semibold mt-1">
                Gunakan daftar berikut untuk mencari jadwal praktek rutin dokter spesialis kami.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover-lift">
                  <div className="space-y-4">
                    <div className="w-full h-48 rounded-2xl bg-slate-50 overflow-hidden border border-slate-200 relative">
                      <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 leading-tight">{doc.name}</h4>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        {doc.specialization}
                      </span>
                    </div>
                    
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jadwal Praktek</span>
                      <div className="space-y-1 bg-slate-50 rounded-xl p-2.5">
                        {Object.entries(doc.schedule).map(([days, hours]: any) => (
                          <div key={days} className="flex justify-between text-[11px] font-semibold text-slate-600">
                            <span>{days}</span>
                            <span className="text-primary font-mono">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= DYNAMIC WIDGET 3: JAJARAN DIREKSI ================= */}
        {slug === "jajaran-direksi" && (
          <div className="max-w-6xl mx-auto mt-12 space-y-8 animate-fade-in">
            <div className="border-b border-slate-200 pb-4 text-center max-w-xl mx-auto">
              <h3 className="text-xl font-black text-slate-800">
                Jajaran Direksi Rumah Sakit
              </h3>
              <p className="text-xs text-slate-550 font-semibold mt-1">
                Pimpinan dan manajemen RSKM Prov Sumatera Selatan yang berdedikasi tinggi.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto justify-center">
              {directors.map((dir) => (
                <div key={dir.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col items-center text-center hover-lift">
                  <div className="w-40 h-40 rounded-2xl bg-slate-50 overflow-hidden border border-slate-200 mb-4">
                    <img src={dir.image_url} alt={dir.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800 leading-tight">{dir.name}</h4>
                    <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-0.5 rounded-md text-[10px] font-extrabold uppercase">
                      {dir.position}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= DYNAMIC WIDGET 4: STRUKTUR ORGANISASI ================= */}
        {slug === "struktur-organisasi" && (
          <div className="max-w-4xl mx-auto mt-12 space-y-6 animate-fade-in text-center">
            <div className="border-b border-slate-200 pb-4 text-center max-w-xl mx-auto">
              <h3 className="text-xl font-black text-slate-800">
                Bagan Struktur Organisasi
              </h3>
              <p className="text-xs text-slate-550 font-semibold mt-1">
                Struktur tata kelola dan komando RSKM Prov Sumatera Selatan.
              </p>
            </div>
            
            {page.image_url ? (
              <div 
                className="w-full bg-white p-4 border border-slate-200 rounded-3xl shadow-xs overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedGalleryImg(page.image_url!)}
              >
                <img 
                  src={page.image_url} 
                  alt="Struktur Organisasi RSKM" 
                  className="w-full h-auto object-contain rounded-2xl max-h-[600px] mx-auto"
                />
                <p className="text-[10px] text-slate-400 mt-3 font-semibold">Klik gambar untuk melihat dalam ukuran penuh</p>
              </div>
            ) : (
              <div className="w-full bg-white p-12 border border-slate-200 rounded-3xl text-center shadow-xs text-slate-400">
                Bagan struktur belum diunggah oleh administrator.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= GALLERY LIGHTBOX MODAL ================= */}
      {selectedGalleryImg && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center z-55 p-4" onClick={() => setSelectedGalleryImg(null)}>
          <div className="relative max-w-3xl w-full max-h-[85vh] overflow-hidden rounded-2xl">
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer z-10 font-bold"
            >
              X
            </button>
            <img src={selectedGalleryImg} alt="Lightbox Preview" className="w-full h-auto object-contain mx-auto max-h-[85vh] rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
