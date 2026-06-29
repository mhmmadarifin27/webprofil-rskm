"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccessibility } from "@/app/context/AccessibilityContext";
import { useData } from "@/app/context/DataContext";
import {
  Eye,
  Menu,
  X,
  ChevronDown,
  Activity,
} from "lucide-react";

export default function Navbar() {
  const { textSize, setTextSize, highContrast, toggleHighContrast } = useAccessibility();
  const { pages, clinics } = useData();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomepage = pathname === "/";
  const showSolid = isScrolled || mobileMenuOpen || !isHomepage;

  useEffect(() => {
    if (!isHomepage) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  // Filter pages by menu group and sort in exact requested order
  const profilOrder = [
    "renstra",
    "tentang-kami",
    "visi-misi",
    "struktur-organisasi",
    "jajaran-direksi",
    "aksesibilitas-rs",
    "dokter-kami"
  ];

  const infoOrder = [
    "jadwal-besuk",
    "syarat-pendaftaran-bpjs",
    "tarif-layanan",
    "tempat-tidur",
    "pelayanan-publik"
  ];

  const profilPages = pages
    .filter((p) => p.menu_group === "profil" && p.is_published)
    .sort((a, b) => {
      const idxA = profilOrder.indexOf(a.slug);
      const idxB = profilOrder.indexOf(b.slug);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

  const pelayananPages = pages.filter((p) => p.menu_group === "pelayanan" && p.is_published);

  const infoPages = pages
    .filter((p) => p.menu_group === "info_pengunjung" && p.is_published)
    .sort((a, b) => {
      const idxA = infoOrder.indexOf(a.slug);
      const idxB = infoOrder.indexOf(b.slug);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

  const mediaPages = pages.filter((p) => p.menu_group === "media" && p.is_published);

  const isGroupActive = (groupPages: typeof pages) => {
    return groupPages.some((p) => pathname === `/${p.slug}`);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const closeAll = () => {
    setActiveDropdown(null);
    setMobileDropdown(null);
    setMobileMenuOpen(false);
  };

  const headerPositionClass = isHomepage
    ? "fixed top-0 left-0 w-full"
    : "sticky top-0 w-full";

  return (
    <header className={`${headerPositionClass} z-50 transition-all duration-300 border-b ${showSolid
        ? "bg-white/95 backdrop-blur-md border-slate-100 shadow-xs text-slate-800"
        : "bg-transparent border-transparent text-white"
      }`}>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Hospital Brand Logo (Navigates to Dashboard) */}
        <Link href="/dashboard" onClick={closeAll} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5 shadow-md shadow-primary/10 border border-slate-100 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Logo RSKM" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h1 className={`text-xs font-black tracking-tight leading-none group-hover:text-primary transition-colors uppercase ${showSolid ? "text-slate-800" : "text-white"
              }`}>
              RS. Khusus Mata
            </h1>
            <p className={`text-[9px] font-bold tracking-wider mt-0.5 transition-colors ${showSolid ? "text-slate-500" : "text-slate-300"
              }`}>
              PROVINSI SUMATERA SELATAN
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={`font-semibold text-sm transition-colors hover:text-primary ${pathname === "/"
                ? showSolid ? "text-primary border-b-2 border-primary pb-1" : "text-white border-b-2 border-white pb-1"
                : showSolid ? "text-slate-600" : "text-slate-200 hover:text-white"
              }`}
          >
            Beranda
          </Link>

          {/* Profil Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("profil")}
              className={`flex items-center gap-1 font-semibold text-sm transition-colors hover:text-primary cursor-pointer ${activeDropdown === "profil" || isGroupActive(profilPages)
                  ? showSolid ? "text-primary" : "text-white"
                  : showSolid ? "text-slate-600" : "text-slate-200 hover:text-white"
                }`}
            >
              <span>Profil</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {activeDropdown === "profil" && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 animate-fade-in z-50 text-slate-800">
                {profilPages.map((page, idx) => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    onClick={closeAll}
                    className={`block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary ${idx > 0 ? "border-t border-slate-50" : ""}`}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pelayanan Dropdown (11 clinics + dynamic pages) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("pelayanan")}
              className={`flex items-center gap-1 font-semibold text-sm transition-colors hover:text-primary cursor-pointer ${activeDropdown === "pelayanan" || pathname.startsWith("/pelayanan") || isGroupActive(pelayananPages)
                  ? showSolid ? "text-primary" : "text-white"
                  : showSolid ? "text-slate-600" : "text-slate-200 hover:text-white"
                }`}
            >
              <span>Pelayanan</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {activeDropdown === "pelayanan" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] rounded-3xl bg-white border border-slate-100 shadow-xl p-4 grid grid-cols-2 gap-1 animate-fade-in z-50 text-slate-800">
                <div className="col-span-2 text-[10px] font-bold text-slate-400 tracking-wider px-2 pb-2 border-b border-slate-50 mb-2">
                  LAYANAN SPESIALIS & SUBSPESIALIS MATA
                </div>
                {clinics.map((clinic) => (
                  <Link
                    key={clinic.id}
                    href={`/pelayanan/${clinic.slug}`}
                    onClick={closeAll}
                    className="flex flex-col p-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <span className="text-xs font-bold leading-tight">{clinic.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 font-normal">{clinic.description}</span>
                  </Link>
                ))}
                {pelayananPages.length > 0 && (
                  <>
                    <div className="col-span-2 text-[10px] font-bold text-slate-400 tracking-wider px-2 pt-3 pb-2 border-t border-b border-slate-50 mt-2 mb-2">
                      LAYANAN LAINNYA
                    </div>
                    {pelayananPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/${page.slug}`}
                        onClick={closeAll}
                        className="flex flex-col p-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <span className="text-xs font-bold leading-tight">{page.title}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 font-normal">Layanan {page.title} RSKM</span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Info Pengunjung Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("info")}
              className={`flex items-center gap-1 font-semibold text-sm transition-colors hover:text-primary cursor-pointer ${activeDropdown === "info" || isGroupActive(infoPages)
                  ? showSolid ? "text-primary" : "text-white"
                  : showSolid ? "text-slate-600" : "text-slate-200 hover:text-white"
                }`}
            >
              <span>Info Pengunjung</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {activeDropdown === "info" && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 animate-fade-in z-50 text-slate-800">
                {infoPages.map((page, idx) => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    onClick={closeAll}
                    className={`block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary ${idx > 0 ? "border-t border-slate-50" : ""}`}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Media Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("media")}
              className={`flex items-center gap-1 font-semibold text-sm transition-colors hover:text-primary cursor-pointer ${activeDropdown === "media" || pathname === "/perpustakaan" || isGroupActive(mediaPages)
                  ? showSolid ? "text-primary" : "text-white"
                  : showSolid ? "text-slate-600" : "text-slate-200 hover:text-white"
                }`}
            >
              <span>Media</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {activeDropdown === "media" && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl py-2 animate-fade-in z-50 text-slate-800">
                <Link
                  href="/perpustakaan"
                  onClick={closeAll}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
                >
                  Perpustakaan
                </Link>
                <Link
                  href="/#berita-kegiatan"
                  onClick={closeAll}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary border-t border-slate-50"
                >
                  Berita & Artikel
                </Link>
                <Link
                  href="/#kegiatan-rs"
                  onClick={closeAll}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
                >
                  Dokumentasi Kegiatan
                </Link>
                {mediaPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/${page.slug}`}
                    onClick={closeAll}
                    className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary border-t border-slate-50"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/hubungi-kami"
            className={`font-semibold text-sm transition-colors hover:text-primary ${pathname === "/hubungi-kami"
                ? showSolid ? "text-primary border-b-2 border-primary pb-1" : "text-white border-b-2 border-white pb-1"
                : showSolid ? "text-slate-600" : "text-slate-200 hover:text-white"
              }`}
          >
            Hubungi Kami
          </Link>
        </nav>

        {/* Aksesibilitas Controls (Moved to Right Side of Navbar) */}
        <div className="hidden lg:flex items-center gap-3">
          <span className={`font-semibold flex items-center gap-1 text-xs select-none ${showSolid ? "text-slate-600" : "text-slate-200"
            }`}>
            <Eye className={`w-3.5 h-3.5 ${showSolid ? "text-primary" : "text-accent"}`} /> Aksibilitas:
          </span>
          {/* Text Size Controls */}
          <div className={`flex rounded-lg p-0.5 border ${showSolid ? "bg-slate-100 border-slate-250" : "bg-white/10 border-white/20"
            }`}>
            <button
              onClick={() => setTextSize("sm")}
              className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${textSize === "sm"
                  ? "bg-primary text-white shadow-xs"
                  : showSolid ? "text-slate-500 hover:text-slate-800" : "text-slate-300 hover:text-white"
                }`}
              title="Teks Kecil"
            >
              A-
            </button>
            <button
              onClick={() => setTextSize("base")}
              className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${textSize === "base"
                  ? "bg-primary text-white shadow-xs"
                  : showSolid ? "text-slate-500 hover:text-slate-800" : "text-slate-300 hover:text-white"
                }`}
              title="Teks Normal"
            >
              A
            </button>
            <button
              onClick={() => setTextSize("lg")}
              className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${textSize === "lg"
                  ? "bg-primary text-white shadow-xs"
                  : showSolid ? "text-slate-500 hover:text-slate-800" : "text-slate-300 hover:text-white"
                }`}
              title="Teks Besar"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-extrabold transition-all cursor-pointer ${highContrast
                ? "bg-yellow-400 text-black border-yellow-400 shadow-xs"
                : showSolid
                  ? "bg-slate-100 text-slate-700 border-slate-250 hover:bg-slate-200 hover:text-slate-900"
                  : "bg-white/10 text-slate-200 border-white/20 hover:bg-white/20 hover:text-white"
              }`}
            title="Toggle Mode Kontras Tinggi"
          >
            <div className={`w-3 h-3 rounded-full border border-current ${highContrast ? "bg-black" : "bg-white"}`}></div>
            <span>{highContrast ? "Kontras Tinggi Aktif" : "Kontras Tinggi"}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${showSolid ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"
            }`}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-6 space-y-4 shadow-inner max-h-[calc(100vh-120px)] overflow-y-auto text-slate-800 animate-fade-in">
          {/* Static Link */}
          <Link
            href="/"
            onClick={closeAll}
            className="block py-2.5 text-sm font-bold text-slate-800 border-b border-slate-100 hover:text-primary transition-colors"
          >
            Beranda
          </Link>

          {/* Profil Dropdown */}
          <div className="border-b border-slate-100 pb-2">
            <button
              onClick={() => setMobileDropdown(mobileDropdown === "profil" ? null : "profil")}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 hover:text-primary cursor-pointer text-left focus:outline-none"
            >
              <span>Profil</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileDropdown === "profil" ? "rotate-180 text-primary" : ""}`} />
            </button>
            {mobileDropdown === "profil" && (
              <div className="pl-3 mt-1.5 space-y-2 border-l border-emerald-500/20 animate-fade-in">
                {profilPages.map((page) => (
                  <Link key={page.id} href={`/${page.slug}`} onClick={closeAll} className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors">
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pelayanan Dropdown */}
          <div className="border-b border-slate-100 pb-2">
            <button
              onClick={() => setMobileDropdown(mobileDropdown === "pelayanan" ? null : "pelayanan")}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 hover:text-primary cursor-pointer text-left focus:outline-none"
            >
              <span>Pelayanan</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileDropdown === "pelayanan" ? "rotate-180 text-primary" : ""}`} />
            </button>
            {mobileDropdown === "pelayanan" && (
              <div className="pl-3 mt-1.5 border-l border-emerald-500/20 animate-fade-in space-y-3">
                <div>
                  <div className="text-[9px] font-black text-slate-400 tracking-wider mb-1 uppercase">Spesialis & Subspesialis</div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {clinics.map((clinic) => (
                      <Link key={clinic.id} href={`/pelayanan/${clinic.slug}`} onClick={closeAll} className="block py-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors">
                        {clinic.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {pelayananPages.length > 0 && (
                  <div>
                    <div className="text-[9px] font-black text-slate-400 tracking-wider mb-1 uppercase">Layanan Lainnya</div>
                    <div className="space-y-1.5">
                      {pelayananPages.map((page) => (
                        <Link key={page.id} href={`/${page.slug}`} onClick={closeAll} className="block py-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors">
                          {page.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Pengunjung Dropdown */}
          <div className="border-b border-slate-100 pb-2">
            <button
              onClick={() => setMobileDropdown(mobileDropdown === "info" ? null : "info")}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 hover:text-primary cursor-pointer text-left focus:outline-none"
            >
              <span>Info Pengunjung</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileDropdown === "info" ? "rotate-180 text-primary" : ""}`} />
            </button>
            {mobileDropdown === "info" && (
              <div className="pl-3 mt-1.5 space-y-2 border-l border-emerald-500/20 animate-fade-in">
                {infoPages.map((page) => (
                  <Link key={page.id} href={`/${page.slug}`} onClick={closeAll} className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors">
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Media Dropdown */}
          <div className="border-b border-slate-100 pb-2">
            <button
              onClick={() => setMobileDropdown(mobileDropdown === "media" ? null : "media")}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 hover:text-primary cursor-pointer text-left focus:outline-none"
            >
              <span>Media & Informasi</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileDropdown === "media" ? "rotate-180 text-primary" : ""}`} />
            </button>
            {mobileDropdown === "media" && (
              <div className="pl-3 mt-1.5 space-y-2 border-l border-emerald-500/20 animate-fade-in">
                <Link href="/perpustakaan" onClick={closeAll} className="block py-1 text-xs font-semibold text-slate-600 hover:text-primary transition-colors">
                  Perpustakaan
                </Link>
                <Link href="/#berita-kegiatan" onClick={closeAll} className="block py-1 text-xs font-semibold text-slate-600 hover:text-primary transition-colors">
                  Berita & Artikel
                </Link>
                <Link href="/#kegiatan-rs" onClick={closeAll} className="block py-1 text-xs font-semibold text-slate-600 hover:text-primary transition-colors">
                  Dokumentasi Kegiatan
                </Link>
                {mediaPages.map((page) => (
                  <Link key={page.id} href={`/${page.slug}`} onClick={closeAll} className="block py-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors">
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hubungi Kami Mobile link */}
          <Link
            href="/hubungi-kami"
            onClick={closeAll}
            className="block py-2.5 text-sm font-bold text-slate-800 border-b border-slate-100 hover:text-primary transition-colors"
          >
            Hubungi Kami
          </Link>

          {/* Mobile Accessibility Controls */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-[10px] font-black text-slate-400 tracking-wider">AKSESIBILITAS</div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Text Size */}
              <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  onClick={() => setTextSize("sm")}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${textSize === "sm" ? "bg-primary text-white" : "text-slate-500"
                    }`}
                >
                  A-
                </button>
                <button
                  onClick={() => setTextSize("base")}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${textSize === "base" ? "bg-primary text-white" : "text-slate-500"
                    }`}
                >
                  A
                </button>
                <button
                  onClick={() => setTextSize("lg")}
                  className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${textSize === "lg" ? "bg-primary text-white" : "text-slate-500"
                    }`}
                >
                  A+
                </button>
              </div>

              {/* High Contrast */}
              <button
                onClick={toggleHighContrast}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-extrabold transition-all cursor-pointer ${highContrast
                    ? "bg-yellow-400 text-black border-yellow-400 shadow-xs"
                    : "bg-slate-100 text-slate-700 border-slate-250 hover:bg-slate-200"
                  }`}
              >
                <div className={`w-3 h-3 rounded-full border border-current ${highContrast ? "bg-black" : "bg-white"}`}></div>
                <span>{highContrast ? "Kontras Tinggi Aktif" : "Kontras Tinggi"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

