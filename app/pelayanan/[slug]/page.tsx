"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useData } from "@/app/context/DataContext";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Activity,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

export default function ClinicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { clinics, doctors } = useData();

  // Find the clinic
  const clinic = clinics.find((c) => c.slug === slug);

  // Doctor Schedule Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  if (!clinic) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-450 flex items-center justify-center rounded-full mx-auto">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Layanan Klinik Tidak Ditemukan</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Mohon maaf, layanan klinik dengan alamat "/pelayanan/{slug}" tidak terdaftar dalam sistem kami.
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

  // Find doctors belonging to this clinic
  const clinicDoctors = doctors.filter((d) => d.clinic_slug === clinic.slug);

  return (
    <div className="w-full flex flex-col">
      {/* 1. CLINIC HEADER COVER */}
      <section className="relative w-full h-[280px] md:h-[360px] bg-slate-950 overflow-hidden">
        <img
          src={clinic.image_url}
          alt={clinic.name}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8 pb-8 md:pb-12 text-white space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none">
            {clinic.name}
          </h2>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent"></span>
            <span>Poliklinik Kesehatan Mata Rujukan Utama</span>
          </div>
        </div>
      </section>

      {/* 2. CLINIC PROFILE DETAILS & FACILITIES */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Description and Facilities */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-855 pb-2 border-b border-slate-100">
              Deskripsi Pelayanan
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {clinic.description}
            </p>
          </div>

          {/* Facilities Checklist */}
          {clinic.facilities && clinic.facilities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-855 pb-2 border-b border-slate-100">
                Fasilitas & Peralatan Medis
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clinic.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-slate-700">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Doctor Roster in Clinic */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-150 p-6 rounded-3xl shadow-xs space-y-6">
            <h3 className="text-sm font-black text-slate-855 tracking-wider uppercase pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Dokter Spesialis Bertugas</span>
            </h3>

            {clinicDoctors.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-slate-400 italic">
                  Belum ada dokter spesialis yang terdaftar khusus untuk poliklinik ini saat ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {clinicDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/60 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">
                          {doc.name}
                        </h4>
                        <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">
                          {doc.specialization}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Jadwal</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= DOCTOR SCHEDULE DETAILS MODAL ================= */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-slate-100 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="text-sm font-bold">X</span>
            </button>

            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-200">
                  <img src={selectedDoctor.image_url} alt={selectedDoctor.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-850 leading-tight">{selectedDoctor.name}</h4>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    {selectedDoctor.specialization}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Jadwal Pelayanan Rutin</span>
                </h5>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-150">
                  {Object.entries(selectedDoctor.schedule).map(([days, hours]: any) => (
                    <div key={days} className="p-3.5 flex justify-between items-center text-xs font-medium text-slate-800">
                      <span className="text-slate-600 font-bold">{days}</span>
                      <span className="text-primary font-extrabold bg-white border border-slate-250 px-2.5 py-1 rounded-lg">
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                * Jadwal dapat berubah sewaktu-waktu akibat tindakan operasi darurat. Konfirmasi kedatangan disarankan via WhatsApp hotline.
              </p>

              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 py-3.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Tutup Jadwal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
