import { NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1. Validasi format email secara ketat di server-side
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid. Silakan periksa kembali." },
        { status: 400 }
      );
    }

    const loopsApiKey = process.env.LOOPS_API_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

    // 2. Integrasi Loops.so jika LOOPS_API_KEY dikonfigurasi
    if (loopsApiKey) {
      try {
        const response = await fetch("https://loops.so/api/v1/contacts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loopsApiKey}`,
          },
          body: JSON.stringify({
            email,
            source: "Website RSKM Subscription",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return NextResponse.json(
            { error: errorData.message || "Gagal menyimpan email ke Loops.so." },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Terima kasih! Anda berhasil berlangganan via Loops.so.",
        });
      } catch (err: any) {
        console.error("Loops API connection failed:", err);
        return NextResponse.json(
          { error: "Koneksi ke Loops.so gagal. Silakan coba beberapa saat lagi." },
          { status: 502 }
        );
      }
    }

    // 3. Integrasi Resend jika RESEND_API_KEY & AUDIENCE_ID dikonfigurasi
    if (resendApiKey && resendAudienceId) {
      try {
        const response = await fetch(
          `https://api.resend.com/audiences/${resendAudienceId}/contacts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              email,
              unsubscribed: false,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return NextResponse.json(
            { error: errorData.message || "Gagal menyimpan email ke Resend." },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Terima kasih! Anda berhasil berlangganan via Resend.",
        });
      } catch (err: any) {
        console.error("Resend API connection failed:", err);
        return NextResponse.json(
          { error: "Koneksi ke Resend gagal. Silakan coba beberapa saat lagi." },
          { status: 502 }
        );
      }
    }

    // 4. Integrasi Database Supabase / Local Storage Fallback
    try {
      await saveSubscriber({
        email,
        created_at: new Date().toISOString(),
      });
      return NextResponse.json({
        success: true,
        message: "Terima kasih! Email Anda berhasil didaftarkan ke program newsletter kami.",
      });
    } catch (dbErr: any) {
      console.error("Failed to save subscriber:", dbErr);
      if (dbErr.code === "23505") {
        return NextResponse.json(
          { error: "Email ini sudah terdaftar sebagai subscriber." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Gagal memproses pendaftaran newsletter Anda." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Subscription API endpoint error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal sistem server." },
      { status: 500 }
    );
  }
}
