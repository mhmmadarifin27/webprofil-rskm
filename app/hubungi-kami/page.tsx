"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useData } from "@/app/context/DataContext";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function HubungiKamiPage() {
  const { createOrUpdateFeedbackMessage } = useData();
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "informasi",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrUpdateFeedbackMessage({
      id: `fb_${Date.now()}`,
      name: formData.name,
      contact: formData.contact,
      subject: formData.subject,
      message: formData.message,
      created_at: new Date().toISOString(),
      status: "unread",
    });
    setSuccess(true);
    setFormData({
      name: "",
      contact: "",
      subject: "informasi",
      message: "",
    });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3 animate-fade-in">
          <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
            Hubungi Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
            Hubungi Kami & Layanan Informasi
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Punya pertanyaan mengenai jadwal dokter, BPJS, pelayanan publik, atau ingin mengirimkan aduan? Tim kami siap membantu Anda.
          </p>
        </div>

        {/* Main Grid: Info Cards & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
          
          {/* Left Column: Contact Cards (LG Span 5) */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            
            {/* Address Card */}
            <div className="p-6 bg-white border border-slate-200/60 rounded-3xl shadow-xs space-y-3 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Alamat Lengkap</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Jl. Kolonel H. Burlian KM. 5,5, Kel. Sukabangun, Kec. Sukarami, Kota Palembang, Sumatera Selatan 30145
              </p>
            </div>

            {/* Tel & Email Card */}
            <div className="p-6 bg-white border border-slate-200/60 rounded-3xl shadow-xs space-y-4 hover-lift">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Telepon Hotline</h4>
                  <p className="text-xs text-slate-500 font-semibold font-mono">(0711) 5620108</p>
                  <p className="text-xs text-slate-400 font-semibold font-mono">WhatsApp: 0811-7418-024</p>
                </div>
              </div>
              <div className="flex gap-4 border-t border-slate-100 pt-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Surat Elektronik</h4>
                  <p className="text-xs text-slate-550 font-bold font-mono">info@rsudmata.sumselprov.go.id</p>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="p-6 bg-white border border-slate-200/60 rounded-3xl shadow-xs space-y-4 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Jam Pelayanan</h3>
              
              <div className="space-y-2 divide-y divide-slate-100 text-xs font-medium text-slate-500">
                <div className="flex justify-between py-1.5">
                  <span className="font-bold text-slate-600">Poliklinik (Senin - Kamis)</span>
                  <span className="font-mono font-bold text-slate-800">08:00 - 15:30 WIB</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="font-bold text-slate-600">Poliklinik (Jumat)</span>
                  <span className="font-mono font-bold text-slate-800">08:00 - 11:30 WIB</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="font-bold text-slate-600">UGD & Rawat Inap</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md text-[10px]">24 JAM NON-STOP</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Feedback Inquiries Form (LG Span 7) */}
          <div className="lg:col-span-7 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200/60 p-6 md:p-8 rounded-3xl shadow-xs space-y-5"
            >
              <h3 className="text-sm font-black tracking-wide uppercase text-emerald-600 border-b border-slate-100 pb-3">
                Kirim Pesan & Pengaduan
              </h3>

              {success && (
                <div className="bg-emerald-500 text-white px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md border border-emerald-400 animate-fade-in">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>Pesan Anda berhasil dikirim! Tim Humas kami akan menindaklanjuti segera.</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap Anda</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Setiawan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs font-semibold bg-slate-55 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email / No. WhatsApp Aktif</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: budi@gmail.com / 0812XXXXXXXX"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full text-xs font-semibold bg-slate-55 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Subjek Informasi</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs font-bold bg-slate-55 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                >
                  <option value="informasi">Informasi Layanan & Jadwal Dokter</option>
                  <option value="bpjs">Persyaratan Jaminan BPJS</option>
                  <option value="pengaduan">Aduan Layanan & Sarana</option>
                  <option value="lainnya">Inkuiri Lain-Lain</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Isi Detail Pesan</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan keluhan, pertanyaan, atau tanggapan Anda secara detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs font-semibold bg-slate-55 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan Sekarang</span>
              </button>
            </form>
          </div>

        </div>

        {/* Real Google Maps Embed at the bottom */}
        <div className="bg-white border border-slate-200/60 p-3 rounded-3xl shadow-xs space-y-3 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.455648833157!2d104.7283454749666!3d-2.9472304970420794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e6d6d45f47%3A0x633d7b4b397a6e17!2sRS+Khusus+Mata+Masyarakat+Provinsi+Sumatera+Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="flex justify-between items-center px-2 py-1 text-xs">
            <div>
              <span className="block font-black text-slate-800">Pusat Peta Lokasi RSKM</span>
              <span className="block text-[10px] text-slate-400">Palembang, Sumatera Selatan, Indonesia</span>
            </div>
            <a
              href="https://maps.google.com/?q=RS+Khusus+Mata+Masyarakat+Provinsi+Sumatera+Selatan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"
            >
              <span>Buka Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
