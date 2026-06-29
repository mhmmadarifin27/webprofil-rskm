// lib/db.ts
import { supabase } from "./supabase";

export interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  layout_type: "standard" | "split" | "grid" | "facilities" | "contact";
  menu_group: "profil" | "pelayanan" | "info_pengunjung" | "media";
  is_published: boolean;
  image_url?: string; // Cover photo
  grid_images?: string[]; // Multiple photos for grid
  facilities_data?: { title: string; desc: string; icon: string }[]; // For facilities layout
}

export interface DoctorData {
  id: string;
  name: string;
  specialization: string;
  category: string; // e.g. "Vitreoretina", "Glaukoma", "Refraksi", "Mata Anak"
  schedule: Record<string, string>; // e.g. { "Senin": "08:00 - 12:00" }
  image_url: string; // Base64 or URL
  clinic_slug: string; // associated clinic
}

export interface ClinicData {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  facilities?: string[];
}

export interface PostData {
  id: string;
  title: string;
  category: "berita" | "artikel" | "kegiatan";
  content: string;
  image_url: string;
  created_at: string;
  badge?: string; // e.g. "EDUKASI", "DOKUMENTASI"
}

export interface BedData {
  id: string;
  class_name: string;
  total_capacity: number;
  available: number;
  filled: number;
}

export interface HeroSlideData {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image_url: string;
  order_index: number;
}

// ================= MOCK DATA INITIALIZATION =================

export const defaultHeroSlides: HeroSlideData[] = [
  {
    id: "h1",
    title: "Penglihatan Jernih, Hidup Lebih Baik.",
    subtitle: "RS Khusus Mata Provinsi Sumatera Selatan menyediakan pelayanan kesehatan mata terpadu dengan standar KARS Paripurna.",
    badge: "Layanan Mata Terpadu",
    image_url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=1200&auto=format&fit=crop&q=80",
    order_index: 1
  },
  {
    id: "h2",
    title: "Teknologi Modern, Hasil Presisi.",
    subtitle: "Menggunakan peralatan mutakhir tingkat internasional untuk penanganan katarak, glaukoma, dan retina secara minimal invasif.",
    badge: "Teknologi Medis Mutakhir",
    image_url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=1200&auto=format&fit=crop&q=80",
    order_index: 2
  },
  {
    id: "h3",
    title: "Dokter Spesialis & Subspesialis Berpengalaman.",
    subtitle: "Didukung oleh jajaran dokter ahli spesialis mata (Sp.M) berdedikasi tinggi demi kesehatan mata Anda.",
    badge: "Tim Medis Ahli",
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=80",
    order_index: 3
  }
];

