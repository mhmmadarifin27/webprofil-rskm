-- COMPLETE SEED DATA FOR RSKM PROV. SUMSEL
TRUNCATE TABLE public.pages CASCADE;
TRUNCATE TABLE public.clinics CASCADE;
TRUNCATE TABLE public.doctors CASCADE;
TRUNCATE TABLE public.beds CASCADE;
TRUNCATE TABLE public.hero_slides CASCADE;
TRUNCATE TABLE public.directors CASCADE;
TRUNCATE TABLE public.posts CASCADE;
TRUNCATE TABLE public.library CASCADE;

INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_renstra', 'REANSTRA', 'renstra', '<div class="space-y-6">
        <p class="text-sm leading-relaxed text-slate-500 font-medium">
          Rencana Strategis (RENSTRA) RS Khusus Mata Provinsi Sumatera Selatan disusun sebagai pedoman penyelenggaraan pelayanan dan pembangunan rumah sakit untuk jangka waktu 5 tahun ke depan.
        </p>
        <div>
          <h3 class="text-lg font-black text-primary mb-2">Arah Kebijakan</h3>
          <p class="text-slate-600 border-l-4 border-primary pl-4 py-2 text-sm bg-emerald-50/50 rounded-r font-medium">
            Fokus utama RENSTRA adalah modernisasi peralatan diagnostik dan operasi mata, perluasan gedung rawat inap, serta penguatan kompetensi dokter spesialis untuk mencapai predikat pusat rujukan mata regional terkemuka.
          </p>
        </div>
      </div>', 'standard', 'profil', true, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_tentang', 'Tentang Kami', 'tentang-kami', '<div class="space-y-6">
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
      </div>', 'split', 'profil', true, 'https://images.unsplash.com/photo-1582750433449-649352e3ff4a?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p1', 'Visi & Misi', 'visi-misi', '<div class="space-y-6">
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
      </div>', 'split', 'profil', true, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p2', 'Struktur Organisasi', 'struktur-organisasi', '<div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Struktur organisasi RS Khusus Mata Provinsi Sumatera Selatan disusun berdasarkan peraturan daerah untuk menjamin pelayanan yang tanggap, efisien, dan memiliki rantai komando yang transparan. Bagan struktur komando ini dipimpin oleh Direktur Utama dan didukung oleh komite medis beserta kepala bagian.
        </p>
      </div>', 'standard', 'profil', true, 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_direksi', 'Jajaran Direksi', 'jajaran-direksi', '<div class="space-y-6">
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
      </div>', 'standard', 'profil', true, 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_aksesibilitas', 'Aksesibilitas RS', 'aksesibilitas-rs', '<div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Kami berkomitmen menyediakan lingkungan rumah sakit yang ramah bagi seluruh kalangan, termasuk penyandang disabilitas, lansia, dan ibu hamil. Fasilitas aksesibilitas kami meliputi:
        </p>
        <ul class="space-y-2 text-sm text-slate-500 list-disc pl-5 font-semibold">
          <li>Ram atau jalur landai untuk kursi roda di setiap pintu masuk utama.</li>
          <li>Ubin pemandu (Guiding Blocks) bagi tunanetra di selasar utama.</li>
          <li>Toilet khusus disabilitas yang dilengkapi pegangan tangan (handrails).</li>
          <li>Layanan prioritas antrean pendaftaran khusus disabilitas dan lansia.</li>
        </ul>
      </div>', 'standard', 'profil', true, 'https://images.unsplash.com/photo-1508847154043-be12a62861c1?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_dokter_kami', 'Dokter Kami', 'dokter-kami', '<div class="space-y-8">
        <div class="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div class="space-y-3 flex-1">
            <span class="text-xs font-black text-emerald-600 uppercase tracking-widest block">KOMITMEN TIM MEDIS</span>
            <h3 class="text-2xl font-black text-slate-800 leading-tight">Melayani Dengan Keahlian & Ketulusan Hati</h3>
            <p class="text-xs text-slate-500 font-semibold leading-relaxed">
              Tim dokter spesialis mata kami merupakan praktisi berpengalaman yang memiliki spesialisasi khusus (subspesialis) di bidang glaukoma, vitreoretina, infeksi imunologi, mata anak, dan rekonstruksi okuloplasti.
            </p>
          </div>
          <div class="flex gap-4 shrink-0">
            <div class="text-center bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
              <div class="text-xl font-black text-emerald-650">15+</div>
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Dokter Spesialis</div>
            </div>
            <div class="text-center bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
              <div class="text-xl font-black text-emerald-650">8+</div>
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Sub-Spesialis</div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-black text-slate-800 mb-4">Mengapa Mempercayakan Kesehatan Mata di RSKM?</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
              <h4 class="text-xs font-black text-slate-800 uppercase">Subspesialis Terlatih</h4>
              <p class="text-[11px] text-slate-500 font-semibold leading-relaxed">Setiap keluhan mata ditangani secara mendalam oleh dokter spesialis yang memiliki sertifikasi subspesialis tingkat nasional dan internasional.</p>
            </div>
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
              <h4 class="text-xs font-black text-slate-800 uppercase">Teknologi Modern</h4>
              <p class="text-[11px] text-slate-500 font-semibold leading-relaxed">Didukung peralatan diagnostik mutakhir seperti OCT, foto fundus, laser retina, dan mesin Phaco untuk operasi katarak tanpa jahit.</p>
            </div>
            <div class="p-5 bg-slate-50 rounded-2xl border border-slate-150 space-y-2">
              <h4 class="text-xs font-black text-slate-800 uppercase">Pendekatan Holistik</h4>
              <p class="text-[11px] text-slate-500 font-semibold leading-relaxed">Kami tidak hanya fokus pada kesembuhan gejala, melainkan menjaga kesehatan penglihatan Anda jangka panjang secara aman dan bersahabat.</p>
            </div>
          </div>
        </div>
      </div>', 'standard', 'profil', true, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_rawatinap', 'Rawat Inap', 'rawat-inap', '<div class="space-y-6">
        <p class="text-sm leading-relaxed text-slate-500 font-medium">
          Layanan Rawat Inap RS Khusus Mata Provinsi Sumatera Selatan menyediakan akomodasi perawatan pasca-operasi mata maupun perawatan intensif okular yang ditangani secara langsung oleh perawat spesialis mata berpengalaman.
        </p>
        <div class="space-y-3">
          <h4 class="text-sm font-black text-primary uppercase">Fasilitas Kamar</h4>
          <p class="text-xs text-slate-550 leading-relaxed font-semibold">
            Kamar rawat inap kami terbagi menjadi beberapa kelas (VIP, Kelas I, Kelas II, dan Kelas III) yang masing-masing dilengkapi tempat tidur medis ergonomis, AC, nurse call system 24 jam, serta layanan konsumsi sesuai anjuran ahli gizi rumah sakit.
          </p>
        </div>
      </div>', 'split', 'pelayanan', true, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p3', 'Jadwal Besuk', 'jadwal-besuk', '<div class="space-y-6">
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
      </div>', 'standard', 'info_pengunjung', true, 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_bpjs', 'Syarat Pendaftaran BPJS', 'syarat-pendaftaran-bpjs', '<div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Sebagai rumah sakit rujukan tipe B, RSKM Provinsi Sumatera Selatan melayani pasien jaminan BPJS Kesehatan dengan menyertakan persyaratan administratif wajib berikut saat pendaftaran:
        </p>
        <ul class="space-y-2 text-sm text-slate-500 list-disc pl-5 font-semibold">
          <li>Kartu BPJS Kesehatan asli (atau kartu digital di Mobile JKN).</li>
          <li>Kartu Tanda Penduduk (KTP) asli / Kartu Keluarga bagi anak.</li>
          <li>Surat Rujukan asli dari Fasilitas Kesehatan Tingkat Pertama (FKTP / Puskesmas / Klinik) yang masih berlaku.</li>
          <li>Surat Kontrol Ulang (SKDP) dari dokter spesialis RSKM (khusus untuk pasien kontrol berkala).</li>
        </ul>
      </div>', 'standard', 'info_pengunjung', true, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_tarif', 'Tarif Layanan', 'tarif-layanan', '<div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Seluruh tarif pelayanan medis di RS Khusus Mata Provinsi Sumatera Selatan ditetapkan secara transparan berdasarkan Peraturan Gubernur Sumatera Selatan. Kami menjamin biaya tindakan operasi mata, obat-obatan, dan jasa konsultasi terjangkau bagi masyarakat umum.
        </p>
        <p class="text-xs text-slate-400 italic">
          * Untuk rincian daftar biaya konsultasi poliklinik reguler/VIP, biaya pemeriksaan penunjang (USG, OCT), serta paket operasi katarak gratis/mandiri, harap hubungi meja informasi pendaftaran utama.
        </p>
      </div>', 'standard', 'info_pengunjung', true, 'https://images.unsplash.com/photo-1554224154-7604de381558?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_tempattidur', 'Tempat Tidur', 'tempat-tidur', '<div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          RSKM berkomitmen menyajikan transparansi ketersediaan tempat tidur rawat inap guna menjamin kepastian pelayanan bagi pasien rawat inap darurat maupun berjadwal.
        </p>
      </div>', 'standard', 'info_pengunjung', true, 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80', NULL, NULL);
