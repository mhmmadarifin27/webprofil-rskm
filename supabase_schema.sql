-- SUPABASE DATABASE SCHEMA FOR RSKM PROV. SUMSEL
-- Copy and run this script in the Supabase SQL Editor to set up your database tables.

-- ==========================================
-- 1. Table: profiles (for user authentication & roles)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN_BIASA')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Public profiles are readable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Trigger to automatically create a profile record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role)
    VALUES (new.id, 'ADMIN_BIASA'); -- Defaults to ADMIN_BIASA, can be updated to SUPER_ADMIN by DB Admin
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- 2. Table: pages (Dynamic Pages / CMS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    layout_type TEXT NOT NULL CHECK (layout_type IN ('standard', 'split', 'grid', 'facilities', 'contact')),
    menu_group TEXT NOT NULL CHECK (menu_group IN ('profil', 'pelayanan', 'info_pengunjung', 'media')),
    is_published BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    grid_images JSONB, -- Array of image URLs
    facilities_data JSONB -- Array of facility objects {title, desc, icon}
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pages are readable by everyone" ON public.pages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify pages" ON public.pages FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 3. Table: clinics (Layanan Poliklinik)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.clinics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    facilities JSONB -- Array of facility strings
);

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinics are readable by everyone" ON public.clinics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify clinics" ON public.clinics FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 4. Table: doctors (Data Dokter & Jadwal)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.doctors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    category TEXT NOT NULL,
    schedule JSONB NOT NULL, -- Map object representing schedules e.g. {"Senin": "08:00 - 12:00"}
    image_url TEXT NOT NULL,
    clinic_slug TEXT NOT NULL
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Doctors are readable by everyone" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify doctors" ON public.doctors FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 5. Table: posts (News, Articles, Activities)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('berita', 'artikel', 'kegiatan')),
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    badge TEXT
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are readable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify posts" ON public.posts FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 6. Table: beds (Hospital Bed Availability)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.beds (
    id TEXT PRIMARY KEY,
    class_name TEXT NOT NULL,
    total_capacity INTEGER NOT NULL,
    available INTEGER NOT NULL,
    filled INTEGER NOT NULL
);

ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Beds are readable by everyone" ON public.beds FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify beds" ON public.beds FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 7. Table: hero_slides (Slider Banner Utama)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    badge TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER NOT NULL
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero slides are readable by everyone" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify hero slides" ON public.hero_slides FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 8. Table: directors (Jajaran Direksi)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.directors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    image_url TEXT NOT NULL
);

ALTER TABLE public.directors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Directors are readable by everyone" ON public.directors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify directors" ON public.directors FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 9. Table: library (Perpustakaan & Media File)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.library (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('buku', 'jurnal', 'panduan', 'presentasi')),
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Library items are readable by everyone" ON public.library FOR SELECT USING (true);
CREATE POLICY "Authenticated users can modify library items" ON public.library FOR ALL USING (auth.role() = 'authenticated');


-- ==========================================
-- 10. Table: feedback (Hubungi Kami / Pengaduan)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.feedback (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('unread', 'read', 'replied'))
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
-- For public submission and authenticated management
CREATE POLICY "Feedback is insertable by anyone" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can manage feedback" ON public.feedback FOR ALL USING (auth.role() = 'authenticated');
