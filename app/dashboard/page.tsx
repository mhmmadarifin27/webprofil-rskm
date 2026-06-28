"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "@/app/context/DataContext";
import { DirectorData, LibraryItem, FeedbackMessage } from "@/lib/db";
import Swal from "sweetalert2";
import {
  FileText,
  UserCheck,
  Home,
  Activity,
  User,
  Bed,
  Layers,
  Calendar,
  Settings,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldAlert,
  Save,
  CheckCircle,
  ArrowRight,
  Image,
  X,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Mail,
  Download,
  Check,
  Sun,
  Moon,
  LogOut,
  Loader,
  Users,
} from "lucide-react";

type Role = "SUPER_ADMIN" | "ADMIN_BIASA";
type Tab = "overview" | "pages" | "clinics" | "doctors" | "beds" | "posts" | "hero" | "directors" | "library" | "feedback" | "subscribers";

export default function DashboardPage() {
  const {
    pages,
    clinics,
    doctors,
    posts,
    beds,
    heroSlides,
    directors,
    libraryItems,
    feedbackMessages,
    subscribers,
    currentUser,
    isLoading,
    logout,
    createOrUpdatePage,
    removePage,
    createOrUpdatePost,
    removePost,
    updateBedCapacity,
    createOrUpdateDoctor,
    removeDoctor,
    updateClinicProfile,
    createOrUpdateHeroSlide,
    removeHeroSlide,
    createOrUpdateDirector,
    removeDirector,
    createOrUpdateLibraryItem,
    removeLibraryItem,
    createOrUpdateFeedbackMessage,
    removeFeedbackMessage,
    removeSubscriber,
    refreshData,
  } = useData();

  const router = useRouter();
  const [isLightMode, setIsLightMode] = useState(false);

  // Deriving real role from authentication session
  const role = currentUser?.role || "ADMIN_BIASA";
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Doctor Schedule Quick Editing (Admin Biasa)
  const [editingDoctorScheduleId, setEditingDoctorScheduleId] = useState<string | null>(null);
  const [editingScheduleText, setEditingScheduleText] = useState("");

  const startQuickScheduleEdit = (doc: any) => {
    setEditingDoctorScheduleId(doc.id);
    setEditingScheduleText(scheduleToRaw(doc.schedule || {}));
  };

  const handleQuickScheduleSave = (doc: any) => {
    const updatedDoc = {
      ...doc,
      schedule: parseScheduleRaw(editingScheduleText)
    };
    createOrUpdateDoctor(updatedDoc);
    setEditingDoctorScheduleId(null);
    triggerNotification(`Jadwal dr. ${doc.name} berhasil diperbarui!`);
  };

  const downloadSubscribersCSV = () => {
    if (subscribers.length === 0) {
      alert("Tidak ada data subscriber untuk diunduh.");
      return;
    }
    const csvHeaders = "No,Email Subscriber,Tanggal Terdaftar\n";
    const csvRows = subscribers.map((sub, idx) => {
      const date = new Date(sub.created_at).toLocaleString("id-ID");
      return `${idx + 1},"${sub.email.replace(/"/g, '""')}","${date}"`;
    }).join("\n");
    
    const blob = new Blob([csvHeaders + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_rskm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auto-redirect if tab is restricted for Admin Biasa
  useEffect(() => {
    if (role === "ADMIN_BIASA" && !["overview", "posts", "library", "feedback"].includes(activeTab)) {
      setActiveTab("overview");
    }
  }, [role, activeTab]);

  // Auto-refresh data when switching tabs or periodically every 15 seconds
  useEffect(() => {
    refreshData();

    const interval = setInterval(() => {
      refreshData();
    }, 15000);

    return () => clearInterval(interval);
  }, [activeTab, refreshData]);

  // Auth Redirection Hook - Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  // Form State: Dynamic Page
  const [pageForm, setPageForm] = useState({
    id: "",
    title: "",
    slug: "",
    layout_type: "standard" as "standard" | "split" | "grid",
    menu_group: "profil" as "profil" | "pelayanan" | "info_pengunjung" | "media",
    content: "",
    image_url: "",
    grid_images: [] as string[],
  });

  // Form State: Media Post
  const [postForm, setPostForm] = useState({
    id: "",
    title: "",
    category: "artikel" as "berita" | "artikel" | "kegiatan",
    content: "",
    badge: "EDUKASI",
    image_url: "",
  });

  // Form State: Bed Capacity
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [bedForm, setBedForm] = useState({
    id: "",
    class_name: "",
    total_capacity: 0,
    filled: 0,
    available: 0,
  });

  // Form State: Doctor Full CRUD
  const [doctorForm, setDoctorForm] = useState({
    id: "",
    name: "",
    specialization: "",
    category: "",
    image_url: "",
    clinic_slug: "",
    scheduleRaw: "" as string, // format: "Senin-Rabu: 08:00-12:00\nKamis: 13:00-15:30"
  });
  const [isDoctorFormOpen, setIsDoctorFormOpen] = useState(false);

  // Form State: Clinic
  const [editingClinicId, setEditingClinicId] = useState<string | null>(null);
  const [clinicDescForm, setClinicDescForm] = useState("");
  const [clinicImageForm, setClinicImageForm] = useState("");

  // Form State: Hero Slides
  const [heroForm, setHeroForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    badge: "",
    image_url: "",
    order_index: 1,
  });
  const [isHeroFormOpen, setIsHeroFormOpen] = useState(false);

  // Form State: Jajaran Direksi
  const [directorForm, setDirectorForm] = useState({
    id: "",
    name: "",
    position: "",
    image_url: "",
  });
  const [isDirectorFormOpen, setIsDirectorFormOpen] = useState(false);

  // Form State: Perpustakaan Library
  const [libraryForm, setLibraryForm] = useState({
    id: "",
    title: "",
    category: "buku" as "buku" | "jurnal" | "panduan" | "presentasi",
    description: "",
    image_url: "",
    file_url: "",
    file_name: "",
  });
  const [isLibraryFormOpen, setIsLibraryFormOpen] = useState(false);

  // Handlers for Jajaran Direksi
  const openDirectorForm = (dir?: DirectorData | null) => {
    if (dir) {
      setDirectorForm({
        id: dir.id,
        name: dir.name,
        position: dir.position,
        image_url: dir.image_url,
      });
    } else {
      setDirectorForm({
        id: "",
        name: "",
        position: "",
        image_url: "",
      });
    }
    setIsDirectorFormOpen(true);
  };

  const closeDirectorForm = () => {
    setIsDirectorFormOpen(false);
  };

  const handleDirectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateDirector({
      id: directorForm.id || `dir_${Date.now()}`,
      name: directorForm.name,
      position: directorForm.position,
      image_url: directorForm.image_url || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
    });
    triggerNotification(directorForm.id ? "Data direksi berhasil diperbarui!" : "Anggota direksi baru berhasil ditambahkan!");
    closeDirectorForm();
  };

  const handleDirectorDelete = (id: string, name: string) => {
    confirmAction(
      "Apakah Anda yakin?",
      `Anggota direksi ${name} akan dihapus secara permanen.`,
      async () => {
        await removeDirector(id);
        triggerNotification("Anggota direksi berhasil dihapus!");
      }
    );
  };

  // Handlers for Perpustakaan
  const openLibraryForm = (item?: LibraryItem | null) => {
    if (item) {
      setLibraryForm({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        image_url: item.image_url,
        file_url: item.file_url,
        file_name: item.file_name,
      });
    } else {
      setLibraryForm({
        id: "",
        title: "",
        category: "buku",
        description: "",
        image_url: "",
        file_url: "",
        file_name: "",
      });
    }
    setIsLibraryFormOpen(true);
  };

  const closeLibraryForm = () => {
    setIsLibraryFormOpen(false);
  };

  const handleLibrarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateLibraryItem({
      id: libraryForm.id || `lib_${Date.now()}`,
      title: libraryForm.title,
      category: libraryForm.category,
      description: libraryForm.description,
      image_url: libraryForm.image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
      file_url: libraryForm.file_url || "data:application/pdf;base64,JVBERi0xLjQKJfs...",
      file_name: libraryForm.file_name || "dokumen.pdf",
      created_at: new Date().toISOString(),
    });
    triggerNotification(libraryForm.id ? "Data perpustakaan berhasil diperbarui!" : "Buku/dokumen baru berhasil diunggah!");
    closeLibraryForm();
  };

  const handleLibraryDelete = (id: string, title: string) => {
    confirmAction(
      "Apakah Anda yakin?",
      `Dokumen "${title}" akan dihapus dari perpustakaan.`,
      async () => {
        await removeLibraryItem(id);
        triggerNotification("Dokumen perpustakaan berhasil dihapus!");
      }
    );
  };

  const handleLibraryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLibraryForm((prev) => ({
            ...prev,
            file_url: reader.result as string,
            file_name: file.name,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for Feedback
  const handleFeedbackStatusChange = async (msg: FeedbackMessage, newStatus: "unread" | "read" | "replied") => {
    await createOrUpdateFeedbackMessage({
      ...msg,
      status: newStatus,
    });
    triggerNotification("Status pengaduan berhasil diperbarui!");
  };

  const handleFeedbackDelete = (id: string) => {
    confirmAction(
      "Apakah Anda yakin?",
      "Laporan aduan ini akan dihapus secara permanen.",
      async () => {
        await removeFeedbackMessage(id);
        triggerNotification("Pesan aduan berhasil dihapus!");
      }
    );
  };

  // Helper for success notification
  const triggerNotification = (msg: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: isLightMode ? "#ffffff" : "#0f172a",
      color: isLightMode ? "#1e293b" : "#f1f5f9",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
    Toast.fire({
      icon: "success",
      title: msg
    });
  };

  // Helper for SweetAlert2 Confirmation Dialog
  const confirmAction = (
    title: string,
    text: string,
    onConfirm: () => void,
    confirmText = "Ya, Hapus!",
    cancelText = "Batal"
  ) => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: isLightMode ? "#ffffff" : "#0f172a",
      color: isLightMode ? "#1e293b" : "#f1f5f9"
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  // Base64 file uploader helper
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Multiple files uploader helper for Grid layout
  const handleMultipleImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let loadedCount = 0;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            newImages.push(reader.result);
          }
          loadedCount++;
          if (loadedCount === files.length) {
            setPageForm((prev) => ({
              ...prev,
              grid_images: [...prev.grid_images, ...newImages],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Slug generator
  const handlePageTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setPageForm((prev) => ({ ...prev, title, slug }));
  };

  // Submit Page
  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdatePage({
      id: pageForm.id || undefined,
      title: pageForm.title,
      slug: pageForm.slug,
      layout_type: pageForm.layout_type,
      menu_group: pageForm.menu_group,
      content: pageForm.content,
      is_published: true,
      image_url: pageForm.image_url,
      grid_images: pageForm.grid_images,
    });

    triggerNotification(
      pageForm.id ? "Halaman berhasil diperbarui!" : "Halaman baru berhasil ditambahkan ke CMS!"
    );

    setPageForm({
      id: "",
      title: "",
      slug: "",
      layout_type: "standard",
      menu_group: "profil",
      content: "",
      image_url: "",
      grid_images: [],
    });
  };

  const loadPageToForm = (page: any) => {
    setPageForm({
      id: page.id,
      title: page.title,
      slug: page.slug,
      layout_type: page.layout_type,
      menu_group: page.menu_group,
      content: page.content,
      image_url: page.image_url || "",
      grid_images: page.grid_images || [],
    });
  };

  const handlePageDelete = (id: string) => {
    confirmAction(
      "Apakah Anda yakin?",
      "Halaman ini akan dihapus secara permanen dan tidak dapat dibatalkan.",
      async () => {
        await removePage(id);
        triggerNotification("Halaman berhasil dihapus!");
      }
    );
  };

  // Submit Post (Media)
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdatePost({
      id: postForm.id || undefined,
      title: postForm.title,
      category: postForm.category,
      content: postForm.content,
      badge: postForm.category === "artikel" ? postForm.badge : undefined,
      image_url: postForm.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80",
    });

    triggerNotification(
      postForm.id ? "Artikel/Berita berhasil diperbarui!" : "Artikel/Berita baru berhasil diterbitkan!"
    );

    setPostForm({
      id: "",
      title: "",
      category: "artikel",
      content: "",
      badge: "EDUKASI",
      image_url: "",
    });
  };

  const loadPostToForm = (post: any) => {
    setPostForm({
      id: post.id,
      title: post.title,
      category: post.category,
      content: post.content,
      badge: post.badge || "EDUKASI",
      image_url: post.image_url || "",
    });
  };

  const handlePostDelete = (id: string) => {
    confirmAction(
      "Apakah Anda yakin?",
      "Postingan media ini akan dihapus secara permanen.",
      async () => {
        await removePost(id);
        triggerNotification("Postingan berhasil dihapus!");
      }
    );
  };

  // Edit Bed Capacity
  const startEditingBed = (bed: any) => {
    setEditingBedId(bed.id);
    setBedForm({ ...bed });
  };

  const handleBedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const available = Math.max(0, bedForm.total_capacity - bedForm.filled);
    updateBedCapacity({ ...bedForm, available });
    setEditingBedId(null);
    triggerNotification("Kapasitas Bed Rawat Inap berhasil diperbarui!");
  };

  // ===================== DOCTOR FULL CRUD =====================
  // Parse schedule raw text to Record
  const parseScheduleRaw = (raw: string): Record<string, string> => {
    const result: Record<string, string> = {};
    raw.split("\n").forEach((line) => {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const days = line.substring(0, colonIdx).trim();
        const hours = line.substring(colonIdx + 1).trim();
        if (days && hours) result[days] = hours;
      }
    });
    return result;
  };

  // Convert schedule to raw text
  const scheduleToRaw = (schedule: Record<string, string>): string => {
    return Object.entries(schedule)
      .map(([days, hours]) => `${days}: ${hours}`)
      .join("\n");
  };

  const openDoctorForm = (doctor?: any) => {
    if (doctor) {
      setDoctorForm({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        category: doctor.category,
        image_url: doctor.image_url || "",
        clinic_slug: doctor.clinic_slug || "",
        scheduleRaw: scheduleToRaw(doctor.schedule || {}),
      });
    } else {
      setDoctorForm({
        id: "",
        name: "",
        specialization: "",
        category: "",
        image_url: "",
        clinic_slug: clinics[0]?.slug || "",
        scheduleRaw: "Senin - Rabu: 08:00 - 12:00\nKamis: 13:00 - 15:30",
      });
    }
    setIsDoctorFormOpen(true);
  };

  const closeDoctorForm = () => {
    setIsDoctorFormOpen(false);
    setDoctorForm({ id: "", name: "", specialization: "", category: "", image_url: "", clinic_slug: "", scheduleRaw: "" });
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = parseScheduleRaw(doctorForm.scheduleRaw);
    const doctorData = {
      id: doctorForm.id || `doc_${Date.now()}`,
      name: doctorForm.name,
      specialization: doctorForm.specialization,
      category: doctorForm.category,
      image_url: doctorForm.image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
      clinic_slug: doctorForm.clinic_slug,
      schedule,
    };
    createOrUpdateDoctor(doctorData);
    triggerNotification(doctorForm.id ? `Data dr. ${doctorForm.name} berhasil diperbarui!` : `Dokter baru ${doctorForm.name} berhasil ditambahkan!`);
    closeDoctorForm();
  };

  const handleDoctorDelete = (id: string, name: string) => {
    confirmAction(
      "Apakah Anda yakin?",
      `Data dokter "${name}" akan dihapus secara permanen.`,
      async () => {
        await removeDoctor(id);
        triggerNotification(`Data dokter ${name} berhasil dihapus!`);
      }
    );
  };

  // Edit Clinic Description
  const startEditingClinic = (clinic: any) => {
    setEditingClinicId(clinic.id);
    setClinicDescForm(clinic.description);
    setClinicImageForm(clinic.image_url || "");
  };

  const handleClinicSubmit = (clinic: any) => {
    updateClinicProfile({ ...clinic, description: clinicDescForm, image_url: clinicImageForm });
    setEditingClinicId(null);
    triggerNotification(`Profil deskripsi poliklinik ${clinic.name} berhasil diperbarui!`);
  };

  // ===================== HERO SLIDES CRUD =====================
  const openHeroForm = (slide?: any) => {
    if (slide) {
      setHeroForm({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle,
        badge: slide.badge,
        image_url: slide.image_url,
        order_index: slide.order_index,
      });
    } else {
      setHeroForm({
        id: "",
        title: "",
        subtitle: "",
        badge: "",
        image_url: "",
        order_index: (heroSlides.length + 1),
      });
    }
    setIsHeroFormOpen(true);
  };

  const closeHeroForm = () => {
    setIsHeroFormOpen(false);
    setHeroForm({ id: "", title: "", subtitle: "", badge: "", image_url: "", order_index: 1 });
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slideData = {
      id: heroForm.id || `hero_${Date.now()}`,
      title: heroForm.title,
      subtitle: heroForm.subtitle,
      badge: heroForm.badge,
      image_url: heroForm.image_url,
      order_index: heroForm.order_index,
    };
    createOrUpdateHeroSlide(slideData);
    triggerNotification(heroForm.id ? "Slide hero berhasil diperbarui!" : "Slide hero baru berhasil ditambahkan!");
    closeHeroForm();
  };

  const handleHeroDelete = (id: string) => {
    confirmAction(
      "Apakah Anda yakin?",
      "Slide ini akan dihapus dari carousel beranda.",
      async () => {
        await removeHeroSlide(id);
        triggerNotification("Slide hero berhasil dihapus!");
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-10 h-10 animate-spin text-emerald-500" />
          <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">Memuat Sesi...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col font-sans antialiased transition-all duration-300 ${isLightMode ? "light-theme bg-slate-50 text-slate-850" : "bg-slate-900 text-slate-100"
      }`}>
      <style>{`
        .light-theme {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --bg-subcard: #f8fafc;
          --bg-header: #ffffff;
          --bg-sidebar: #059669;
          --border-color: #cbd5e1;
          --text-primary: #0f172a;
          --text-secondary: #334155;
          --text-muted: #64748b;
        }
        .light-theme header {
          background-color: var(--bg-header) !important;
          border-color: var(--border-color) !important;
          color: var(--text-primary) !important;
        }
        .light-theme aside,
        .light-theme aside.bg-slate-950 {
          background-color: var(--bg-sidebar) !important;
          border-color: #047857 !important;
        }
        .light-theme aside button,
        .light-theme aside button.text-slate-400,
        .light-theme aside button.text-slate-350,
        .light-theme aside button.text-white {
          color: #ffffff !important;
        }
        .light-theme aside button:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
        }
        .light-theme aside button.bg-slate-900,
        .light-theme aside .bg-slate-900 {
          background-color: #047857 !important;
          color: #ffffff !important;
          border-color: #047857 !important;
        }
        .light-theme aside div.text-slate-500,
        .light-theme aside .text-slate-500 {
          color: #d1fae5 !important;
        }
        .light-theme aside div.text-slate-400,
        .light-theme aside .text-slate-400 {
          color: #ffffff !important;
        }

        /* Bar Chart Animations & Custom Styling */
        @keyframes growUp {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
        .chart-bar {
          width: 28px !important;
          border-top-left-radius: 8px !important;
          border-top-right-radius: 8px !important;
          transform-origin: bottom !important;
          animation: growUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .chart-bar:hover {
          transform: scale(1.08) translateY(-5px) !important;
          filter: brightness(1.1) !important;
        }
        .bar-media {
          background: linear-gradient(to top, #059669, #34d399) !important;
        }
        .bar-perpus {
          background: linear-gradient(to top, #0284c7, #38bdf8) !important;
        }
        .bar-pesan {
          background: linear-gradient(to top, #e11d48, #fb7185) !important;
        }
        .light-theme #portal-publik-btn {
          background-color: #059669 !important;
          color: #ffffff !important;
          border-color: #047857 !important;
        }
        .light-theme #logout-btn {
          background-color: #ef4444 !important;
          color: #000000 !important;
          border-color: #dc2626 !important;
        }
        .light-theme .bg-slate-950 {
          background-color: var(--bg-card) !important;
        }
        .light-theme .bg-slate-900 {
          background-color: var(--bg-subcard) !important;
        }
        .light-theme .border-slate-850,
        .light-theme .border-slate-800,
        .light-theme .border-slate-900 {
          border-color: var(--border-color) !important;
        }
        .light-theme .text-slate-100,
        .light-theme .text-white {
          color: var(--text-primary) !important;
        }
        .light-theme .text-slate-200 {
          color: var(--text-secondary) !important;
        }
        .light-theme .text-slate-350,
        .light-theme .text-slate-400 {
          color: var(--text-muted) !important;
        }
        .light-theme .text-slate-500 {
          color: var(--text-muted) !important;
        }
        .light-theme input,
        .light-theme textarea,
        .light-theme select {
          background-color: var(--bg-card) !important;
          border-color: var(--border-color) !important;
          color: var(--text-primary) !important;
        }
        .light-theme button.bg-slate-900 {
          background-color: #e2e8f0 !important;
          color: var(--text-primary) !important;
        }
        .light-theme .hover\\:bg-slate-900\\/50:hover {
          background-color: rgba(226, 232, 240, 0.5) !important;
        }
        .light-theme td {
          border-color: var(--border-color) !important;
        }
        .light-theme tr {
          border-color: var(--border-color) !important;
        }
        .light-theme .bg-slate-900\\/40 {
          background-color: var(--bg-subcard) !important;
        }
      `}</style>

      {/* 1. TOP AUTH HEADER */}
      <header className="bg-slate-950 border-b border-slate-800 py-4 px-6 md:px-8 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-0.5 shadow-md border border-slate-200 shrink-0">
            <img src="/logo.png" alt="Logo RSKM" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider text-slate-100 uppercase">RS. Khusus Mata</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
              PROVINSI SUMATERA SELATAN
            </p>
          </div>
        </div>

        {/* User Role Info Banner */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-2 px-3 gap-3">
          <div className="flex flex-col text-left">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Terautentikasi:</span>
            <span className="text-[10px] font-black text-white">{currentUser?.email}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wide uppercase border ${role === "SUPER_ADMIN"
              ? (isLightMode ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-emerald-950 text-emerald-450 border border-emerald-800")
              : (isLightMode ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-yellow-950 text-yellow-450 border border-yellow-800")
            }`}>
            {role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN"}
          </span>
        </div>

        {/* Header Actions: Theme Switcher, Portal Link, Logout */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher Toggle */}
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isLightMode
                ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                : "bg-slate-900 border-slate-800 text-slate-350 hover:text-white"
              }`}
            title={isLightMode ? "Aktifkan Mode Gelap" : "Aktifkan Mode Terang"}
          >
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Public Portal Jumper */}
          <Link
            id="portal-publik-btn"
            href="/"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-500 transition-all"
          >
            <span>Portal Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Logout Button */}
          <button
            id="logout-btn"
            onClick={() => {
              confirmAction(
                "Apakah Anda yakin ingin keluar?",
                "Sesi Anda di portal administrasi akan diakhiri.",
                () => {
                  logout();
                  router.push("/login");
                },
                "Ya, Keluar!",
                "Batal"
              );
            }}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-650 text-black px-4 py-2.5 rounded-xl text-xs font-black border border-red-600 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Panel Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* 2. DYNAMIC SIDEBAR (ADAPTS BY ROLE) */}
        <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-850 p-4 shrink-0 flex flex-col gap-1 md:h-full md:overflow-y-auto">
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 py-2">
            Hak Akses: {role === "SUPER_ADMIN" ? "SUPER ADMIN (FULL)" : "ADMIN (RESTRICTED)"}
          </div>

          {/* Tab 1: Overview (All Roles) */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "overview" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
          >
            <Home className="w-4 h-4" />
            <span>Overview Ringkasan</span>
          </button>

          {/* Tab 2: Posts (Media Module - All Roles) */}
          <button
            onClick={() => setActiveTab("posts")}
            className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "posts" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modul Media (Postingan)</span>
          </button>

          {/* Tab 8: Perpustakaan (Library Module - All Roles) */}
          <button
            onClick={() => setActiveTab("library")}
            className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "library" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Modul Perpustakaan</span>
          </button>

          {/* Tab 9: Masukan & Aduan (Feedback Module - All Roles) */}
          <button
            onClick={() => setActiveTab("feedback")}
            className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "feedback" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
          >
            <Mail className="w-4 h-4" />
            <span>Pesan & Aduan</span>
          </button>

          {/* Restricted Menus (SUPER ADMIN ONLY) */}
          {role === "SUPER_ADMIN" && (
            <>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 py-2 mt-4">
                PENGATURAN STRUKTUR RS
              </div>

              {/* Tab 3: Dynamic Pages */}
              <button
                onClick={() => setActiveTab("pages")}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "pages" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span>Kelola Halaman Dinamis</span>
              </button>

              {/* Tab 4: Clinics */}
              <button
                onClick={() => setActiveTab("clinics")}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "clinics" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <Activity className="w-4 h-4" />
                <span>Kelola Profil Poliklinik</span>
              </button>

              {/* Tab 5: Doctors */}
              <button
                onClick={() => setActiveTab("doctors")}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "doctors" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Kelola Dokter Spesialis</span>
              </button>

              {/* Tab 6: Beds */}
              <button
                onClick={() => setActiveTab("beds")}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "beds" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <Bed className="w-4 h-4" />
                <span>Kapasitas Bed Rawat Inap</span>
              </button>

              {/* Tab 10: Jajaran Direksi (Super Admin Only) */}
              <button
                onClick={() => setActiveTab("directors")}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "directors" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Kelola Jajaran Direksi</span>
              </button>

              {/* Tab 7: Hero Slides */}
              <button
                onClick={() => setActiveTab("hero")}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "hero" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <Image className="w-4 h-4" />
                <span>Hero Carousel Beranda</span>
              </button>

              {/* Tab 11: Subscribers (Super Admin Only) */}
              <button
                onClick={() => setActiveTab("subscribers")}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "subscribers" ? "bg-slate-900 text-accent border border-slate-800" : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Kelola Subscriber</span>
              </button>
            </>
          )}

          {role === "ADMIN_BIASA" && (
            <div className="mt-6 p-4 bg-slate-900/50 border border-slate-800/60 rounded-2xl text-center space-y-2">
              <ShieldAlert className="w-6 h-6 text-yellow-500 mx-auto" />
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold uppercase">
                Menu Struktur Situs Dibatasi untuk Peran Anda. Hubungi Super Admin.
              </p>
            </div>
          )}
        </aside>

        {/* 3. DYNAMIC CONTENT WORKSPACE */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">

          {/* Notification Toast */}
          {successMsg && (
            <div className="bg-emerald-500 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg max-w-md animate-fade-in border border-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= WORKSPACE TAB: OVERVIEW (SUPER ADMIN) ================= */}
          {activeTab === "overview" && role === "SUPER_ADMIN" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black tracking-tight">Overview Ringkasan Informasi (Super Admin)</h2>
                <p className="text-xs text-slate-400 font-medium">Statistik lengkap pengelolaan database RSKM Prov Sumsel</p>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Halaman Dinamis (CMS)</span>
                  <span className="block text-3xl font-black text-emerald-500">{pages.length}</span>
                  <span className="block text-[9px] text-slate-400">Terdaftar di Menu Dropdown</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Poliklinik Aktif</span>
                  <span className="block text-3xl font-black text-emerald-500">{clinics.length}</span>
                  <span className="block text-[9px] text-slate-400">Tersedia Subspesialis</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Dokter Spesialis</span>
                  <span className="block text-3xl font-black text-emerald-500">{doctors.length}</span>
                  <span className="block text-[9px] text-slate-400">Terdaftar & Aktif</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Artikel & Berita</span>
                  <span className="block text-3xl font-black text-emerald-500">{posts.length}</span>
                  <span className="block text-[9px] text-slate-400">Telah Diterbitkan</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Perpustakaan File</span>
                  <span className="block text-3xl font-black text-emerald-500">{libraryItems.length}</span>
                  <span className="block text-[9px] text-slate-400">Buku, Jurnal & PPT</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Aduan Masuk</span>
                  <span className="block text-3xl font-black text-emerald-500">{feedbackMessages.length}</span>
                  <span className="block text-[9px] text-slate-400">Dari Pengunjung Situs</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Hero Slides</span>
                  <span className="block text-3xl font-black text-emerald-500">{heroSlides.length}</span>
                  <span className="block text-[9px] text-slate-400">Slider Carousel Aktif</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                  <span className="block text-[10px] font-black text-slate-500 uppercase">Jajaran Direksi</span>
                  <span className="block text-3xl font-black text-emerald-500">{directors.length}</span>
                  <span className="block text-[9px] text-slate-400">Direktur & Manajemen</span>
                </div>
              </div>

              {/* Bed Occupancy Capacity Overview */}
              <div className="p-6 bg-slate-950 border border-slate-850 rounded-3xl space-y-4">
                <h3 className="text-xs font-black tracking-wider uppercase text-slate-450 flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-emerald-500" />
                  <span>Okupansi Bed Rawat Inap Real-Time</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {beds.map((bed) => {
                    const pct = Math.round((bed.filled / bed.total_capacity) * 100);
                    return (
                      <div key={bed.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-200 line-clamp-1">{bed.class_name}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>Isi: {bed.filled}/{bed.total_capacity}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="block text-[9px] text-emerald-450 font-bold">Tersedia: {bed.available} Bed</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Feedback Messages */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 p-6 bg-slate-950 border border-slate-850 rounded-3xl space-y-4">
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-450 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span>Pesan & Pengaduan Terbaru</span>
                  </h3>
                  <div className="divide-y divide-slate-800">
                    {feedbackMessages.slice(0, 5).map((msg) => (
                      <div key={msg.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-200">{msg.name}</span>
                            <span className="text-[9px] text-slate-500 font-medium">({msg.contact})</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${msg.status === "unread" ? "bg-red-950 text-red-400 border border-red-900" :
                                msg.status === "read" ? "bg-blue-950 text-blue-450 border border-blue-900" :
                                  "bg-emerald-950 text-emerald-450 border border-emerald-900"
                              }`}>
                              {msg.status}
                            </span>
                          </div>
                          <span className="block text-[10px] font-bold text-slate-350">{msg.subject}</span>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl">{msg.message}</p>
                        </div>
                        <div className="flex md:flex-col justify-end gap-2 shrink-0">
                          {msg.status === "unread" && (
                            <button
                              onClick={() => {
                                createOrUpdateFeedbackMessage({ ...msg, status: "read" });
                                triggerNotification("Status aduan berhasil diperbarui ke 'read'!");
                              }}
                              className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:text-white px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
                            >
                              Tandai Dibaca
                            </button>
                          )}
                          <button
                            onClick={() => {
                              confirmAction(
                                "Hapus aduan?",
                                "Pesan aduan ini akan dihapus secara permanen.",
                                async () => {
                                  await removeFeedbackMessage(msg.id);
                                  triggerNotification("Pesan aduan berhasil dihapus!");
                                }
                              );
                            }}
                            className="text-[10px] bg-red-950/40 hover:bg-red-900 text-red-450 hover:text-white border border-red-900/60 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                    {feedbackMessages.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6 font-semibold">Belum ada aduan masuk.</p>
                    )}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="lg:col-span-4 p-6 bg-slate-950 border border-slate-850 rounded-3xl space-y-4">
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-450">
                    Pintasan Cepat
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => setActiveTab("pages")}
                      className="w-full text-left p-3.5 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white group transition-all"
                    >
                      <span>Kelola Halaman Dinamis</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setActiveTab("doctors")}
                      className="w-full text-left p-3.5 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white group transition-all"
                    >
                      <span>Tambah Dokter Spesialis</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setActiveTab("posts")}
                      className="w-full text-left p-3.5 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white group transition-all"
                    >
                      <span>Tulis Berita & Artikel</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setActiveTab("library")}
                      className="w-full text-left p-3.5 bg-slate-900 border border-slate-850 hover:border-slate-700 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white group transition-all"
                    >
                      <span>Unggah Dokumen Perpustakaan</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: OVERVIEW (ADMIN) ================= */}
          {activeTab === "overview" && role === "ADMIN_BIASA" && (() => {
            const mediaCount = posts.length;
            const libraryCount = libraryItems.length;
            const feedbackCount = feedbackMessages.length;

            const maxCount = Math.max(mediaCount, libraryCount, feedbackCount, 1);
            const mediaHeight = (mediaCount / maxCount) * 100;
            const libraryHeight = (libraryCount / maxCount) * 100;
            const feedbackHeight = (feedbackCount / maxCount) * 100;

            const latestFeedbacks = [...feedbackMessages].reverse().slice(0, 3);
            const latestPosts = [...posts].reverse().slice(0, 3);
            const latestLibrary = [...libraryItems].reverse().slice(0, 3);

            return (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">Overview Ringkasan Informasi (Admin)</h2>
                    <p className="text-xs text-slate-400 font-medium">Pengelolaan modul publikasi, perpustakaan digital, dan aduan masyarakat</p>
                  </div>

                </div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                    <span className="block text-[10px] font-black text-slate-500 uppercase">Artikel & Kegiatan</span>
                    <span className="block text-3xl font-black text-emerald-500">{mediaCount}</span>
                    <span className="block text-[9px] text-slate-400">Total Publikasi Media</span>
                  </div>
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                    <span className="block text-[10px] font-black text-slate-500 uppercase">Dokumen Perpustakaan</span>
                    <span className="block text-3xl font-black text-emerald-500">{libraryCount}</span>
                    <span className="block text-[9px] text-slate-400">Unggahan Buku & Jurnal</span>
                  </div>
                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-1">
                    <span className="block text-[10px] font-black text-slate-500 uppercase">Aduan Masyarakat</span>
                    <span className="block text-3xl font-black text-emerald-500">{feedbackCount}</span>
                    <span className="block text-[9px] text-slate-400">Pesan Masuk Layanan</span>
                  </div>
                </div>

                {/* Grid 1: Bar Chart & Inbox Feedbacks */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Bar Chart Card */}
                  <div className="lg:col-span-5 p-6 bg-slate-950 border border-slate-850 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Grafik Aktivitas Modul</h3>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold">Terintegrasi</span>
                    </div>

                    {/* Visual Chart Container */}
                    <div className="h-[180px] flex items-end justify-around gap-6 pb-2 border-b border-slate-850 relative">
                      {/* Background grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                        <div className="w-full border-t border-white"></div>
                        <div className="w-full border-t border-white"></div>
                        <div className="w-full border-t border-white"></div>
                        <div className="w-full border-t border-white"></div>
                      </div>

                      {/* Bar 1: Media */}
                      <div className="flex flex-col items-center gap-2 group cursor-pointer w-16">
                        <span className="text-xs font-black text-emerald-400 group-hover:scale-105 transition-transform">{mediaCount}</span>
                        <div className="h-[120px] w-full flex items-end justify-center">
                          <div 
                            style={{ height: `${Math.max(mediaHeight, 8)}%` }} 
                            className="chart-bar bar-media"
                            title={`${mediaCount} Postingan`}
                          ></div>
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Media</span>
                      </div>

                      {/* Bar 2: Perpustakaan */}
                      <div className="flex flex-col items-center gap-2 group cursor-pointer w-16">
                        <span className="text-xs font-black text-sky-400 group-hover:scale-105 transition-transform">{libraryCount}</span>
                        <div className="h-[120px] w-full flex items-end justify-center">
                          <div 
                            style={{ height: `${Math.max(libraryHeight, 8)}%` }} 
                            className="chart-bar bar-perpus"
                            title={`${libraryCount} Dokumen`}
                          ></div>
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Perpus</span>
                      </div>

                      {/* Bar 3: Pesan */}
                      <div className="flex flex-col items-center gap-2 group cursor-pointer w-16">
                        <span className="text-xs font-black text-rose-400 group-hover:scale-105 transition-transform">{feedbackCount}</span>
                        <div className="h-[120px] w-full flex items-end justify-center">
                          <div 
                            style={{ height: `${Math.max(feedbackHeight, 8)}%` }} 
                            className="chart-bar bar-pesan"
                            title={`${feedbackCount} Pesan`}
                          ></div>
                        </div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">Pesan</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-wide">Media</span>
                        <span className="text-sm font-black text-white">{mediaCount}</span>
                      </div>
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-wide">Perpus</span>
                        <span className="text-sm font-black text-white">{libraryCount}</span>
                      </div>
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-wide">Pesan</span>
                        <span className="text-sm font-black text-white">{feedbackCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Latest Feedback Inbox (Pesan & Aduan) */}
                  <div className="lg:col-span-7 p-6 bg-slate-950 border border-slate-850 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Pesan & Aduan Terbaru</h3>
                      <button
                        onClick={() => setActiveTab("feedback")}
                        className="text-[9px] font-black text-emerald-500 hover:text-emerald-450 hover:underline uppercase transition-all"
                      >
                        Buka Semua Inbox
                      </button>
                    </div>

                    <div className="space-y-3">
                      {latestFeedbacks.length === 0 ? (
                        <div className="text-center py-8 text-xs font-bold text-slate-500">
                          Belum ada pesan masuk saat ini.
                        </div>
                      ) : (
                        latestFeedbacks.map((fb) => (
                          <div key={fb.id} className="p-3.5 bg-slate-900 border border-slate-850 rounded-2xl flex flex-col gap-1 hover:border-slate-800 transition-colors">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-black text-slate-200">{fb.name}</span>
                              <span className="text-slate-500 font-medium">
                                {new Date(fb.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                            <span className="text-[9px] text-emerald-450 font-bold">{fb.contact}</span>
                            <p className="text-xs text-slate-355 leading-relaxed line-clamp-1 mt-1 font-medium">{fb.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid 2: Media & Library Recent Items */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Column A: Media (Postingan) */}
                  <div className="p-6 bg-slate-950 border border-slate-850 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Postingan Terbitan Terbaru</h3>
                      <button
                        onClick={() => setActiveTab("posts")}
                        className="text-[9px] font-black text-emerald-500 hover:text-emerald-450 hover:underline uppercase transition-all"
                      >
                        Tulis Artikel Baru
                      </button>
                    </div>

                    <div className="space-y-3">
                      {latestPosts.length === 0 ? (
                        <div className="text-center py-6 text-xs font-bold text-slate-500">
                          Belum ada postingan terpublikasi.
                        </div>
                      ) : (
                        latestPosts.map((post) => (
                          <div key={post.id} className="p-3 bg-slate-900 border border-slate-850 rounded-2xl flex gap-3 items-center">
                            {post.image_url && (
                              <img src={post.image_url} alt={post.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-200 truncate">{post.title}</span>
                              <div className="flex gap-2 items-center mt-1">
                                <span className="text-[8px] bg-slate-950 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-bold uppercase">
                                  {post.category === "kegiatan" ? "Kegiatan" : "Berita & Artikel"}
                                </span>
                                <span className="text-[9px] text-slate-500 font-medium">
                                  {new Date(post.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Column B: Library (Perpustakaan) */}
                  <div className="p-6 bg-slate-950 border border-slate-850 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Dokumen Perpus Terbaru</h3>
                      <button
                        onClick={() => setActiveTab("library")}
                        className="text-[9px] font-black text-emerald-500 hover:text-emerald-450 hover:underline uppercase transition-all"
                      >
                        Unggah Dokumen
                      </button>
                    </div>

                    <div className="space-y-3">
                      {latestLibrary.length === 0 ? (
                        <div className="text-center py-6 text-xs font-bold text-slate-500">
                          Belum ada dokumen di perpustakaan.
                        </div>
                      ) : (
                        latestLibrary.map((item) => (
                          <div key={item.id} className="p-3 bg-slate-900 border border-slate-850 rounded-2xl flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-black">
                              PDF
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-200 truncate">{item.title}</span>
                              <div className="flex gap-2 items-center mt-1">
                                <span className="text-[8px] bg-slate-950 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-bold uppercase">
                                  {item.category}
                                </span>
                                <span className="text-[9px] text-slate-500 font-medium">
                                  {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================= WORKSPACE TAB: PAGES (SUPER ADMIN ONLY) ================= */}
          {activeTab === "pages" && role === "SUPER_ADMIN" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black tracking-tight">Kelola Halaman Dinamis (CMS)</h2>
                <p className="text-xs text-slate-400 font-medium">Buat dan edit halaman publik berbasis template</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Col (Left) */}
                <form
                  onSubmit={handlePageSubmit}
                  className="lg:col-span-5 bg-slate-950 border border-slate-850 p-6 rounded-3xl space-y-4"
                >
                  <h3 className="text-sm font-black tracking-wide uppercase text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    <span>{pageForm.id ? "Edit Halaman" : "Tambah Halaman Baru"}</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Halaman</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Jadwal Spesial Hari Raya"
                      value={pageForm.title}
                      onChange={(e) => handlePageTitleChange(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">URL Slug (Otomatis)</label>
                    <input
                      type="text"
                      required
                      placeholder="contoh-jadwal-spesial"
                      value={pageForm.slug}
                      onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                      className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-350 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Template Layout</label>
                      <select
                        value={pageForm.layout_type}
                        onChange={(e) => setPageForm({ ...pageForm, layout_type: e.target.value as any })}
                        className="w-full text-xs font-bold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="standard">Standard (Fullwidth)</option>
                        <option value="split">Split (Teks & Foto)</option>
                        <option value="grid">Grid (Teks & Galeri)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grup Menu Navbar</label>
                      <select
                        value={pageForm.menu_group}
                        onChange={(e) => setPageForm({ ...pageForm, menu_group: e.target.value as any })}
                        className="w-full text-xs font-bold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="profil">Profil</option>
                        <option value="pelayanan">Pelayanan</option>
                        <option value="info_pengunjung">Info Pengunjung</option>
                        <option value="media">Media</option>
                      </select>
                    </div>
                  </div>

                  {(pageForm.layout_type === "standard" || pageForm.layout_type === "split" || pageForm.layout_type === "grid") && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {pageForm.layout_type === "grid" ? "Foto Utama / Cover" : "Gambar Sampul / Ilustrasi"}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (base64) => setPageForm(prev => ({ ...prev, image_url: base64 })))}
                        className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-350 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer"
                      />
                      {pageForm.image_url && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 mt-2">
                          <img src={pageForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}

                  {pageForm.layout_type === "grid" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Galeri Foto Pendukung (Bisa Banyak)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImagesUpload}
                        className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-350 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer"
                      />
                      {pageForm.grid_images && pageForm.grid_images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {pageForm.grid_images.map((img, idx) => (
                            <div key={idx} className="relative w-full h-16 rounded-xl overflow-hidden border border-slate-800 group">
                              <img src={img} alt={`Gallery Preview ${idx}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setPageForm(prev => ({
                                  ...prev,
                                  grid_images: prev.grid_images.filter((_, i) => i !== idx)
                                }))}
                                className="absolute inset-0 bg-red-955/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity"
                                title="Hapus foto ini"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Isi Halaman (HTML/Markdown)</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Masukkan tulisan atau kode HTML..."
                      value={pageForm.content}
                      onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                      className="w-full text-xs font-mono bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Halaman</span>
                    </button>
                    {pageForm.id && (
                      <button
                        type="button"
                        onClick={() =>
                          setPageForm({ id: "", title: "", slug: "", layout_type: "standard", menu_group: "profil", content: "", image_url: "", grid_images: [] })
                        }
                        className="bg-slate-800 text-slate-300 hover:bg-slate-750 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>

                {/* Table Col (Right) */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-850 p-6 rounded-3xl space-y-4 overflow-x-auto">
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Daftar Halaman Publik</h3>

                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-2">Judul</th>
                        <th className="py-3 px-2">Slug URL</th>
                        <th className="py-3 px-2">Layout</th>
                        <th className="py-3 px-2">Grup Navbar</th>
                        <th className="py-3 px-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40 text-xs font-semibold text-slate-300">
                      {pages.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-2 max-w-[140px] truncate">{p.title}</td>
                          <td className="py-3 px-2 font-mono text-[10px] text-emerald-400">/{p.slug}</td>
                          <td className="py-3 px-2 text-[10px] text-slate-400 capitalize">{p.layout_type}</td>
                          <td className="py-3 px-2">
                            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-[9px] text-slate-450 uppercase">
                              {p.menu_group.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right flex justify-end gap-1.5">
                            <button
                              onClick={() => loadPageToForm(p)}
                              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                              title="Edit Halaman"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {!["p1", "p2", "p3", "p4"].includes(p.id) && (
                              <button
                                onClick={() => handlePageDelete(p.id)}
                                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-900/30 border border-slate-800 hover:border-red-800 text-red-400 flex items-center justify-center transition-all cursor-pointer"
                                title="Hapus Halaman"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: POSTS (ALL ROLES) ================= */}
          {activeTab === "posts" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black tracking-tight">Modul Media & Publikasi</h2>
                <p className="text-xs text-slate-400 font-medium">Tulis dan terbitkan berita terbaru, artikel kesehatan, atau kegiatan rumah sakit</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Col (Left) */}
                <form
                  onSubmit={handlePostSubmit}
                  className="lg:col-span-5 bg-slate-950 border border-slate-850 p-6 rounded-3xl space-y-4"
                >
                  <h3 className="text-sm font-black tracking-wide uppercase text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    <span>{postForm.id ? "Edit Postingan" : "Tulis Postingan Baru"}</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Publikasi</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Tips Menjaga Mata dari Radiasi HP"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori Rubrik</label>
                      <select
                        value={postForm.category}
                        onChange={(e) => setPostForm({ ...postForm, category: e.target.value as any })}
                        className="w-full text-xs font-bold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="artikel">Berita & Artikel</option>
                        <option value="kegiatan">Kegiatan Rumah Sakit</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge Edukasi (Artikel)</label>
                      <input
                        type="text"
                        disabled={postForm.category !== "artikel"}
                        placeholder="EDUKASI / NUTRISI"
                        value={postForm.badge}
                        onChange={(e) => setPostForm({ ...postForm, badge: e.target.value })}
                        className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gambar Sampul</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (base64) => setPostForm(prev => ({ ...prev, image_url: base64 })))}
                      className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-350 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer"
                    />
                    {postForm.image_url && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 mt-2">
                        <img src={postForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Konten Isi Tulisan</label>
                    <textarea
                      required
                      rows={7}
                      placeholder="Tuliskan isi konten secara detail..."
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Terbitkan Sekarang</span>
                    </button>
                    {postForm.id && (
                      <button
                        type="button"
                        onClick={() => setPostForm({ id: "", title: "", category: "artikel", content: "", badge: "EDUKASI", image_url: "" })}
                        className="bg-slate-800 text-slate-300 hover:bg-slate-750 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>

                {/* Table Col (Right) */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-850 p-6 rounded-3xl space-y-4 overflow-x-auto">
                  <h3 className="text-xs font-black tracking-wider uppercase text-slate-400">Daftar Publikasi Aktif</h3>

                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <th className="py-3 px-2">Tanggal</th>
                        <th className="py-3 px-2">Judul</th>
                        <th className="py-3 px-2">Kategori</th>
                        <th className="py-3 px-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40 text-xs font-semibold text-slate-300">
                      {posts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-2 text-[10px] text-slate-400 font-mono">
                            {new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </td>
                          <td className="py-3 px-2 max-w-[200px] truncate">{p.title}</td>
                          <td className="py-3 px-2">
                            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md text-[9px] text-slate-400 uppercase font-bold">
                              {p.category === "kegiatan" ? "Kegiatan" : "Berita & Artikel"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right flex justify-end gap-1.5">
                            <button
                              onClick={() => loadPostToForm(p)}
                              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handlePostDelete(p.id)}
                              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-900/30 border border-slate-800 hover:border-red-800 text-red-400 flex items-center justify-center transition-all cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: CLINICS (SUPER ADMIN ONLY) ================= */}
          {activeTab === "clinics" && role === "SUPER_ADMIN" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black tracking-tight">Kelola Profil Poliklinik</h2>
                <p className="text-xs text-slate-400 font-medium">Edit profil deskripsi 11 poliklinik mata terpadu</p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-4xl">
                {clinics.map((clinic) => (
                  <div key={clinic.id} className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-black text-emerald-400">{clinic.name}</h3>
                      {editingClinicId !== clinic.id ? (
                        <button
                          onClick={() => startEditingClinic(clinic)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Profil</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PENGEDITAN AKTIF</span>
                      )}
                    </div>

                    {editingClinicId === clinic.id ? (
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleClinicSubmit(clinic); }}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi Poliklinik</label>
                          <textarea
                            required
                            rows={3}
                            value={clinicDescForm}
                            onChange={(e) => setClinicDescForm(e.target.value)}
                            className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto Poliklinik</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setClinicImageForm(base64))}
                            className="w-full text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-355 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer"
                          />
                          {clinicImageForm && (
                            <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-800 mt-2">
                              <img src={clinicImageForm} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button type="submit" className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer">
                            Simpan Perubahan
                          </button>
                          <button type="button" onClick={() => setEditingClinicId(null)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer">
                            Batal
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {clinic.image_url && (
                          <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                            <img src={clinic.image_url} alt={clinic.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{clinic.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: DOCTORS – FULL CRUD (SUPER ADMIN ONLY) ================= */}
          {activeTab === "doctors" && role === "SUPER_ADMIN" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Kelola Dokter Spesialis</h2>
                  <p className="text-xs text-slate-400 font-medium">Tambah, edit, dan hapus data dokter — termasuk jadwal & poliklinik</p>
                </div>
                <button
                  onClick={() => openDoctorForm()}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-slate-900 text-xs font-black py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Dokter Baru</span>
                </button>
              </div>

              {/* Doctor Add/Edit Modal Form */}
              {isDoctorFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                      <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        {doctorForm.id ? "Edit Data Dokter" : "Tambah Dokter Baru"}
                      </h3>
                      <button onClick={closeDoctorForm} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleDoctorSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                      {/* Preview foto */}
                      {doctorForm.image_url && (
                        <div className="flex justify-center">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/30">
                            <img src={doctorForm.image_url} alt="Preview" className="w-full h-full object-cover object-top" />
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap + Gelar</label>
                          <input
                            type="text"
                            required
                            placeholder="dr. Ahmad Syuhada, Sp.M(K)"
                            value={doctorForm.name}
                            onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                            className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spesialisasi</label>
                          <input
                            type="text"
                            required
                            placeholder="Spesialis Vitreoretina"
                            value={doctorForm.specialization}
                            onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                            className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori / Bidang</label>
                          <input
                            type="text"
                            required
                            placeholder="Vitreoretina / Glaukoma / Refraksi"
                            value={doctorForm.category}
                            onChange={(e) => setDoctorForm({ ...doctorForm, category: e.target.value })}
                            className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Poliklinik Layanan</label>
                          <select
                            required
                            value={doctorForm.clinic_slug}
                            onChange={(e) => setDoctorForm({ ...doctorForm, clinic_slug: e.target.value })}
                            className="w-full text-xs font-bold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="">-- Pilih Poliklinik --</option>
                            {clinics.map((c) => (
                              <option key={c.id} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto Dokter</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (base64) => setDoctorForm(prev => ({ ...prev, image_url: base64 })))}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-350 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Jadwal Praktek <span className="text-slate-500 normal-case">(Format: Hari: Jam — satu baris per jadwal)</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder={"Senin - Rabu: 08:00 - 12:00\nKamis: 13:00 - 15:30"}
                          value={doctorForm.scheduleRaw}
                          onChange={(e) => setDoctorForm({ ...doctorForm, scheduleRaw: e.target.value })}
                          className="w-full text-xs font-mono bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500">Contoh: <span className="font-mono text-emerald-500">Senin - Rabu: 08:00 - 12:00</span></p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Save className="w-4 h-4" />
                          <span>{doctorForm.id ? "Simpan Perubahan" : "Tambahkan Dokter"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={closeDoctorForm}
                          className="bg-slate-800 text-slate-300 hover:bg-slate-750 text-xs font-bold py-3 px-5 rounded-xl transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Doctors Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {doctors.map((doctor) => {
                  const linkedClinic = clinics.find((c) => c.slug === doctor.clinic_slug);
                  return (
                    <div key={doctor.id} className="p-5 bg-slate-950 border border-slate-850 rounded-3xl flex gap-4 items-start group">
                      {/* Doctor Avatar */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img src={doctor.image_url} alt={doctor.name} className="w-full h-full object-cover object-top" />
                      </div>

                      <div className="flex-1 space-y-2 min-w-0">
                        <div>
                          <h4 className="text-xs font-black text-slate-200 leading-tight truncate">{doctor.name}</h4>
                          <span className="text-[9px] font-bold text-slate-500 mt-0.5 block">{doctor.specialization}</span>
                        </div>

                        {/* Clinic badge */}
                        <div className="flex flex-wrap gap-1">
                          {linkedClinic && (
                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                              {linkedClinic.name}
                            </span>
                          )}
                          <span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {doctor.category}
                          </span>
                        </div>

                        {/* Schedule preview */}
                        <div className="space-y-0.5">
                          {Object.entries(doctor.schedule).map(([days, hours]: any) => (
                            <div key={days} className="flex justify-between items-center text-[9px] text-slate-400">
                              <span className="font-semibold truncate mr-1">{days}:</span>
                              <span className="font-mono text-emerald-400 font-bold shrink-0">{hours}</span>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => openDoctorForm(doctor)}
                            className="flex-1 text-[9px] font-black text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDoctorDelete(doctor.id, doctor.name)}
                            className="text-[9px] font-black text-red-400 hover:text-red-300 bg-slate-900 hover:bg-red-900/20 border border-slate-800 hover:border-red-800 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add New Doctor Card */}
                <button
                  onClick={() => openDoctorForm()}
                  className="p-5 bg-slate-950/50 border-2 border-dashed border-slate-800 hover:border-emerald-500/40 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-emerald-400 transition-all cursor-pointer group min-h-[180px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 group-hover:bg-emerald-500/10 border border-slate-800 group-hover:border-emerald-500/20 flex items-center justify-center transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wide">Tambah Dokter Baru</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: BEDS (SUPER ADMIN ONLY) ================= */}
          {activeTab === "beds" && role === "SUPER_ADMIN" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black tracking-tight">Kapasitas Kamar Rawat Inap (Bed)</h2>
                <p className="text-xs text-slate-400 font-medium">Update tingkat okupansi tempat tidur rumah sakit secara real-time</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {beds.map((bed) => (
                  <div key={bed.id} className="p-5 bg-slate-950 border border-slate-850 rounded-3xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black text-slate-200">{bed.class_name}</h4>
                        <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 block">Kapasitas Tempat Tidur</span>
                      </div>
                      {editingBedId !== bed.id && (
                        <button
                          onClick={() => startEditingBed(bed)}
                          className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                          title="Edit Kapasitas"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {editingBedId === bed.id ? (
                      <form onSubmit={handleBedSubmit} className="space-y-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Kapasitas Total</label>
                            <input
                              type="number"
                              required
                              value={bedForm.total_capacity}
                              onChange={(e) => setBedForm({ ...bedForm, total_capacity: parseInt(e.target.value) || 0 })}
                              className="w-full text-xs font-bold bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase">Bed Terisi</label>
                            <input
                              type="number"
                              required
                              value={bedForm.filled}
                              onChange={(e) => setBedForm({ ...bedForm, filled: parseInt(e.target.value) || 0 })}
                              className="w-full text-xs font-bold bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-800/60 mt-2">
                          <button type="submit" className="bg-primary hover:bg-primary-hover text-white text-[9px] font-bold px-3 py-1.5 rounded-md cursor-pointer">
                            Simpan Kapasitas
                          </button>
                          <button type="button" onClick={() => setEditingBedId(null)} className="bg-slate-800 text-slate-300 text-[9px] font-bold px-3 py-1.5 rounded-md cursor-pointer">
                            Batal
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-850/40">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-500 uppercase">Total Bed</span>
                          <span className="block text-lg font-black text-slate-300 mt-1">{bed.total_capacity}</span>
                        </div>
                        <div className="pl-2">
                          <span className="block text-[9px] font-bold text-slate-500 uppercase">Terisi</span>
                          <span className="block text-lg font-black text-red-400 mt-1">{bed.filled}</span>
                        </div>
                        <div className="pl-2">
                          <span className="block text-[9px] font-bold text-slate-500 uppercase">Tersedia</span>
                          <span className="block text-lg font-black text-emerald-400 mt-1">{bed.available}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: HERO SLIDES (SUPER ADMIN ONLY) ================= */}
          {activeTab === "hero" && role === "SUPER_ADMIN" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Hero Carousel Beranda</h2>
                  <p className="text-xs text-slate-400 font-medium">Atur foto, judul, dan teks pada slide hero halaman utama</p>
                </div>
                <button
                  onClick={() => openHeroForm()}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-slate-900 text-xs font-black py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Slide Baru</span>
                </button>
              </div>

              {/* Hero Add/Edit Modal Form */}
              {isHeroFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                      <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        {heroForm.id ? "Edit Slide Hero" : "Tambah Slide Hero Baru"}
                      </h3>
                      <button onClick={closeHeroForm} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleHeroSubmit} className="p-6 space-y-4">
                      {/* Preview */}
                      {heroForm.image_url && (
                        <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-700 relative">
                          <img src={heroForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent flex items-end p-3">
                            <div>
                              {heroForm.badge && <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">{heroForm.badge}</span>}
                              {heroForm.title && <p className="text-white text-xs font-black mt-1 line-clamp-1">{heroForm.title}</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gambar Latar Hero</label>
                        <input
                          type="file"
                          accept="image/*"
                          required={!heroForm.image_url}
                          onChange={(e) => handleImageUpload(e, (base64) => setHeroForm(prev => ({ ...prev, image_url: base64 })))}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-350 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urutan Tampil</label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={heroForm.order_index}
                          onChange={(e) => setHeroForm({ ...heroForm, order_index: parseInt(e.target.value) || 1 })}
                          className="w-full text-xs font-bold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Utama Slide</label>
                        <input
                          type="text"
                          required
                          placeholder="Penglihatan Jernih, Hidup Lebih Baik."
                          value={heroForm.title}
                          onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teks Deskripsi / Subtitle</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Deskripsi singkat tentang layanan atau program yang ditampilkan..."
                          value={heroForm.subtitle}
                          onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Save className="w-4 h-4" />
                          <span>{heroForm.id ? "Simpan Perubahan" : "Tambah Slide"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={closeHeroForm}
                          className="bg-slate-800 text-slate-300 hover:bg-slate-750 text-xs font-bold py-3 px-5 rounded-xl transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Hero Slides List */}
              <div className="space-y-4 max-w-4xl">
                {heroSlides.length === 0 && (
                  <div className="p-8 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
                    <Image className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold">Belum ada slide hero. Tambah slide pertama!</p>
                  </div>
                )}

                {heroSlides.map((slide, index) => (
                  <div key={slide.id} className="bg-slate-950 border border-slate-850 rounded-3xl overflow-hidden flex flex-col md:flex-row gap-0">
                    {/* Thumbnail */}
                    <div className="w-full md:w-64 h-40 md:h-auto shrink-0 relative overflow-hidden">
                      <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent" />
                      <div className="absolute top-3 left-3 bg-slate-900/80 border border-slate-700 rounded-lg px-2 py-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase">Urutan #{slide.order_index}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-100 leading-snug">{slide.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{slide.subtitle}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openHeroForm(slide)}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-bold px-3 py-2 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Slide</span>
                        </button>
                        <button
                          onClick={() => handleHeroDelete(slide.id)}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-red-900/20 border border-slate-800 hover:border-red-800 text-red-400 text-[10px] font-bold px-3 py-2 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: DIRECTORS (SUPER ADMIN ONLY) ================= */}
          {activeTab === "directors" && role === "SUPER_ADMIN" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Kelola Jajaran Direksi</h2>
                  <p className="text-xs text-slate-400 font-medium">Tambah, edit, dan hapus jajaran direksi rumah sakit</p>
                </div>
                <button
                  onClick={() => openDirectorForm()}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-slate-900 text-xs font-black py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Direksi Baru</span>
                </button>
              </div>

              {/* Jajaran Direksi Add/Edit Modal Form */}
              {isDirectorFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                      <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        {directorForm.id ? "Edit Data Anggota Direksi" : "Tambah Anggota Direksi Baru"}
                      </h3>
                      <button onClick={closeDirectorForm} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleDirectorSubmit} className="p-6 space-y-4">
                      {directorForm.image_url && (
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-700 mx-auto">
                          <img src={directorForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto Profil Direksi</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (base64) => setDirectorForm(prev => ({ ...prev, image_url: base64 })))}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-355 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap & Gelar</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: dr. Lady Kavotiner, Sp.M"
                          value={directorForm.name}
                          onChange={(e) => setDirectorForm({ ...directorForm, name: e.target.value })}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jabatan / Posisi</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Direktur Utama / Kepala Bidang Pelayanan"
                          value={directorForm.position}
                          onChange={(e) => setDirectorForm({ ...directorForm, position: e.target.value })}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5">
                          <Save className="w-4 h-4" />
                          <span>Simpan Anggota</span>
                        </button>
                        <button type="button" onClick={closeDirectorForm} className="bg-slate-800 text-slate-300 hover:bg-slate-750 text-xs font-bold py-3 px-5 rounded-xl transition-all cursor-pointer">
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Jajaran Direksi Grid Table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {directors.map((dir) => (
                  <div key={dir.id} className="bg-slate-950 border border-slate-850 p-5 rounded-3xl flex flex-col justify-between items-center text-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-800">
                      <img src={dir.image_url} alt={dir.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-100">{dir.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mt-1 block">{dir.position}</span>
                    </div>

                    <div className="flex gap-2 w-full pt-2 border-t border-slate-855 mt-1">
                      <button
                        onClick={() => openDirectorForm(dir)}
                        className="flex-1 text-[9px] font-black text-slate-300 hover:text-white bg-slate-900 border border-slate-800 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDirectorDelete(dir.id, dir.name)}
                        className="text-[9px] font-black text-red-400 bg-slate-900 border border-slate-800 hover:border-red-800 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: LIBRARY (ALL ROLES) ================= */}
          {activeTab === "library" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Modul Perpustakaan Digital</h2>
                  <p className="text-xs text-slate-400 font-medium">Unggah buku panduan pasien, bahan presentasi RS, dan jurnal medis</p>
                </div>
                <button
                  onClick={() => openLibraryForm()}
                  className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-slate-900 text-xs font-black py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Item Perpustakaan</span>
                </button>
              </div>

              {/* Library Form Modal Dialog */}
              {isLibraryFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                      <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {libraryForm.id ? "Edit Buku / Dokumen Perpustakaan" : "Unggah Buku / Dokumen Baru"}
                      </h3>
                      <button onClick={closeLibraryForm} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleLibrarySubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                      {/* Image cover upload */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gambar Cover</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => setLibraryForm(prev => ({ ...prev, image_url: base64 })))}
                            className="w-full text-xs font-semibold bg-slate-855 border border-slate-800 rounded-xl p-2.5 text-slate-350 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-black file:bg-primary file:text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Dokumen (PDF/PPT)</label>
                          <input
                            type="file"
                            accept=".pdf,.ppt,.pptx,.doc,.docx"
                            onChange={handleLibraryFileUpload}
                            className="w-full text-xs font-semibold bg-slate-855 border border-slate-800 rounded-xl p-2.5 text-slate-355 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-black file:bg-primary file:text-white"
                          />
                        </div>
                      </div>

                      {libraryForm.file_name && (
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center text-xs">
                          <span className="font-mono text-emerald-400 font-bold truncate max-w-[320px]">{libraryForm.file_name}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold uppercase">Ready</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Dokumen</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Panduan Operasi Katarak"
                            value={libraryForm.title}
                            onChange={(e) => setLibraryForm({ ...libraryForm, title: e.target.value })}
                            className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori Pustaka</label>
                          <select
                            value={libraryForm.category}
                            onChange={(e) => setLibraryForm({ ...libraryForm, category: e.target.value as any })}
                            className="w-full text-xs font-bold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <option value="buku">Buku Saku (Edukasi)</option>
                            <option value="jurnal">Jurnal Medis (Oftalmologi)</option>
                            <option value="panduan">Panduan Pelayanan Pasien</option>
                            <option value="presentasi">Bahan Presentasi (PPT/PDF)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi Singkat Dokumen</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Deskripsi singkat isi dokumen dan manfaatnya bagi pembaca..."
                          value={libraryForm.description}
                          onChange={(e) => setLibraryForm({ ...libraryForm, description: e.target.value })}
                          className="w-full text-xs font-semibold bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5">
                          <Save className="w-4 h-4" />
                          <span>Simpan Pustaka</span>
                        </button>
                        <button type="button" onClick={closeLibraryForm} className="bg-slate-800 text-slate-300 hover:bg-slate-750 text-xs font-bold py-3 px-5 rounded-xl transition-all cursor-pointer">
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Library Items List */}
              <div className="space-y-4 max-w-4xl">
                {libraryItems.length === 0 && (
                  <div className="p-8 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold">Belum ada item pustaka. Tambah dokumen pertama!</p>
                  </div>
                )}

                {libraryItems.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-855 p-5 rounded-3xl flex flex-col md:flex-row gap-5 items-center">
                    <div className="w-20 h-24 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                      <img src={item.image_url} alt="Cover" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left w-full">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">{item.category}</span>
                        <span className="text-[9px] font-bold text-slate-500 font-mono">{item.file_name}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-100 leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex gap-2 shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => openLibraryForm(item)}
                        className="flex-1 md:flex-initial text-[10px] font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 py-2 px-3 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleLibraryDelete(item.id, item.title)}
                        className="text-[10px] font-bold text-red-400 bg-slate-900 border border-slate-800 hover:border-red-800 py-2 px-3 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: FEEDBACK (ALL ROLES) ================= */}
          {activeTab === "feedback" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-black tracking-tight">Kotak Masuk Aduan & Pesan</h2>
                <p className="text-xs text-slate-400 font-medium">Tinjau laporan dan pertanyaan yang dikirim pengunjung via Hubungi Kami</p>
              </div>

              <div className="space-y-4 max-w-4xl">
                {feedbackMessages.length === 0 && (
                  <div className="p-8 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-bold">Kotak masuk kosong. Belum ada aduan yang diterima.</p>
                  </div>
                )}

                {feedbackMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-slate-950 border rounded-3xl p-5 space-y-4 transition-all ${msg.status === "unread" ? "border-emerald-600/40 shadow-md shadow-emerald-950/10" : "border-slate-855"
                      }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-850/60 pb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-200">{msg.name}</h4>
                          {msg.status === "unread" && (
                            <span className="bg-emerald-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">Baru</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium font-mono">Kontak: {msg.contact}</p>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg text-slate-400 uppercase">Subjek: {msg.subject}</span>
                        <span className="text-slate-500">{new Date(msg.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-900/50 p-4 border border-slate-900 rounded-2xl">
                      "${msg.message}"
                    </p>

                    <div className="flex gap-2 justify-end pt-1">
                      {msg.status === "unread" ? (
                        <button
                          onClick={() => handleFeedbackStatusChange(msg, "read")}
                          className="text-[10px] font-black text-emerald-400 hover:text-slate-950 bg-slate-900 border border-slate-850 hover:bg-emerald-500 hover:border-emerald-500 py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Tandai Sudah Dibaca</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 px-3 py-1.5">
                          <Check className="w-3.5 h-3.5 text-slate-500" />
                          <span>Sudah Dibaca</span>
                        </span>
                      )}
                      <button
                        onClick={() => handleFeedbackDelete(msg.id)}
                        className="text-[10px] font-black text-red-400 hover:text-red-300 bg-slate-900 border border-slate-800 hover:border-red-800 py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= WORKSPACE TAB: SUBSCRIBERS (SUPER ADMIN ONLY) ================= */}
          {activeTab === "subscribers" && role === "SUPER_ADMIN" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-850 pb-3 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white">Kelola Subscriber Newsletter</h2>
                  <p className="text-xs text-slate-400 font-medium">Daftar email pengunjung yang berlangganan kabar berita & publikasi RSKM</p>
                </div>
                <button
                  onClick={downloadSubscribersCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor List Excel (CSV)</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-850 rounded-3xl overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-850 bg-slate-900/40 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-300">Total Terdaftar: {subscribers.length} email</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-850 text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-900/10">
                        <th className="py-4 px-6 w-16">No</th>
                        <th className="py-4 px-6">Email Address</th>
                        <th className="py-4 px-6">Tanggal Terdaftar</th>
                        <th className="py-4 px-6 text-center w-24">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-xs font-bold text-slate-500">
                            Belum ada subscriber terdaftar.
                          </td>
                        </tr>
                      ) : (
                        subscribers.map((sub, idx) => (
                          <tr key={sub.id} className="border-b border-slate-850/50 hover:bg-slate-900/20 transition-colors">
                            <td className="py-4 px-6 text-xs text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-4 px-6 text-xs font-bold text-slate-200">{sub.email}</td>
                            <td className="py-4 px-6 text-xs text-slate-400">
                              {new Date(sub.created_at).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => {
                                  confirmAction(
                                    "Hapus subscriber?",
                                    `Email ${sub.email} akan dihapus dari daftar newsletter.`,
                                    async () => {
                                      await removeSubscriber(sub.id!);
                                      triggerNotification(`Subscriber ${sub.email} berhasil dihapus.`);
                                    }
                                  );
                                }}
                                className="text-red-400 hover:text-red-350 p-1.5 rounded-lg hover:bg-slate-900 transition-all inline-flex items-center cursor-pointer"
                                title="Hapus Subscriber"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