INSERT INTO public.pages (id, title, slug, content, layout_type, menu_group, is_published, image_url, grid_images, facilities_data) VALUES ('p_pelayananpublik', 'Pelayanan Publik', 'pelayanan-publik', '<div class="space-y-4">
        <p class="text-sm text-slate-500 font-medium">
          Kami senantiasa patuh pada Undang-Undang Pelayanan Publik untuk mewujudkan pelayanan kesehatan mata yang bersih, berintegritas, bebas dari pungutan liar, serta responsif terhadap kritik dan aduan masyarakat melalui SP4N-LAPOR!.
        </p>
      </div>', 'standard', 'info_pengunjung', true, 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80', NULL, NULL);

INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c1', 'Klinik Umum', 'klinik-umum', 'Layanan konsultasi kesehatan mata awal, pemeriksaan ketajaman penglihatan (refraksi), penanganan keluhan mata umum (mata merah, kering, gatal), serta skrining rujukan awal ke dokter subspesialis spesifik.', 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=800&auto=format&fit=crop&q=80', '["Snellen Chart Digital","Slit Lamp Examination","Auto Refractometer","Tonometer Non-kontak"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c2', 'Klinik Diagnostic', 'klinik-diagnostic', 'Pusat investigasi pencitraan mata mutakhir yang menyediakan jasa diagnostik penunjang seperti foto fundus, USG mata, OCT (Optical Coherence Tomography), dan perimetri lapangan pandang.', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop&q=80', '["Optical Coherence Tomography (OCT)","Fundus Camera","USG Mata A-Scan & B-Scan","Visual Field Analyzer (Perimetry)"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c3', 'Klinik PDL', 'klinik-pdl', 'Klinik Penyakit Dalam dan Laboratorium yang menunjang kesiapan fisik pasien sebelum menjalani prosedur operasi mata major guna meminimalisir risiko komplikasi sistemik.', 'https://images.unsplash.com/photo-1581594549595-35e6ed37b77a?w=800&auto=format&fit=crop&q=80', '["Elektrokardiogram (EKG)","Pemeriksaan Gula Darah Cepat","Laboratorium Darah Lengkap"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c4', 'Ruang Pediatrik Oftamologi', 'ruang-pediatrik-oftamologi', 'Layanan kesehatan mata khusus bayi, balita, dan anak-anak. Fokus pada penanganan kelainan bawaan lahir, juling (strabismus), mata malas (amblyopia), serta skrining retinopati pada bayi prematur (ROP).', 'https://images.unsplash.com/photo-1502740479091-6398407d3288?w=800&auto=format&fit=crop&q=80', '["Children-Friendly Examination Room","Lea Symbols Charts","Retinoskopi Streak","Synoptophore"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c5', 'Klinik Refraksi Mata', 'klinik-refraksi-mata', 'Spesialisasi dalam penentuan resep kacamata dan lensa kontak yang akurat untuk mengatasi kelainan refraksi seperti rabun jauh (miopia), rabun dekat (hipermetropia), silinder (astigmatisme), dan mata tua (presbiopia).', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80', '["Phoropter Manual & Otomatis","Lensmeter Digital","Fitting Lensa Kontak","Trial Lens Set"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c6', 'Kornea dan Bedah Refraktif', 'kornea-dan-bedah-refraktif', 'Fokus pada diagnosis dan tindakan bedah untuk penyakit kornea serta bedah refraktif mutakhir (operasi LASIK/Phakic IOL) untuk melepaskan ketergantungan kacamata.', 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80', '["Topografi Kornea (Pentacam)","Spekular Mikroskop","Pachymetry Kornea"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c7', 'Klinik Retina', 'klinik-retina', 'Penanganan penyakit segmen posterior mata, meliputi ablasi retina, retinopati diabetik akibat kencing manis, perdarahan vitreous, degenerasi makula terkait usia (AMD), serta suntikan intravitreal obat anti-VEGF.', 'https://images.unsplash.com/photo-1579156492880-050104b3951d?w=800&auto=format&fit=crop&q=80', '["Laser Fotokoagulasi Retina","Indirect Ophthalmoscope","Vitrectomy Machine","Intravitreal Injection Suite"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c8', 'Glaukoma', 'glaukoma', 'Skrining, manajemen, dan tindakan bedah untuk penyakit glaukoma. Pelayanan meliputi terapi obat tetes mata, laser glaukoma (SLT/YAG), hingga operasi trabekulektomi atau pemasangan implan katup.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&auto=format&fit=crop&q=80', '["Goldmann Applanation Tonometer","Pachymetry","YAG/SLT Laser System","Operating Microscope"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c9', 'Klinik Infeksi dan Imunology', 'klinik-infeksi-dan-imunology', 'Spesialis dalam penanganan kasus uveitis, skleritis, peradangan bola mata non-infeksi akibat penyakit autoimun, serta infeksi mata parah/langka yang membutuhkan penanganan imunosupresan.', 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800&auto=format&fit=crop&q=80', '["Pemeriksaan Slit Lamp","Uji Laboratorium Imunologi","Terapi Imunosupresif"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c10', 'Rekonstruksi Okuloplasti dan Onkologi', 'rekonstruksi-okuloplasti-dan-onkologi', 'Bedah plastik rekonstruksi kelopak mata, saluran air mata yang tersumbat, penanganan tumor di sekitar bola mata, serta pembuatan dan pemasangan prostesis mata (mata palsu) estetis.', 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&auto=format&fit=crop&q=80', '["Kelengkapan Bedah Mikro","Endoskopi Saluran Air Mata (DCR)","Prostesis Custom"]'::jsonb);
INSERT INTO public.clinics (id, name, slug, description, image_url, facilities) VALUES ('c11', 'Layanan VIP', 'layanan-vip', 'Pelayanan kesehatan mata premium dengan fasilitas jalur prioritas satu atap (one-stop service). Bebas antrean umum, konsultasi di ruang tunggu privat mewah, dan penanganan eksklusif.', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80', '["Lounge VIP Ber-AC","One-Stop Registration","Subspesialis Senior Konsultan"]'::jsonb);

INSERT INTO public.doctors (id, name, specialization, category, schedule, image_url, clinic_slug) VALUES ('d1', 'dr. Ahmad Syuhada, Sp.M(K)', 'Spesialis Vitreoretina', 'Vitreoretina', '{"Senin - Rabu":"08:00 - 12:00","Kamis":"13:00 - 15:30"}'::jsonb, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80', 'klinik-retina');
INSERT INTO public.doctors (id, name, specialization, category, schedule, image_url, clinic_slug) VALUES ('d2', 'dr. Rini Astuti, Sp.M', 'Spesialis Glaukoma', 'Glaukoma', '{"Selasa & Kamis":"08:00 - 12:00","Jumat":"08:00 - 11:00"}'::jsonb, 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400&auto=format&fit=crop&q=80', 'glaukoma');
INSERT INTO public.doctors (id, name, specialization, category, schedule, image_url, clinic_slug) VALUES ('d3', 'dr. Budi Santoso, Sp.M(K)', 'Spesialis Kornea & Bedah Refraktif', 'Refraksi', '{"Senin & Kamis":"09:00 - 13:00","Rabu":"08:00 - 11:30"}'::jsonb, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80', 'kornea-dan-bedah-refraktif');
INSERT INTO public.doctors (id, name, specialization, category, schedule, image_url, clinic_slug) VALUES ('d4', 'dr. Diana Lestari, Sp.M', 'Spesialis Mata Anak & Strabismus', 'Mata Anak', '{"Rabu & Jumat":"08:30 - 12:00","Sabtu (Khusus VIP)":"09:00 - 12:00"}'::jsonb, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80', 'ruang-pediatrik-oftamologi');

INSERT INTO public.beds (id, class_name, total_capacity, available, filled) VALUES ('b1', 'VIP Room', 5, 3, 2);
INSERT INTO public.beds (id, class_name, total_capacity, available, filled) VALUES ('b2', 'Kelas I', 12, 8, 4);
INSERT INTO public.beds (id, class_name, total_capacity, available, filled) VALUES ('b3', 'Kelas II', 18, 11, 7);
INSERT INTO public.beds (id, class_name, total_capacity, available, filled) VALUES ('b4', 'Kelas III', 30, 12, 18);
INSERT INTO public.beds (id, class_name, total_capacity, available, filled) VALUES ('b5', 'Ruang Isolasi', 4, 3, 1);

INSERT INTO public.hero_slides (id, title, subtitle, badge, image_url, order_index) VALUES ('h1', 'STANDAR BARU PERAWATAN MATA', 'Pelayanan Medis Modern & Terakreditasi Paripurna oleh KARS.', 'KOMITMEN RSKM', 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=1600&auto=format&fit=crop&q=80', 1);
INSERT INTO public.hero_slides (id, title, subtitle, badge, image_url, order_index) VALUES ('h2', 'DOKTER SPESIALIS BERPENGALAMAN', 'Ditangani oleh jajaran dokter ahli subspesialis mata yang kompeten di bidangnya.', 'TIM MEDIS TERBAIK', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1600&auto=format&fit=crop&q=80', 2);

INSERT INTO public.directors (id, name, position, image_url) VALUES ('dir1', 'dr. Lady Kavotiner, Sp.M', 'Direktur Utama', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80');
INSERT INTO public.directors (id, name, position, image_url) VALUES ('dir2', 'H. Fahrurazi, S.KM, M.Si', 'Kepala Bagian Tata Usaha', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80');

INSERT INTO public.posts (id, title, category, content, image_url, created_at, badge) VALUES ('p_post1', 'Akreditasi Paripurna Bintang Lima KARS Berhasil Dipertahankan RSKM Prov Sumsel', 'berita', 'RS Khusus Mata Provinsi Sumatera Selatan kembali menorehkan prestasi membanggakan dengan mempertahankan status Akreditasi Paripurna (Bintang Lima) dari Komite Akreditasi Rumah Sakit (KARS). Penilaian menyeluruh meliputi mutu pelayanan medis, kualifikasi perawat, keamanan gedung, and kepatuhan terhadap standar keselamatan pasien internasional.', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80', '2026-06-27T03:44:15.065Z', 'PRESTASI');
INSERT INTO public.posts (id, title, category, content, image_url, created_at, badge) VALUES ('p_post2', 'Bahaya Menatap Layar Gawai Terlalu Lama Pada Anak-Anak & Tips Pencegahannya', 'artikel', 'Keluhan rabun jauh (miopia) pada anak usia sekolah mengalami peningkatan signifikan selama beberapa tahun terakhir. Dokter Spesialis Mata Anak RSKM membagikan tips penting aturan 20-20-20 untuk mengurangi sindrom kelelahan mata digital, serta pentingnya membatasi screen-time harian anak demi masa depan penglihatan mereka.', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=80', '2026-06-27T03:44:15.067Z', 'EDUKASI');

INSERT INTO public.library (id, title, category, description, image_url, file_url, file_name, created_at) VALUES ('lib1', 'Buku Saku Panduan Kesehatan Mata Masyarakat', 'buku', 'Buku panduan praktis mengenai cara menjaga kesehatan mata, mencegah computer vision syndrome, dan penanganan pertama iritasi mata ringan.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80', 'data:application/pdf;base64,JVBERi0xLjQKJfs...', 'buku-saku-kesehatan-mata.pdf', '2026-06-25T10:00:00Z');
INSERT INTO public.library (id, title, category, description, image_url, file_url, file_name, created_at) VALUES ('lib2', 'Presentasi Profil RSKM Prov Sumatera Selatan 2026', 'presentasi', 'Bahan presentasi profil lengkap rumah sakit, jajaran direksi, visi misi, sarana prasarana canggih, dan kemitraan strategis.', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80', 'data:application/vnd.ms-powerpoint;base64,JVBERi0xLjQKJfs...', 'profil-rskm-2026.ppt', '2026-06-26T08:30:00Z');
INSERT INTO public.library (id, title, category, description, image_url, file_url, file_name, created_at) VALUES ('lib3', 'Panduan Klaim Pelayanan Pasien Jaminan BPJS Kesehatan', 'panduan', 'Dokumen rincian syarat rujukan, alur pemeriksaan poliklinik, hingga proses rawat inap bagi pasien BPJS Kesehatan di RSKM.', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80', 'data:application/pdf;base64,JVBERi0xLjQKJfs...', 'alur-bpjs-rskm.pdf', '2026-06-24T11:00:00Z');