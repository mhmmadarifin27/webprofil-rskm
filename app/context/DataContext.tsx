"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PageData,
  DoctorData,
  ClinicData,
  PostData,
  BedData,
  HeroSlideData,
  DirectorData,
  LibraryItem,
  FeedbackMessage,
  getPages,
  savePage,
  deletePage,
  getClinics,
  saveClinic,
  getDoctors,
  saveDoctor,
  deleteDoctor,
  getPosts,
  savePost,
  deletePost,
  getBeds,
  saveBed,
  getHeroSlides,
  saveHeroSlide,
  deleteHeroSlide,
  getDirectors,
  saveDirector,
  deleteDirector,
  getLibraryItems,
  saveLibraryItem,
  deleteLibraryItem,
  getFeedbackMessages,
  saveFeedbackMessage,
  deleteFeedbackMessage,
  SubscriberData,
  getSubscribers,
  deleteSubscriber,
  defaultHeroSlides,
} from "@/lib/db";
import { supabase, isSupabaseConnected } from "@/lib/supabase";

export type Role = "SUPER_ADMIN" | "ADMIN_BIASA";

export interface UserSession {
  email: string;
  role: Role;
}

interface DataContextType {
  pages: PageData[];
  clinics: ClinicData[];
  doctors: DoctorData[];
  posts: PostData[];
  beds: BedData[];
  heroSlides: HeroSlideData[];
  directors: DirectorData[];
  libraryItems: LibraryItem[];
  feedbackMessages: FeedbackMessage[];
  subscribers: SubscriberData[];
  currentUser: UserSession | null;
  isLoading: boolean;
  
  // Auth
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // CRUD hooks
  createOrUpdatePage: (page: Omit<PageData, "id"> & { id?: string }) => Promise<PageData>;
  removePage: (id: string) => Promise<void>;
  createOrUpdatePost: (post: Omit<PostData, "id" | "created_at"> & { id?: string }) => Promise<PostData>;
  removePost: (id: string) => Promise<void>;
  updateBedCapacity: (bed: BedData) => Promise<void>;
  createOrUpdateDoctor: (doctor: DoctorData) => Promise<void>;
  removeDoctor: (id: string) => Promise<void>;
  updateClinicProfile: (clinic: ClinicData) => Promise<void>;
  createOrUpdateHeroSlide: (slide: HeroSlideData) => Promise<void>;
  removeHeroSlide: (id: string) => Promise<void>;
  reorderHeroSlides: (orderedSlides: HeroSlideData[]) => Promise<void>;
  setLocalHeroSlides: (slides: HeroSlideData[]) => void;
  createOrUpdateDirector: (director: DirectorData) => Promise<void>;
  removeDirector: (id: string) => Promise<void>;
  createOrUpdateLibraryItem: (item: LibraryItem) => Promise<void>;
  removeLibraryItem: (id: string) => Promise<void>;
  createOrUpdateFeedbackMessage: (msg: FeedbackMessage) => Promise<void>;
  removeFeedbackMessage: (id: string) => Promise<void>;
  removeSubscriber: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<PageData[]>([]);
  const [clinics, setClinics] = useState<ClinicData[]>([]);
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [beds, setBeds] = useState<BedData[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlideData[]>(defaultHeroSlides);
  const [directors, setDirectors] = useState<DirectorData[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Core Async Data Loader
  const loadAllData = async () => {
    try {
      const promises = [
        getPages().then(setPages),
        getClinics().then(setClinics),
        getDoctors().then(setDoctors),
        getPosts().then(setPosts),
        getBeds().then(setBeds),
        getHeroSlides().then(setHeroSlides),
        getDirectors().then(setDirectors),
        getLibraryItems().then(setLibraryItems),
        getFeedbackMessages().then(setFeedbackMessages),
        getSubscribers().then(setSubscribers),
      ];
      await Promise.all(promises);
    } catch (e) {
      console.error("Error loading async data: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Mount logic
  useEffect(() => {
    loadAllData();

    // Check Auth Session
    const checkSession = async () => {
      if (isSupabaseConnected() && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();
            
            setCurrentUser({
              email: session.user.email || "",
              role: (!error && data?.role) ? (data.role as Role) : "ADMIN_BIASA",
            });
          } catch (e) {
            setCurrentUser({
              email: session.user.email || "",
              role: "ADMIN_BIASA",
            });
          }
        }
      } else {
        // Mock Session
        const savedSession = localStorage.getItem("rskm_session");
        if (savedSession) {
          try {
            setCurrentUser(JSON.parse(savedSession));
          } catch {
            localStorage.removeItem("rskm_session");
          }
        }
      }
    };

    checkSession();
  }, []);

  // Login handler
  const login = async (email: string, password: string) => {
    if (isSupabaseConnected() && supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError || !authData.user) {
          return { success: false, error: authError?.message || "Login failed" };
        }
        
        // Fetch Role from profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();
        
        const role: Role = (!profileError && profile?.role) ? (profile.role as Role) : "ADMIN_BIASA";
        const sessionUser = { email: authData.user.email || "", role };
        setCurrentUser(sessionUser);
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message || "An unexpected error occurred" };
      }
    } else {
      // Mock Login
      const lowerEmail = email.toLowerCase().trim();
      if (lowerEmail === "superadmin@rskm.com" && password === "admin123") {
        const sessionUser: UserSession = { email: "superadmin@rskm.com", role: "SUPER_ADMIN" };
        setCurrentUser(sessionUser);
        localStorage.setItem("rskm_session", JSON.stringify(sessionUser));
        return { success: true };
      } else if (lowerEmail === "admin@rskm.com" && password === "admin123") {
        const sessionUser: UserSession = { email: "admin@rskm.com", role: "ADMIN_BIASA" };
        setCurrentUser(sessionUser);
        localStorage.setItem("rskm_session", JSON.stringify(sessionUser));
        return { success: true };
      }
      return { success: false, error: "Email atau password salah!" };
    }
  };