const defaultPages: PageData[] = [
  {
    id: "p_renstra",
    title: "REANSTRA",
    slug: "renstra",
    content: `
      <div class="space-y-6">
        <p class="text-sm leading-relaxed text-slate-500 font-medium">
          Rencana Strategis (RENSTRA) RS Khusus Mata Provinsi Sumatera Selatan disusun sebagai pedoman penyelenggaraan pelayanan dan pembangunan rumah sakit untuk jangka waktu 5 tahun ke depan.
        </p>
        <div>
          <h3 class="text-lg font-black text-primary mb-2">Arah Kebijakan</h3>
          <p class="text-slate-600 border-l-4 border-primary pl-4 py-2 text-sm bg-emerald-50/50 rounded-r font-medium">
            Fokus utama RENSTRA adalah modernisasi peralatan diagnostik dan operasi mata, perluasan gedung rawat inap, serta penguatan kompetensi dokter spesialis untuk mencapai predikat pusat rujukan mata regional terkemuka.
          </p>
        </div>
      </div>
    `,
    layout_type: "standard",
    menu_group: "profil",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_tentang",
    title: "Tentang Kami",
    slug: "tentang-kami",
    content: `
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-black text-primary mb-2">Sejarah Singkat & Pendirian</h3>
          <p class="text-sm text-slate-500 font-medium leading-relaxed mb-3">
            Rumah Sakit Khusus Mata (RSKM) Provinsi Sumatera Selatan didirikan awal mulanya sebagai bentuk kepedulian Pemerintah Provinsi Sumatera Selatan terhadap tingginya angka kebutaan akibat katarak dan gangguan refraksi lainnya di wilayah Sumatera Selatan dan sekitarnya. RSKM awalnya beroperasi sebagai UPTD Balai Kesehatan Mata Masyarakat (BKMM) sebelum akhirnya bertransformasi menjadi Rumah Sakit Khusus Mata tipe B milik Pemerintah Provinsi Sumatera Selatan.
          </p>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">
            Sejak transformasi tersebut, RSKM terus berkomitmen menghadirkan pelayanan kesehatan mata terbaik dan menjadi pusat rujukan utama di tingkat regional. Dengan dedikasi tinggi, rumah sakit ini telah berhasil mempertahankan akreditasi **Bintang Lima (Paripurna)** dari Komite Akreditasi Rumah Sakit (KARS).
          </p>
        </div>

        <div>
          <h3 class="text-lg font-black text-primary mb-2">Makna Logo RSKM "BINAR"</h3>
          <p class="text-sm text-slate-500 font-medium leading-relaxed mb-3">
            Logo resmi RSKM Prov. Sumsel memadukan simbol grafis mata, inisial institusi, dan pancaran sinar "Binar" yang merefleksikan nilai-nilai inti rumah sakit:
          </p>
          <ul class="space-y-2 text-sm text-slate-500 list-disc pl-5 font-semibold">
            <li>
              <span class="text-primary font-bold">Simbol Kelopak Mata:</span> Melambangkan spesialisasi dan fokus utama pelayanan medis rumah sakit yang didedikasikan sepenuhnya untuk kesehatan mata masyarakat.
            </li>
            <li>
              <span class="text-primary font-bold">Pancaran Cahaya / Binar:</span> Melambangkan harapan baru, kesembuhan, dan visi yang jernih bagi pasien pasca-perawatan di RSKM.
            </li>
            <li>
              <span class="text-primary font-bold">Dominasi Warna Hijau:</span> Melambangkan pertumbuhan, keseimbangan, serta suasana pelayanan kesehatan yang aman, profesional, dan menyejukkan.
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-lg font-black text-primary mb-2">Tonggak Sejarah & Layanan Unggulan</h3>
          <p class="text-sm text-slate-500 font-medium leading-relaxed mb-3">
            Dalam perjalanannya, RSKM terus berinovasi dalam penyediaan sarana dan prasarana medis tingkat internasional, termasuk teknologi operasi Phacoemulsifikasi minimal invasif untuk katarak, laser retina, serta sistem rekam medis elektronik terintegrasi.
          </p>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">
            Didukung oleh jajaran dokter spesialis dan subspesialis mata terbaik, RSKM Prov. Sumsel siap menjaga kesehatan mata Anda dan keluarga dengan layanan yang ramah, cepat, dan terjangkau.
          </p>
        </div>
      </div>
    `,
    layout_type: "split",
    menu_group: "profil",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1582750433449-649352e3ff4a?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p1",
    title: "Visi & Misi",
    slug: "visi-misi",
    content: `
      <div class="space-y-6">
        <p class="text-sm leading-relaxed text-slate-500 font-medium">
          Sebagai pusat rujukan pelayanan kesehatan mata utama di wilayah Sumatera Selatan, RSKM Provinsi Sumatera Selatan berkomitmen memberikan pelayanan berkualitas tinggi yang didukung teknologi modern dan tenaga medis profesional.
        </p>
        
        <div>
          <h3 class="text-lg font-black text-primary mb-2">Visi Kami</h3>
          <p class="text-slate-600 border-l-4 border-primary pl-4 py-2 italic text-sm bg-emerald-50/50 rounded-r font-medium">
            "Menjadi Rumah Sakit Khusus Mata Anggulan dengan Pelayanan Prima, Terpercaya, dan Terjangkau di Tingkat Nasional pada Tahun 2030."
          </p>
        </div>

        <div class="space-y-2">
          <h3 class="text-lg font-black text-primary">Misi Kami</h3>
          <ul class="space-y-2 text-sm text-slate-500 list-disc pl-5 font-medium">
            <li>Menyelenggarakan pelayanan kesehatan mata yang paripurna, bermutu, dan mengutamakan keselamatan pasien (Patient Safety).</li>
            <li>Mengembangkan pusat layanan mata subspesialis unggulan dengan dukungan sarana dan prasarana berteknologi tinggi.</li>
            <li>Meningkatkan kompetensi, profesionalisme, dan integritas sumber daya manusia kesehatan secara berkelanjutan.</li>
            <li>Menerapkan tata kelola rumah sakit yang akuntabel, transparan, efektif, dan efisien demi kepuasan pelanggan.</li>
          </ul>
        </div>
      </div>
    `,
    layout_type: "split",
    menu_group: "profil",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "p2",
    title: "Struktur Organisasi",
    slug: "struktur-organisasi",
    content: `
      <div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Struktur organisasi RS Khusus Mata Provinsi Sumatera Selatan disusun berdasarkan peraturan daerah untuk menjamin pelayanan yang tanggap, efisien, dan memiliki rantai komando yang transparan. Bagan struktur komando ini dipimpin oleh Direktur Utama dan didukung oleh komite medis beserta kepala bagian.
        </p>
      </div>
    `,
    layout_type: "standard",
    menu_group: "profil",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_direksi",
    title: "Jajaran Direksi",
    slug: "jajaran-direksi",
    content: `
      <div class="space-y-6">
        <p class="text-sm leading-relaxed text-slate-500 font-medium">
          Pengelolaan RS Khusus Mata Provinsi Sumatera Selatan diamanatkan kepada jajaran direksi profesional yang berdedikasi tinggi terhadap pelayanan kesehatan publik yang akuntabel dan bermutu tinggi.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 class="text-xs font-black text-slate-800 uppercase">Direktur Utama</h4>
            <p class="text-sm font-bold text-primary mt-1">dr. Lady Kavotiner, Sp.M</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 class="text-xs font-black text-slate-800 uppercase">Kepala Bagian Tata Usaha</h4>
            <p class="text-sm font-bold text-primary mt-1">H. Fahrurazi, S.KM, M.Si</p>
          </div>
        </div>
      </div>
    `,
    layout_type: "standard",
    menu_group: "profil",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_aksesibilitas",
    title: "Aksesibilitas RS",
    slug: "aksesibilitas-rs",
    content: `
      <div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Kami berkomitmen menyediakan lingkungan rumah sakit yang ramah bagi seluruh kalangan, termasuk penyandang disabilitas, lansia, dan ibu hamil. Fasilitas aksesibilitas kami meliputi:
        </p>
        <ul class="space-y-2 text-sm text-slate-500 list-disc pl-5 font-semibold">
          <li>Ram atau jalur landai untuk kursi roda di setiap pintu masuk utama.</li>
          <li>Ubin pemandu (Guiding Blocks) bagi tunanetra di selasar utama.</li>
          <li>Toilet khusus disabilitas yang dilengkapi pegangan tangan (handrails).</li>
          <li>Layanan prioritas antrean pendaftaran khusus disabilitas dan lansia.</li>
        </ul>
      </div>
    `,
    layout_type: "standard",
    menu_group: "profil",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1508847154043-be12a62861c1?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_dokter_kami",
    title: "Dokter Kami",
    slug: "dokter-kami",
    content: `
      <div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          RS Khusus Mata Provinsi Sumatera Selatan didukung oleh jajaran dokter spesialis dan subspesialis mata terbaik di tingkat regional yang berdedikasi tinggi serta aktif memperbarui keilmuan mereka demi hasil terapi medis terbaik.
        </p>
      </div>
    `,
    layout_type: "standard",
    menu_group: "profil",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_rawatinap",
    title: "Rawat Inap",
    slug: "rawat-inap",
    content: `
      <div class="space-y-6">
        <p class="text-sm leading-relaxed text-slate-500 font-medium">
          Layanan Rawat Inap RS Khusus Mata Provinsi Sumatera Selatan menyediakan akomodasi perawatan pasca-operasi mata maupun perawatan intensif okular yang ditangani secara langsung oleh perawat spesialis mata berpengalaman.
        </p>
        <div class="space-y-3">
          <h4 class="text-sm font-black text-primary uppercase">Fasilitas Kamar</h4>
          <p class="text-xs text-slate-550 leading-relaxed font-semibold">
            Kamar rawat inap kami terbagi menjadi beberapa kelas (VIP, Kelas I, Kelas II, dan Kelas III) yang masing-masing dilengkapi tempat tidur medis ergonomis, AC, nurse call system 24 jam, serta layanan konsumsi sesuai anjuran ahli gizi rumah sakit.
          </p>
        </div>
      </div>
    `,
    layout_type: "split",
    menu_group: "pelayanan",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p3",
    title: "Jadwal Besuk",
    slug: "jadwal-besuk",
    content: `
      <div class="space-y-6">
        <p class="text-sm leading-relaxed text-slate-500 font-medium">
          Untuk mendukung kenyamanan pasien selama masa pemulihan tanpa mengesampingkan keamanan dan sterilitas area perawatan, kami menerapkan ketentuan waktu berkunjung sebagai berikut:
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <h4 class="text-sm font-black text-primary mb-3">Waktu Kunjungan (Besuk)</h4>
            <table class="w-full text-xs text-slate-600 font-medium">
              <tbody>
                <tr class="border-b border-emerald-100/50">
                  <td class="py-2.5 font-bold text-slate-700">Sesi Siang</td>
                  <td class="py-2.5 text-right font-mono font-bold text-primary">11:00 - 13:00 WIB</td>
                </tr>
                <tr>
                  <td class="py-2.5 font-bold text-slate-700">Sesi Sore</td>
                  <td class="py-2.5 text-right font-mono font-bold text-primary">17:00 - 19:00 WIB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 class="text-sm font-black text-slate-800 mb-3">Ketentuan Pengunjung</h4>
            <ul class="space-y-2 text-xs text-slate-500 list-decimal pl-4 font-semibold">
              <li>Pengunjung maksimal 2 orang secara bergantian masuk kamar.</li>
              <li>Anak di bawah usia 12 tahun tidak diperkenankan masuk demi faktor kesehatan anak.</li>
              <li>Wajib mencuci tangan sebelum dan sesudah masuk ruangan rawat inap.</li>
              <li>Menjaga ketenangan dan kebersihan lingkungan ruang perawatan.</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    layout_type: "standard",
    menu_group: "info_pengunjung",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_bpjs",
    title: "Syarat Pendaftaran BPJS",
    slug: "syarat-pendaftaran-bpjs",
    content: `
      <div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Sebagai rumah sakit rujukan tipe B, RSKM Provinsi Sumatera Selatan melayani pasien jaminan BPJS Kesehatan dengan menyertakan persyaratan administratif wajib berikut saat pendaftaran:
        </p>
        <ul class="space-y-2 text-sm text-slate-500 list-disc pl-5 font-semibold">
          <li>Kartu BPJS Kesehatan asli (atau kartu digital di Mobile JKN).</li>
          <li>Kartu Tanda Penduduk (KTP) asli / Kartu Keluarga bagi anak.</li>
          <li>Surat Rujukan asli dari Fasilitas Kesehatan Tingkat Pertama (FKTP / Puskesmas / Klinik) yang masih berlaku.</li>
          <li>Surat Kontrol Ulang (SKDP) dari dokter spesialis RSKM (khusus untuk pasien kontrol berkala).</li>
        </ul>
      </div>
    `,
    layout_type: "standard",
    menu_group: "info_pengunjung",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_tarif",
    title: "Tarif Layanan",
    slug: "tarif-layanan",
    content: `
      <div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Seluruh tarif pelayanan medis di RS Khusus Mata Provinsi Sumatera Selatan ditetapkan secara transparan berdasarkan Peraturan Gubernur Sumatera Selatan. Kami menjamin biaya tindakan operasi mata, obat-obatan, dan jasa konsultasi terjangkau bagi masyarakat umum.
        </p>
        <p class="text-xs text-slate-400 italic">
          * Untuk rincian daftar biaya konsultasi poliklinik reguler/VIP, biaya pemeriksaan penunjang (USG, OCT), serta paket operasi katarak gratis/mandiri, harap hubungi meja informasi pendaftaran utama.
        </p>
      </div>
    `,
    layout_type: "standard",
    menu_group: "info_pengunjung",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1554224154-7604de381558?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_tempattidur",
    title: "Tempat Tidur",
    slug: "tempat-tidur",
    content: `
      <div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          RSKM berkomitmen menyajikan transparansi ketersediaan tempat tidur rawat inap guna menjamin kepastian pelayanan bagi pasien rawat inap darurat maupun berjadwal.
        </p>
      </div>
    `,
    layout_type: "standard",
    menu_group: "info_pengunjung",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "p_pelayananpublik",
    title: "Pelayanan Publik",
    slug: "pelayanan-publik",
    content: `
      <div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Kami senantiasa patuh pada Undang-Undang Pelayanan Publik untuk mewujudkan pelayanan kesehatan mata yang bersih, berintegritas, bebas dari pungutan liar, serta responsif terhadap kritik dan aduan masyarakat melalui SP4N-LAPOR!.
        </p>
      </div>
    `,
    layout_type: "standard",
    menu_group: "info_pengunjung",
    is_published: true,
    image_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80"
  }
];

const defaultClinics: ClinicData[] = [
  {
    id: "c1",
    name: "Klinik Umum",
    slug: "klinik-umum",
    description: "Layanan konsultasi kesehatan mata awal, pemeriksaan ketajaman penglihatan (refraksi), penanganan keluhan mata umum (mata merah, kering, gatal), serta skrining rujukan awal ke dokter subspesialis spesifik.",
    image_url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=800&auto=format&fit=crop&q=80",
    facilities: ["Snellen Chart Digital", "Slit Lamp Examination", "Auto Refractometer", "Tonometer Non-kontak"]
  },
  {
    id: "c2",
    name: "Klinik Diagnostic",
    slug: "klinik-diagnostic",
    description: "Pusat investigasi pencitraan mata mutakhir yang menyediakan jasa diagnostik penunjang seperti foto fundus, USG mata, OCT (Optical Coherence Tomography), dan perimetri lapangan pandang.",
    image_url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop&q=80",
    facilities: ["Optical Coherence Tomography (OCT)", "Fundus Camera", "USG Mata A-Scan & B-Scan", "Visual Field Analyzer (Perimetry)"]
  },
  {
    id: "c3",
    name: "Klinik PDL",
    slug: "klinik-pdl",
    description: "Klinik Penyakit Dalam dan Laboratorium yang menunjang kesiapan fisik pasien sebelum menjalani prosedur operasi mata major guna meminimalisir risiko komplikasi sistemik.",
    image_url: "https://images.unsplash.com/photo-1581594549595-35e6ed37b77a?w=800&auto=format&fit=crop&q=80",
    facilities: ["Elektrokardiogram (EKG)", "Pemeriksaan Gula Darah Cepat", "Laboratorium Darah Lengkap"]
  },
  {
    id: "c4",
    name: "Ruang Pediatrik Oftamologi",
    slug: "ruang-pediatrik-oftamologi",
    description: "Layanan kesehatan mata khusus bayi, balita, dan anak-anak. Fokus pada penanganan kelainan bawaan lahir, juling (strabismus), mata malas (amblyopia), serta skrining retinopati pada bayi prematur (ROP).",
    image_url: "https://images.unsplash.com/photo-1502740479091-6398407d3288?w=800&auto=format&fit=crop&q=80",
    facilities: ["Children-Friendly Examination Room", "Lea Symbols Charts", "Retinoskopi Streak", "Synoptophore"]
  },
  {
    id: "c5",
    name: "Klinik Refraksi Mata",
    slug: "klinik-refraksi-mata",
    description: "Spesialisasi dalam penentuan resep kacamata dan lensa kontak yang akurat untuk mengatasi kelainan refraksi seperti rabun jauh (miopia), rabun dekat (hipermetropia), silinder (astigmatisme), dan mata tua (presbiopia).",
    image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    facilities: ["Phoropter Manual & Otomatis", "Lensmeter Digital", "Fitting Lensa Kontak", "Trial Lens Set"]
  },
  {
    id: "c6",
    name: "Kornea dan Bedah Refraktif",
    slug: "kornea-dan-bedah-refraktif",
    description: "Fokus pada diagnosis dan tindakan bedah untuk penyakit kornea serta bedah refraktif mutakhir (operasi LASIK/Phakic IOL) untuk melepaskan ketergantungan kacamata.",
    image_url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80",
    facilities: ["Topografi Kornea (Pentacam)", "Spekular Mikroskop", "Pachymetry Kornea"]
  },
  {
    id: "c7",
    name: "Klinik Retina",
    slug: "klinik-retina",
    description: "Penanganan penyakit segmen posterior mata, meliputi ablasi retina, retinopati diabetik akibat kencing manis, perdarahan vitreous, degenerasi makula terkait usia (AMD), serta suntikan intravitreal obat anti-VEGF.",
    image_url: "https://images.unsplash.com/photo-1579156492880-050104b3951d?w=800&auto=format&fit=crop&q=80",
    facilities: ["Laser Fotokoagulasi Retina", "Indirect Ophthalmoscope", "Vitrectomy Machine", "Intravitreal Injection Suite"]
  },
  {
    id: "c8",
    name: "Glaukoma",
    slug: "glaukoma",
    description: "Skrining, manajemen, dan tindakan bedah untuk penyakit glaukoma. Pelayanan meliputi terapi obat tetes mata, laser glaukoma (SLT/YAG), hingga operasi trabekulektomi atau pemasangan implan katup.",
    image_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=80",
    facilities: ["Goldmann Applanation Tonometer", "Pachymetry", "YAG/SLT Laser System", "Operating Microscope"]
  },
  {
    id: "c9",
    name: "Klinik Infeksi dan Imunology",
    slug: "klinik-infeksi-dan-imunology",
    description: "Spesialis dalam penanganan kasus uveitis, skleritis, peradangan bola mata non-infeksi akibat penyakit autoimun, serta infeksi mata parah/langka yang membutuhkan penanganan imunosupresan.",
    image_url: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800&auto=format&fit=crop&q=80",
    facilities: ["Pemeriksaan Slit Lamp", "Uji Laboratorium Imunologi", "Terapi Imunosupresif"]
  },
  {
    id: "c10",
    name: "Rekonstruksi Okuloplasti dan Onkologi",
    slug: "rekonstruksi-okuloplasti-dan-onkologi",
    description: "Bedah plastik rekonstruksi kelopak mata, saluran air mata yang tersumbat, penanganan tumor di sekitar bola mata, serta pembuatan dan pemasangan prostesis mata (mata palsu) estetis.",
    image_url: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&auto=format&fit=crop&q=80",
    facilities: ["Kelengkapan Bedah Mikro", "Endoskopi Saluran Air Mata (DCR)", "Prostesis Custom"]
  },
  {
    id: "c11",
    name: "Layanan VIP",
    slug: "layanan-vip",
    description: "Pelayanan kesehatan mata premium dengan fasilitas jalur prioritas satu atap (one-stop service). Bebas antrean umum, konsultasi di ruang tunggu privat mewah, dan penanganan eksklusif.",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    facilities: ["Lounge VIP Ber-AC", "One-Stop Registration", "Subspesialis Senior Konsultan"]
  }
];

const defaultDoctors: DoctorData[] = [
  {
    id: "d1",
    name: "dr. Ahmad Syuhada, Sp.M(K)",
    specialization: "Spesialis Vitreoretina",
    category: "Vitreoretina",
    schedule: {
      "Senin - Rabu": "08:00 - 12:00",
      "Kamis": "13:00 - 15:30"
    },
    image_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
    clinic_slug: "klinik-retina"
  },
  {
    id: "d2",
    name: "dr. Rini Astuti, Sp.M",
    specialization: "Spesialis Glaukoma",
    category: "Glaukoma",
    schedule: {
      "Selasa & Kamis": "08:00 - 12:00",
      "Jumat": "08:00 - 11:00"
    },
    image_url: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&auto=format&fit=crop&q=80",
    clinic_slug: "glaukoma"
  },
  {
    id: "d3",
    name: "dr. Budi Santoso, Sp.M(K)",
    specialization: "Spesialis Kornea & Bedah Refraktif",
    category: "Refraksi",
    schedule: {
      "Senin & Kamis": "09:00 - 13:00",
      "Rabu": "08:00 - 11:30"
    },
    image_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    clinic_slug: "kornea-dan-bedah-refraktif"
  },
  {
    id: "d4",
    name: "dr. Diana Lestari, Sp.M",
    specialization: "Spesialis Mata Anak & Strabismus",
    category: "Mata Anak",
    schedule: {
      "Rabu & Jumat": "08:30 - 12:00",
      "Sabtu (Khusus VIP)": "09:00 - 12:00"
    },
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    clinic_slug: "ruang-pediatrik-oftamologi"
  }
];

const defaultPosts: PostData[] = [
  {
    id: "n1",
    title: "Peresmian Gedung Baru Pelayanan Rawat Jalan RSKM Prov Sumatera Selatan",
    category: "berita",
    content: "RS Khusus Mata Provinsi Sumatera Selatan resmi mengoperasikan gedung rawat jalan baru berlantai 4 guna mengakomodasi volume pasien yang meningkat serta memisahkan alur layanan VIP, reguler, dan anak demi kenyamanan maksimal. Peresmian dilakukan langsung oleh Gubernur Sumatera Selatan.",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-15T09:00:00Z"
  },
  {
    id: "n2",
    title: "Seminar Nasional Penanganan Katarak Modern",
    category: "berita",
    content: "Mengusung teknologi Phacoemulsifikasi berinsisi minimal, komite medis RSKM Prov Sumatera Selatan menyelenggarakan seminar ilmiah nasional yang membagikan praktik terbaik operasi katarak tanpa jahit. Seminar ini dihadiri oleh ratusan dokter mata se-Indonesia.",
    image_url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-10T10:30:00Z"
  },
  {
    id: "a1",
    title: "Mengenal Computer Vision Syndrome dan Cara Mengatasinya sejak Dini",
    category: "artikel",
    content: "Terlalu lama menatap layar gadget dapat menyebabkan mata lelah, kering, dan buram yang dikenal sebagai Computer Vision Syndrome (CVS). Dokter spesialis merekomendasikan aturan 20-20-20: setiap 20 menit menatap layar, istirahatkan mata selama 20 detik dengan melihat objek sejauh 20 kaki (6 meter). Pastikan juga pencahayaan ruang cukup.",
    image_url: "https://images.unsplash.com/photo-1579156492880-050104b3951d?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-20T08:00:00Z",
    badge: "EDUKASI"
  },
  {
    id: "a2",
    title: "6 Makanan Super Untuk Menjaga Kesehatan Retina Anda",
    category: "artikel",
    content: "Kesehatan retina sangat dipengaruhi oleh asupan nutrisi seperti Lutein, Zeaxanthin, Omega-3, dan Vitamin A. Mengonsumsi sayuran berdaun hijau gelap seperti bayam dan kale, ikan salmon, telur, wortel, serta kacang-kacangan terbukti secara klinis memperlambat penuaan sel retina.",
    image_url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-18T14:15:00Z",
    badge: "NUTRISI"
  },
  {
    id: "k1",
    title: "Bakti Sosial Operasi Katarak Gratis HUT Provinsi Sumsel",
    category: "kegiatan",
    content: "Dalam rangka memperingati Hari Jadi Provinsi Sumatera Selatan, RSKM bekerja sama dengan Diskominfo menyelenggarakan bakti sosial operasi katarak gratis bagi 100 warga kurang mampu. Kegiatan ini berjalan lancar dengan tingkat keberhasilan pemulihan 100%.",
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-22T08:00:00Z",
    badge: "DOKUMENTASI"
  },
  {
    id: "k2",
    title: "Penyuluhan Kesehatan Mata di Sekolah Dasar Palembang",
    category: "kegiatan",
    content: "Tim penyuluhan preventif RSKM melakukan kunjungan ke beberapa SD di Palembang untuk mengajarkan cara membaca yang benar, batas aman screen time, dan membagikan poster edukasi kesehatan mata anak guna mencegah miopia dini.",
    image_url: "https://images.unsplash.com/photo-1502740479091-6398407d3288?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-20T09:00:00Z",
    badge: "DOKUMENTASI"
  },
  {
    id: "k3",
    title: "Skrining Glaukoma Gratis Bagi Lansia Warga Palembang",
    category: "kegiatan",
    content: "Penyelenggaraan deteksi dini glaukoma dan pembagian obat tetes mata gratis untuk menekan risiko kebutaan permanen bagi lansia di wilayah Puskesmas Dempo.",
    image_url: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-18T10:00:00Z",
    badge: "DOKUMENTASI"
  },
  {
    id: "k4",
    title: "Simposium Oftalmologi Klinis Regional Sumatera",
    category: "kegiatan",
    content: "RSKM menjadi tuan rumah pertemuan ilmiah tahunan dokter spesialis mata regional Sumatera untuk membahas teknik terbaru bedah vitreoretina dan lasik.",
    image_url: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-15T09:00:00Z",
    badge: "DOKUMENTASI"
  },
  {
    id: "k5",
    title: "Skrining Kelainan Refraksi Anak Sekolah Menengah",
    category: "kegiatan",
    content: "Pemeriksaan tajam penglihatan dan pembagian kacamata gratis bagi siswa-siswi yang teridentifikasi mengalami gangguan refraksi (rabun jauh/silinder) di Palembang.",
    image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-12T08:30:00Z",
    badge: "DOKUMENTASI"
  },
  {
    id: "k6",
    title: "Bakti Sosial Pemeriksaan Mata Posyandu Lansia Musi",
    category: "kegiatan",
    content: "Tim dokter keliling RSKM menyambangi perkampungan pinggiran Sungai Musi untuk memberikan layanan pemeriksaan kesehatan mata gratis.",
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-08T11:00:00Z",
    badge: "DOKUMENTASI"
  },
  {
    id: "k7",
    title: "Pelatihan Penanganan Trauma Okular Bagi Perawat Daerah",
    category: "kegiatan",
    content: "Workshop intensif dari dokter spesialis mata RSKM Sumsel untuk melatih perawat puskesmas daerah dalam penanganan pertama cedera/kecelakaan mata.",
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80",
    created_at: "2026-06-05T13:00:00Z",
    badge: "DOKUMENTASI"
  }
];

const defaultBeds: BedData[] = [
  { id: "b1", class_name: "Layanan VIP", total_capacity: 10, filled: 7, available: 3 },
  { id: "b2", class_name: "Rawat Inap Kelas I", total_capacity: 20, filled: 12, available: 8 },
  { id: "b3", class_name: "Rawat Inap Kelas II", total_capacity: 30, filled: 16, available: 14 },
  { id: "b4", class_name: "Rawat Inap Kelas III", total_capacity: 50, filled: 28, available: 22 },
  { id: "b5", class_name: "Kamar Intensif (ICU/HCU)", total_capacity: 8, filled: 5, available: 3 }
];

// ================= LOCAL STORAGE DATABASE OPERATIONS =================

const isClient = typeof window !== "undefined";

function getStoredData<T>(key: string, defaultValue: T): T {
  if (!isClient) return defaultValue;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function setStoredData<T>(key: string, data: T): void {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ================= DUAL-MODE ASYNC API =================

// Pages API
export async function getPages(): Promise<PageData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("pages").select("*").order("title");
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default pages to Supabase...");
          await supabase.from("pages").upsert(defaultPages);
          return defaultPages;
        }
        return data as PageData[];
      }
      console.warn("Supabase Pages error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  
  const stored = getStoredData<PageData[]>("rskm_pages", defaultPages);
  let updated = false;
  const merged = [...stored];
  
  defaultPages.forEach((defaultPage) => {
    const index = merged.findIndex((p) => p.id === defaultPage.id || p.slug === defaultPage.slug);
    if (index === -1) {
      merged.push(defaultPage);
      updated = true;
    } else {
      if (defaultPage.id === "p_tentang" && !merged[index].content.includes("Makna Logo")) {
        merged[index].content = defaultPage.content;
        updated = true;
      }
    }
  });
  
  if (updated) {
    setStoredData("rskm_pages", merged);
  }
  
  return merged;
}

export async function savePage(page: Omit<PageData, "id"> & { id?: string }): Promise<PageData> {
  const id = page.id || `page_${Date.now()}`;
  const newPage: PageData = {
    id,
    title: page.title,
    slug: page.slug || page.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    content: page.content,
    layout_type: page.layout_type,
    menu_group: page.menu_group,
    is_published: page.is_published,
    image_url: page.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    grid_images: page.grid_images,
    facilities_data: page.facilities_data
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("pages").upsert(newPage).select().single();
      if (!error && data) return data as PageData;
      console.warn("Supabase savePage error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }

  const pages = await getPages();
  const index = pages.findIndex((p) => p.id === id);
  if (index >= 0) {
    pages[index] = newPage;
  } else {
    pages.push(newPage);
  }
  setStoredData("rskm_pages", pages);
  return newPage;
}

export async function deletePage(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deletePage error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const pages = await getPages();
  const filtered = pages.filter((p) => p.id !== id);
  setStoredData("rskm_pages", filtered);
}

// Clinics API
export async function getClinics(): Promise<ClinicData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("clinics").select("*").order("name");
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default clinics to Supabase...");
          await supabase.from("clinics").upsert(defaultClinics);
          return defaultClinics;
        }
        return data as ClinicData[];
      }
      console.warn("Supabase Clinics error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  return getStoredData<ClinicData[]>("rskm_clinics", defaultClinics);
}

export async function saveClinic(clinic: ClinicData): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("clinics").upsert(clinic);
      if (!error) return;
      console.warn("Supabase saveClinic error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const clinics = await getClinics();
  const index = clinics.findIndex((c) => c.id === clinic.id);
  if (index >= 0) {
    clinics[index] = clinic;
  } else {
    clinics.push(clinic);
  }
  setStoredData("rskm_clinics", clinics);
}

// Doctors API
export async function getDoctors(): Promise<DoctorData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("doctors").select("*").order("name");
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default doctors to Supabase...");
          await supabase.from("doctors").upsert(defaultDoctors);
          return defaultDoctors;
        }
        return data as DoctorData[];
      }
      console.warn("Supabase Doctors error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  return getStoredData<DoctorData[]>("rskm_doctors", defaultDoctors);
}

export async function saveDoctor(doctor: DoctorData): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("doctors").upsert(doctor);
      if (!error) return;
      console.warn("Supabase saveDoctor error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const doctors = await getDoctors();
  const index = doctors.findIndex((d) => d.id === doctor.id);
  if (index >= 0) {
    doctors[index] = doctor;
  } else {
    doctors.push(doctor);
  }
  setStoredData("rskm_doctors", doctors);
}

export async function deleteDoctor(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("doctors").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deleteDoctor error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const doctors = await getDoctors();
  const filtered = doctors.filter((d) => d.id !== id);
  setStoredData("rskm_doctors", filtered);
}

// Posts API
export async function getPosts(): Promise<PostData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default posts to Supabase...");
          await supabase.from("posts").upsert(defaultPosts);
          return defaultPosts;
        }
        return data as PostData[];
      }
      console.warn("Supabase Posts error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  
  const stored = getStoredData<PostData[]>("rskm_posts", defaultPosts);
  let updated = false;
  const merged = [...stored];
  
  defaultPosts.forEach((defaultPost) => {
    const exists = merged.some((p) => p.id === defaultPost.id);
    if (!exists) {
      merged.push(defaultPost);
      updated = true;
    }
  });
  
  if (updated) {
    setStoredData("rskm_posts", merged);
  }
  
  return merged;
}

export async function savePost(post: Omit<PostData, "id" | "created_at"> & { id?: string }): Promise<PostData> {
  const id = post.id || `post_${Date.now()}`;
  const newPost: PostData = {
    id,
    title: post.title,
    category: post.category,
    content: post.content,
    image_url: post.image_url || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80",
    created_at: new Date().toISOString(),
    badge: post.category === "kegiatan" ? "DOKUMENTASI" : post.badge
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from("posts").upsert(newPost).select().single();
      if (!error && data) return data as PostData;
      console.warn("Supabase savePost error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }

  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index >= 0) {
    posts[index] = { ...posts[index], ...newPost, created_at: posts[index].created_at };
  } else {
    posts.unshift(newPost);
  }
  setStoredData("rskm_posts", posts);
  return newPost;
}

export async function deletePost(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deletePost error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  setStoredData("rskm_posts", filtered);
}

// Beds API
export async function getBeds(): Promise<BedData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("beds").select("*");
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default beds to Supabase...");
          await supabase.from("beds").upsert(defaultBeds);
          return defaultBeds;
        }
        return data as BedData[];
      }
      console.warn("Supabase Beds error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  return getStoredData<BedData[]>("rskm_beds", defaultBeds);
}

export async function saveBed(bed: BedData): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("beds").upsert(bed);
      if (!error) return;
      console.warn("Supabase saveBed error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const beds = await getBeds();
  const index = beds.findIndex((b) => b.id === bed.id);
  if (index >= 0) {
    beds[index] = bed;
  }
  setStoredData("rskm_beds", beds);
}

// Hero Slides API
export async function getHeroSlides(): Promise<HeroSlideData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("hero_slides").select("*").order("order_index");
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default hero slides to Supabase...");
          await supabase.from("hero_slides").upsert(defaultHeroSlides);
          return defaultHeroSlides;
        }
        return data as HeroSlideData[];
      }
      console.warn("Supabase HeroSlides error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  return getStoredData<HeroSlideData[]>("rskm_hero_slides", defaultHeroSlides);
}

export async function saveHeroSlide(slide: HeroSlideData): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("hero_slides").upsert(slide);
      if (!error) return;
      console.warn("Supabase saveHeroSlide error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const slides = await getHeroSlides();
  const index = slides.findIndex((s) => s.id === slide.id);
  if (index >= 0) {
    slides[index] = slide;
  } else {
    slides.push(slide);
  }
  slides.sort((a, b) => a.order_index - b.order_index);
  setStoredData("rskm_hero_slides", slides);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("hero_slides").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deleteHeroSlide error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const slides = await getHeroSlides();
  const filtered = slides.filter((s) => s.id !== id);
  setStoredData("rskm_hero_slides", filtered);
}

// ================= NEW JAJARAN DIREKSI, PERPUSTAKAAN & FEEDBACK SCHEMAS & CRUD =================

export interface DirectorData {
  id: string;
  name: string;
  position: string;
  image_url: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  category: "buku" | "jurnal" | "panduan" | "presentasi";
  description: string;
  image_url: string;
  file_url: string; // Base64 data or mock url
  file_name: string;
  created_at: string;
}

export interface FeedbackMessage {
  id: string;
  name: string;
  contact: string;
  subject: string;
  message: string;
  created_at: string;
  status: "unread" | "read" | "replied";
}

const defaultDirectors: DirectorData[] = [
  {
    id: "dir1",
    name: "dr. Lady Kavotiner, Sp.M",
    position: "Direktur Utama",
    image_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "dir2",
    name: "H. Fahrurazi, S.KM, M.Si",
    position: "Kepala Bagian Tata Usaha",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
  }
];

const defaultLibraryItems: LibraryItem[] = [
  {
    id: "lib1",
    title: "Buku Saku Panduan Kesehatan Mata Masyarakat",
    category: "buku",
    description: "Buku panduan praktis mengenai cara menjaga kesehatan mata, mencegah computer vision syndrome, dan penanganan pertama iritasi mata ringan.",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
    file_url: "data:application/pdf;base64,JVBERi0xLjQKJfs...",
    file_name: "buku-saku-kesehatan-mata.pdf",
    created_at: "2026-06-25T10:00:00Z"
  },
  {
    id: "lib2",
    title: "Presentasi Profil RSKM Prov Sumatera Selatan 2026",
    category: "presentasi",
    description: "Bahan presentasi profil lengkap rumah sakit, jajaran direksi, visi misi, sarana prasarana canggih, dan kemitraan strategis.",
    image_url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80",
    file_url: "data:application/vnd.ms-powerpoint;base64,JVBERi0xLjQKJfs...",
    file_name: "profil-rskm-2026.ppt",
    created_at: "2026-06-26T08:30:00Z"
  },
  {
    id: "lib3",
    title: "Panduan Klaim Pelayanan Pasien Jaminan BPJS Kesehatan",
    category: "panduan",
    description: "Dokumen rincian syarat rujukan, alur pemeriksaan poliklinik, hingga proses rawat inap bagi pasien BPJS Kesehatan di RSKM.",
    image_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    file_url: "data:application/pdf;base64,JVBERi0xLjQKJfs...",
    file_name: "alur-bpjs-rskm.pdf",
    created_at: "2026-06-24T11:00:00Z"
  }
];

const defaultFeedbackMessages: FeedbackMessage[] = [
  {
    id: "fb1",
    name: "Subhan Ansori",
    contact: "subhan@gmail.com",
    subject: "informasi",
    message: "Saya ingin menanyakan apakah pendaftaran untuk klinik retina bisa dilakukan seminggu sebelum jadwal kontrol?",
    created_at: "2026-06-25T14:30:00Z",
    status: "unread"
  },
  {
    id: "fb2",
    name: "Ratna Sari",
    contact: "081274839201",
    subject: "pengaduan",
    message: "Suhu ruangan tunggu di lantai 2 agak kurang dingin siang kemarin, mohon dibantu untuk pengecekan AC-nya. Terima kasih RSKM.",
    created_at: "2026-06-26T09:15:00Z",
    status: "unread"
  }
];

// Directors Database Operations
export async function getDirectors(): Promise<DirectorData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("directors").select("*").order("name");
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default directors to Supabase...");
          await supabase.from("directors").upsert(defaultDirectors);
          return defaultDirectors;
        }
        return data as DirectorData[];
      }
      console.warn("Supabase Directors error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  
  const stored = getStoredData<DirectorData[]>("rskm_directors", defaultDirectors);
  let updated = false;
  const merged = [...stored];
  
  defaultDirectors.forEach((defaultDir) => {
    const exists = merged.some((d) => d.id === defaultDir.id);
    if (!exists) {
      merged.push(defaultDir);
      updated = true;
    }
  });
  
  if (updated) {
    setStoredData("rskm_directors", merged);
  }
  return merged;
}

export async function saveDirector(director: DirectorData): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("directors").upsert(director);
      if (!error) return;
      console.warn("Supabase saveDirector error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const directors = await getDirectors();
  const index = directors.findIndex((d) => d.id === director.id);
  if (index >= 0) {
    directors[index] = director;
  } else {
    directors.push(director);
  }
  setStoredData("rskm_directors", directors);
}

export async function deleteDirector(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("directors").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deleteDirector error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const directors = await getDirectors();
  const filtered = directors.filter((d) => d.id !== id);
  setStoredData("rskm_directors", filtered);
}

// Library Items Database Operations
export async function getLibraryItems(): Promise<LibraryItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("library").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        if (data.length === 0) {
          console.log("Seeding default library items to Supabase...");
          await supabase.from("library").upsert(defaultLibraryItems);
          return defaultLibraryItems;
        }
        return data as LibraryItem[];
      }
      console.warn("Supabase Library error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  
  const stored = getStoredData<LibraryItem[]>("rskm_library", defaultLibraryItems);
  let updated = false;
  const merged = [...stored];
  
  defaultLibraryItems.forEach((defaultLib) => {
    const exists = merged.some((l) => l.id === defaultLib.id);
    if (!exists) {
      merged.push(defaultLib);
      updated = true;
    }
  });
  
  if (updated) {
    setStoredData("rskm_library", merged);
  }
  return merged;
}

export async function saveLibraryItem(item: LibraryItem): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("library").upsert(item);
      if (!error) return;
      console.warn("Supabase saveLibraryItem error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const items = await getLibraryItems();
  const index = items.findIndex((l) => l.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.unshift(item);
  }
  setStoredData("rskm_library", items);
}

export async function deleteLibraryItem(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("library").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deleteLibraryItem error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const items = await getLibraryItems();
  const filtered = items.filter((l) => l.id !== id);
  setStoredData("rskm_library", filtered);
}

// Feedback Messages Database Operations
export async function getFeedbackMessages(): Promise<FeedbackMessage[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as FeedbackMessage[];
      console.warn("Supabase Feedback error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  return getStoredData<FeedbackMessage[]>("rskm_feedback", defaultFeedbackMessages);
}

export async function saveFeedbackMessage(msg: FeedbackMessage): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("feedback").upsert(msg);
      if (!error) return;
      console.warn("Supabase saveFeedbackMessage error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const messages = await getFeedbackMessages();
  const index = messages.findIndex((m) => m.id === msg.id);
  if (index >= 0) {
    messages[index] = msg;
  } else {
    messages.unshift(msg);
  }
  setStoredData("rskm_feedback", messages);
}

export async function deleteFeedbackMessage(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("feedback").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deleteFeedbackMessage error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const messages = await getFeedbackMessages();
  const filtered = messages.filter((m) => m.id !== id);
  setStoredData("rskm_feedback", filtered);
}

// Subscribers Database Operations
export interface SubscriberData {
  id?: string;
  email: string;
  created_at: string;
}

export async function getSubscribers(): Promise<SubscriberData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
      if (!error && data) return data as SubscriberData[];
      console.warn("Supabase Subscribers error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  return getStoredData<SubscriberData[]>("rskm_subscribers", []);
}

export async function saveSubscriber(sub: SubscriberData): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from("subscribers").insert(sub);
    if (error) {
      console.warn("Supabase saveSubscriber error:", error);
      throw error;
    }
    return;
  }
  const subscribers = await getSubscribers();
  const subId = sub.id || `sub_${Date.now()}`;
  const subWithId = { ...sub, id: subId };
  const index = subscribers.findIndex((s) => s.id === subId);
  if (index >= 0) {
    subscribers[index] = subWithId;
  } else {
    subscribers.unshift(subWithId);
  }
  setStoredData("rskm_subscribers", subscribers);
}

export async function deleteSubscriber(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from("subscribers").delete().eq("id", id);
      if (!error) return;
      console.warn("Supabase deleteSubscriber error, falling back to localStorage", error);
    } catch (e) {
      console.warn("Supabase connection failed, falling back to localStorage", e);
    }
  }
  const subscribers = await getSubscribers();
  const filtered = subscribers.filter((s) => s.id !== id);
  setStoredData("rskm_subscribers", filtered);
}
