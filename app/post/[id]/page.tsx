"use client";

import React, { use } from "react";
import Link from "next/link";
import { useData } from "@/app/context/DataContext";
import { ArrowLeft, FileText, Calendar } from "lucide-react";

export default function DynamicPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { posts } = useData();

  // Find post by ID
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-450 flex items-center justify-center rounded-full mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-800">Artikel Tidak Ditemukan</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Mohon maaf, artikel atau berita yang Anda cari tidak ditemukan atau telah dihapus.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-12 md:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
          {/* Header Image */}
          <div className="w-full h-[300px] md:h-[400px] relative">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {post.badge && (
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                  {post.badge}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-10 space-y-6">
            <header className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="px-2 text-slate-300">•</span>
                <span className="uppercase tracking-widest text-emerald-500">{post.category}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                {post.title}
              </h1>
            </header>

            {/* Rich Text Body */}
            <div
              className="prose prose-slate prose-emerald max-w-none text-sm md:text-base leading-relaxed text-slate-600 font-medium"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
