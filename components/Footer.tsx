"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Globe,
  Loader
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

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Format email tidak valid.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Terima kasih! Anda berhasil berlangganan.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Terjadi kesalahan saat mendaftar.");
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setStatus("error");
      setMessage("Koneksi gagal. Silakan coba beberapa saat lagi.");
    }
  };

  return (
    <footer className="w-full bg-emerald-950 text-slate-300 border-t border-emerald-900/60 py-16 relative overflow-visible mt-20">

      {/* Newsletter Subscription Overlapping Bar */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2 px-4 z-20">
        <div className="max-w-2xl mx-auto text-center">
          <form
            onSubmit={handleSubscribe}
            className="bg-white rounded-full p-1 md:p-1.5 flex items-center shadow-2xl border border-slate-200/85 max-w-xl mx-auto relative overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-emerald-500/20"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full text-slate-800 text-xs md:text-sm font-semibold px-5 py-2.5 bg-transparent outline-hidden border-none placeholder-slate-400 focus:ring-0"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-6 md:px-8 py-3.5 rounded-full tracking-wider transition-colors duration-200 shrink-0 cursor-pointer disabled:bg-emerald-800/50 flex items-center gap-1.5"
            >
              {status === "loading" ? (
                <>
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                  <span>SUBSCRIBING...</span>
                </>
              ) : (
                "SUBSCRIBE"
              )}
            </button>
          </form>

          {/* Feedback messages */}
          {message && (
            <div className={`mt-2.5 text-xs font-black tracking-wide animate-fade-in ${status === "success" ? "text-emerald-350" : "text-rose-350"
              }`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Background Decorative Patterns encapsulated in overflow-hidden box */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 pt-10">

        {/* Column 1: Address & Maps iframe */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5 shadow-md border border-emerald-900/40 shrink-0">
              <img src="/logo.png" alt="Logo RSKM" className="w-9 h-9 object-contain" />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-tight text-white leading-none uppercase">
                RS. Khusus Mata Masyarakat
              </h4>
              <p className="text-[9px] font-bold text-emerald-450 tracking-wider mt-1 uppercase">
                Provinsi Sumatera Selatan "BINAR"
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-white uppercase tracking-wider">Alamat Utama</span>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              Jl. Kolonel H. Burlian KM. 6, Sukabangun, Kec. Sukarami, Palembang, Sumatera Selatan 30151
            </p>
          </div>

          {/* Maps Iframe */}
          <div className="w-full h-28 rounded-xl overflow-hidden border border-emerald-900/60 shadow-inner relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.455648833157!2d104.7283454749666!3d-2.9472304970420794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e6d6d45f47%3A0x633d7b4b397a6e17!2sRS+Khusus+Mata+Masyarakat+Provinsi+Sumatera+Selatan!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Column 2: Layanan Poliklinik */}
        <div>
          <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 pb-1.5 border-b border-emerald-900/60">
            Layanan Poliklinik
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link href="/pelayanan/klinik-umum" className="text-slate-200 hover:text-white flex items-center gap-1 group transition-colors">
                <ArrowRight className="w-3 h-3 text-slate-350 group-hover:text-white transition-colors" />
                <span>Klinik Umum & Refraksi</span>
              </Link>
            </li>
            <li>
              <Link href="/pelayanan/klinik-diagnostic" className="text-slate-200 hover:text-white flex items-center gap-1 group transition-colors">
                <ArrowRight className="w-3 h-3 text-slate-350 group-hover:text-white transition-colors" />
                <span>Klinik Diagnostik Okular</span>
              </Link>
            </li>
            <li>
              <Link href="/pelayanan/kornea-dan-bedah-refraktif" className="text-slate-200 hover:text-white flex items-center gap-1 group transition-colors">
                <ArrowRight className="w-3 h-3 text-slate-350 group-hover:text-white transition-colors" />
                <span>Kornea & Bedah Refraktif</span>
              </Link>
            </li>
            <li>
              <Link href="/pelayanan/klinik-retina" className="text-slate-200 hover:text-white flex items-center gap-1 group transition-colors">
                <ArrowRight className="w-3 h-3 text-slate-350 group-hover:text-white transition-colors" />
                <span>Klinik Retina (Posterior)</span>
              </Link>
            </li>
            <li>
              <Link href="/pelayanan/glaukoma" className="text-slate-200 hover:text-white flex items-center gap-1 group transition-colors">
                <ArrowRight className="w-3 h-3 text-slate-350 group-hover:text-white transition-colors" />
                <span>Klinik Spesialis Glaukoma</span>
              </Link>
            </li>
            <li>
              <Link href="/rawat-inap" className="text-slate-200 hover:text-white flex items-center gap-1 group transition-colors">
                <ArrowRight className="w-3 h-3 text-slate-350 group-hover:text-white transition-colors" />
                <span>Layanan Rawat Inap</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Situs Terkait */}
        <div>
          <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4 pb-1.5 border-b border-emerald-900/60">
            Situs Terkait
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <a href="https://rsmatabinar.sumselprov.go.id" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white flex items-center gap-1.5 group transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-350 group-hover:text-white transition-colors" />
                <span>Konsultasi & Pengaduan</span>
              </a>
            </li>
            <li>
              <a href="https://dinkes.sumselprov.go.id" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white flex items-center gap-1.5 group transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-350 group-hover:text-white transition-colors" />
                <span>Dinkes Provinsi Sumsel</span>
              </a>
            </li>
            <li>
              <a href="https://www.lapor.go.id" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white flex items-center gap-1.5 group transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-350 group-hover:text-white transition-colors" />
                <span>Portal SP4N Lapor</span>
              </a>
            </li>
            <li>
              <a href="https://sumselprov.go.id" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white flex items-center gap-1.5 group transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-350 group-hover:text-white transition-colors" />
                <span>Pemprov Sumatera Selatan</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Alamat Kontak & Follow Us */}
        <div className="space-y-5">
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase pb-1.5 border-b border-emerald-900/60">
              Hubungi Kontak
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-200">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="font-mono font-bold text-slate-200">(0711) 5612838</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="font-semibold truncate text-slate-200">info@rsudmata.sumselprov.go.id</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/rsmatabinar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/40 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-800 hover:scale-105 transition-all shadow-3xs"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/40 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-800 hover:scale-105 transition-all shadow-3xs"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-800/40 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-800 hover:scale-105 transition-all shadow-3xs"
                title="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-emerald-900/60 flex justify-center items-center text-[10px] text-slate-400 font-bold tracking-wide">
        <span className="text-center">
          &copy; Copyright Rumah Sakit Mata Masyarakat - Provinsi Sumatera Selatan &copy; 2026. All Rights Reserved
        </span>
      </div>
    </footer>
  );
}