  // Logout handler
  const logout = async () => {
    if (isSupabaseConnected() && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("rskm_session");
    }
    setCurrentUser(null);
  };

  // CMS Mutation Handlers
  const createOrUpdatePage = async (page: Omit<PageData, "id"> & { id?: string }) => {
    const saved = await savePage(page);
    const updated = await getPages();
    setPages(updated);
    return saved;
  };

  const removePage = async (id: string) => {
    await deletePage(id);
    const updated = await getPages();
    setPages(updated);
  };

  const createOrUpdatePost = async (post: Omit<PostData, "id" | "created_at"> & { id?: string }) => {
    const saved = await savePost(post);
    const updated = await getPosts();
    setPosts(updated);
    return saved;
  };

  const removePost = async (id: string) => {
    await deletePost(id);
    const updated = await getPosts();
    setPosts(updated);
  };

  const updateBedCapacity = async (bed: BedData) => {
    await saveBed(bed);
    const updated = await getBeds();
    setBeds(updated);
  };

  const createOrUpdateDoctor = async (doctor: DoctorData) => {
    await saveDoctor(doctor);
    const updated = await getDoctors();
    setDoctors(updated);
  };

  const removeDoctor = async (id: string) => {
    await deleteDoctor(id);
    const updated = await getDoctors();
    setDoctors(updated);
  };

  const updateClinicProfile = async (clinic: ClinicData) => {
    await saveClinic(clinic);
    const updated = await getClinics();
    setClinics(updated);
  };

  const createOrUpdateHeroSlide = async (slide: HeroSlideData) => {
    await saveHeroSlide(slide);
    const updated = await getHeroSlides();
    setHeroSlides(updated);
  };

  const removeHeroSlide = async (id: string) => {
    await deleteHeroSlide(id);
    const updated = await getHeroSlides();
    setHeroSlides(updated);
  };

  const reorderHeroSlides = async (orderedSlides: HeroSlideData[]) => {
    const slidesWithNewIndices = orderedSlides.map((slide, idx) => ({
      ...slide,
      order_index: idx + 1,
    }));
    setHeroSlides(slidesWithNewIndices);

    try {
      const promises = slidesWithNewIndices.map((slide) => saveHeroSlide(slide));
      await Promise.all(promises);
    } catch (e) {
      console.error("Gagal menyimpan urutan baru slide hero:", e);
      const original = await getHeroSlides();
      setHeroSlides(original);
      throw e;
    }
  };

  const createOrUpdateDirector = async (director: DirectorData) => {
    await saveDirector(director);
    const updated = await getDirectors();
    setDirectors(updated);
  };

  const removeDirector = async (id: string) => {
    await deleteDirector(id);
    const updated = await getDirectors();
    setDirectors(updated);
  };

  const createOrUpdateLibraryItem = async (item: LibraryItem) => {
    await saveLibraryItem(item);
    const updated = await getLibraryItems();
    setLibraryItems(updated);
  };

  const removeLibraryItem = async (id: string) => {
    await deleteLibraryItem(id);
    const updated = await getLibraryItems();
    setLibraryItems(updated);
  };

  const createOrUpdateFeedbackMessage = async (msg: FeedbackMessage) => {
    await saveFeedbackMessage(msg);
    const updated = await getFeedbackMessages();
    setFeedbackMessages(updated);
  };

  const removeFeedbackMessage = async (id: string) => {
    await deleteFeedbackMessage(id);
    const updated = await getFeedbackMessages();
    setFeedbackMessages(updated);
  };

  const removeSubscriber = async (id: string) => {
    await deleteSubscriber(id);
    const updated = await getSubscribers();
    setSubscribers(updated);
  };

  return (
    <DataContext.Provider
      value={{
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
        login,
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
        reorderHeroSlides,
        setLocalHeroSlides: setHeroSlides,
        createOrUpdateDirector,
        removeDirector,
        createOrUpdateLibraryItem,
        removeLibraryItem,
        createOrUpdateFeedbackMessage,
        removeFeedbackMessage,
        removeSubscriber,
        refreshData: loadAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
