/*
  # Seed Initial Data for Ramadhan Challenge App

  1. Sample Data
    - Sample challenges for 30 days of Ramadhan
    - Sample badges for achievements
*/

-- Insert sample challenges
INSERT INTO challenges (day, title, description, points, category)
VALUES
  (1, 'Sedekah ke 1 Orang', 'Berikan sedekah kepada minimal 1 orang hari ini. Bisa berupa uang, makanan, atau barang yang bermanfaat.', 10, 'sedekah'),
  (2, 'Baca Al-Fatihah 10 Kali', 'Luangkan waktu untuk membaca Surah Al-Fatihah sebanyak 10 kali dengan penuh penghayatan.', 10, 'quran'),
  (3, 'Shalat Tarawih Berjamaah', 'Lakukan shalat tarawih berjamaah di masjid atau musholla terdekat.', 15, 'ibadah'),
  (4, 'Berbagi Takjil', 'Berbagi takjil untuk berbuka puasa kepada orang lain.', 15, 'sedekah'),
  (5, 'Baca Surah Yasin', 'Luangkan waktu untuk membaca Surah Yasin dengan penuh penghayatan.', 20, 'quran'),
  (6, 'Memaafkan Seseorang', 'Maafkan seseorang yang pernah menyakitimu dan lepaskan semua dendam.', 20, 'akhlak'),
  (7, 'Shalat Dhuha', 'Lakukan shalat Dhuha minimal 2 rakaat di pagi hari.', 15, 'ibadah'),
  (8, 'Menghubungi Kerabat', 'Hubungi kerabat atau teman lama yang sudah lama tidak berkomunikasi.', 10, 'akhlak'),
  (9, 'Tadarus Al-Quran 1 Juz', 'Baca Al-Quran minimal 1 juz hari ini.', 25, 'quran'),
  (10, 'Sedekah Pakaian', 'Sedekahkan pakaian yang masih layak pakai kepada yang membutuhkan.', 15, 'sedekah'),
  (11, 'Dzikir Pagi dan Petang', 'Lakukan dzikir pagi dan petang hari ini.', 15, 'ibadah'),
  (12, 'Membantu Orang Tua', 'Bantu pekerjaan orang tua di rumah tanpa diminta.', 15, 'akhlak'),
  (13, 'Puasa Sunnah', 'Jika bukan di bulan Ramadhan, lakukan puasa sunnah hari ini.', 20, 'ibadah'),
  (14, 'Membaca Hadits', 'Baca dan pelajari minimal 5 hadits tentang keutamaan Ramadhan.', 15, 'ibadah'),
  (15, 'Sedekah Online', 'Berikan sedekah melalui platform donasi online untuk program kemanusiaan.', 15, 'sedekah'),
  (16, 'Shalat Tahajud', 'Bangun di sepertiga malam terakhir dan lakukan shalat Tahajud.', 25, 'ibadah'),
  (17, 'Berbagi Ilmu', 'Bagikan ilmu yang bermanfaat kepada orang lain, bisa melalui media sosial.', 15, 'akhlak'),
  (18, 'Baca Surah Al-Kahfi', 'Baca Surah Al-Kahfi dengan penuh penghayatan.', 20, 'quran'),
  (19, 'Sedekah Makanan', 'Berikan makanan kepada tetangga atau orang yang membutuhkan.', 15, 'sedekah'),
  (20, 'Istighfar 100 Kali', 'Ucapkan istighfar (Astaghfirullah) sebanyak 100 kali sepanjang hari.', 15, 'ibadah'),
  (21, 'Menjenguk Orang Sakit', 'Luangkan waktu untuk menjenguk orang sakit, bisa kerabat atau tetangga.', 20, 'akhlak'),
  (22, 'Tadarus Al-Quran 2 Juz', 'Baca Al-Quran minimal 2 juz hari ini.', 30, 'quran'),
  (23, 'Sedekah untuk Masjid', 'Berikan sedekah untuk pembangunan atau pemeliharaan masjid.', 15, 'sedekah'),
  (24, 'Shalat Berjamaah 5 Waktu', 'Lakukan semua shalat 5 waktu secara berjamaah hari ini.', 25, 'ibadah'),
  (25, 'Berbuat Baik pada Tetangga', 'Lakukan kebaikan untuk tetangga, seperti membantu atau memberi hadiah.', 15, 'akhlak'),
  (26, 'Membaca Tafsir Al-Quran', 'Baca tafsir Al-Quran untuk lebih memahami makna ayat-ayat yang dibaca.', 20, 'quran'),
  (27, 'Sedekah untuk Anak Yatim', 'Berikan sedekah khusus untuk anak yatim atau panti asuhan.', 20, 'sedekah'),
  (28, 'Itikaf di Masjid', 'Luangkan waktu untuk itikaf di masjid, minimal beberapa jam.', 25, 'ibadah'),
  (29, 'Silaturahmi', 'Kunjungi kerabat atau tetangga untuk memperkuat silaturahmi.', 15, 'akhlak'),
  (30, 'Tadarus Al-Quran dan Doa', 'Di hari terakhir Ramadhan, baca Al-Quran dan perbanyak doa.', 30, 'quran');

-- Insert sample badges
INSERT INTO badges (name, description, image_url, required_challenges)
VALUES
  ('Pemula', 'Menyelesaikan 5 tantangan Ramadhan', 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png', 5),
  ('Rajin', 'Menyelesaikan 10 tantangan Ramadhan', 'https://cdn-icons-png.flaticon.com/512/2583/2583319.png', 10),
  ('Istiqomah', 'Menyelesaikan 15 tantangan Ramadhan', 'https://cdn-icons-png.flaticon.com/512/2583/2583434.png', 15),
  ('Teladan', 'Menyelesaikan 20 tantangan Ramadhan', 'https://cdn-icons-png.flaticon.com/512/2583/2583380.png', 20),
  ('Juara Ramadhan', 'Menyelesaikan 30 tantangan Ramadhan', 'https://cdn-icons-png.flaticon.com/512/2583/2583346.png', 30);