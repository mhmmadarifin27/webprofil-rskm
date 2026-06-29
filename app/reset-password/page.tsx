"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, Loader, Eye, EyeOff, Home } from "lucide-react";
import Link from "next/link";
import { supabase, isSupabaseConnected } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  // Reset States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Common UI States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit Handler
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg("Password harus memiliki panjang minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSupabaseConnected() && supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          setErrorMsg(error.message || "Gagal memperbarui password.");
        } else {
          setSuccessMsg("Password Anda berhasil diperbarui! Mengalihkan ke login...");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } else {
        // Simulated Offline mode
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSuccessMsg("Password berhasil diperbarui! (Demo Mode). Mengalihkan...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans antialiased text-slate-800">
      
      {/* LEFT COLUMN: AUTHENTICATION FORM (45% Width) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 md:p-12 lg:p-16 min-h-[60vh] lg:min-h-screen bg-white order-2 lg:order-1">
        
        {/* Top Branding Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center p-0.5 shadow-sm border border-slate-100 shrink-0">
            <img src="/logo.png" alt="Logo RSKM" className="w-9 h-9 object-contain" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black tracking-tight text-slate-855 uppercase leading-none">
              RS. Khusus Mata
            </h4>
            <p className="text-[9px] font-bold text-emerald-600 tracking-wider mt-0.5 uppercase leading-none">
              Provinsi Sumatera Selatan "BINAR"
            </p>
          </div>
        </div>

        {/* Form Main Container */}
        <div className="my-auto py-8 max-w-sm w-full mx-auto space-y-6 animate-fade-in">
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-850">Reset Password</h2>
            <p className="text-xs text-slate-400 font-bold leading-normal">
              Masukkan password baru Anda di bawah ini untuk memperbarui akun.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-150 text-red-700 p-3.5 rounded-2xl text-xs font-bold text-center animate-fade-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-150 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold text-center animate-fade-in">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleResetSubmit} className="space-y-4">
            
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-xs font-bold bg-slate-50/50 border border-slate-200/80 rounded-2xl p-3.5 pl-12 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-650 cursor-pointer"
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Konfirmasi Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Ulangi Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full text-xs font-bold bg-slate-50/50 border border-slate-200/80 rounded-2xl p-3.5 pl-12 pr-12 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-4 rounded-2xl text-xs font-black tracking-wider uppercase transition-colors duration-250 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm mt-3"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Perbarui Password</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-emerald-650 hover:text-emerald-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Halaman Login</span>
              </Link>
            </div>
          </form>

        </div>

        {/* Footer Copyright */}
        <footer className="text-[10px] text-slate-400 font-bold tracking-wide">
          &copy; 2026 Website RS Khusus Mata. Developed by IT RSKM.
        </footer>
      </div>

      {/* RIGHT COLUMN: BRAND BANNER & ILLUST (55% Width) */}
      <div className="flex w-full lg:w-[55%] bg-emerald-950 relative flex-col justify-between p-8 lg:p-16 overflow-hidden h-64 lg:h-auto lg:min-h-screen text-center lg:text-left order-1 lg:order-2">
        
        {/* Underlay Photo with Green Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-out hover:scale-105" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80')" 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/85 to-emerald-950/95 mix-blend-multiply pointer-events-none"></div>

        {/* Top Navigation Jumper */}
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8 z-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
        </div>

        {/* Visi Misi Brand Content in center */}
        <div className="my-auto max-w-lg relative z-10 space-y-2 lg:space-y-5">
          <h2 className="text-white text-xl lg:text-4xl font-black leading-tight tracking-tight uppercase">
            Pelayanan Medis Spesialis & Terpercaya
          </h2>
          <p className="text-white/90 text-xs lg:text-sm font-semibold leading-relaxed">
            "Mewujudkan masyarakat Sumatera Selatan dengan penglihatan optimal melalui pelayanan kesehatan mata prima, bermutu tinggi, dan terjangkau."
          </p>
          {/* Accent horizontal yellow bar */}
          <div className="w-16 h-1.5 bg-yellow-500 rounded-full shadow-md mx-auto lg:mx-0"></div>
        </div>

      </div>

    </div>
  );
}
