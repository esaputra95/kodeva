import type { BlogPost, PortableTextBlock } from "./types";

function blocks(...paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text, index) => ({
    _key: `paragraph-${index + 1}`,
    _type: "block",
    style: "normal",
    children: [{ _key: `span-${index + 1}`, _type: "span", text }],
    markDefs: [],
  }));
}

const published: BlogPost[] = [
  {
    id: "post-1",
    slug: "cocokkan-rekap-kas-sebelum-toko-tutup",
    title: "Cocokkan rekap kas sebelum toko tutup",
    excerpt:
      "Langkah singkat untuk menyamakan jumlah transaksi, uang tunai, dan catatan shift sebelum pergantian hari.",
    category: "Kasir",
    coverAlt: "Ilustrasi daftar rekap transaksi harian",
    publishedAt: "2026-10-10T09:00:00.000Z",
    body: blocks(
      "Mulai dari tanggal dan shift yang sama. Bandingkan jumlah transaksi dari sistem dengan ringkasan penjualan sebelum menghitung uang kas.",
      "Pisahkan transaksi tunai dan non-tunai. Jika ada selisih, catat nomor transaksi atau waktu kejadian agar pemeriksaan berikutnya fokus.",
      "Simpan hasil rekap beserta nama petugas yang memeriksa. Catatan ini membantu tim menelusuri perubahan tanpa menebak-nebak.",
    ),
  },
  {
    id: "post-2",
    slug: "cek-barang-yang-perlu-dipesan-sebelum-akhir-pekan",
    title: "Cek barang yang perlu dipesan sebelum akhir pekan",
    excerpt:
      "Gunakan stok minimum dan catatan penjualan untuk membuat daftar belanja yang bisa diperiksa ulang.",
    category: "Inventori",
    coverAlt: "Ilustrasi daftar stok barang",
    publishedAt: "2026-10-08T09:00:00.000Z",
    body: blocks(
      "Tentukan barang yang paling sering habis dan catat batas stok minimum untuk tiap barang. Ambang tiap produk bisa berbeda.",
      "Periksa jumlah fisik untuk barang prioritas. Bandingkan dengan catatan stok dan tulis selisih sebelum membuat pesanan.",
      "Daftar pesanan sebaiknya memuat nama barang, jumlah yang dibutuhkan, dan lokasi penyimpanan. Tim dapat mengecek barang datang dengan daftar yang sama.",
    ),
  },
  {
    id: "post-3",
    slug: "catat-perpindahan-stok-dari-gudang-ke-outlet",
    title: "Catat perpindahan stok dari gudang ke outlet",
    excerpt:
      "Informasi asal, tujuan, dan jumlah barang membuat perpindahan stok lebih mudah ditelusuri.",
    category: "Inventori",
    coverAlt: "Ilustrasi perpindahan barang antar lokasi",
    publishedAt: "2026-10-06T09:00:00.000Z",
    body: blocks(
      "Sebelum barang berangkat, catat lokasi asal, lokasi tujuan, nama barang, jumlah, dan waktu perpindahan.",
      "Penerima memeriksa jumlah yang tiba dan menandai selisih di catatan yang sama. Jangan menutup perpindahan sebelum pemeriksaan selesai.",
      "Simpan riwayat perubahan supaya perhitungan stok bisa menjelaskan kapan dan ke mana barang bergerak.",
    ),
  },
  {
    id: "post-4",
    slug: "susun-jadwal-shift-saat-jam-toko-berubah",
    title: "Susun jadwal shift saat jam toko berubah",
    excerpt:
      "Pecah perubahan jam operasional menjadi kebutuhan per hari, peran, dan waktu pergantian shift.",
    category: "HR & Payroll",
    coverAlt: "Ilustrasi kalender jadwal kerja",
    publishedAt: "2026-10-04T09:00:00.000Z",
    body: blocks(
      "Catat jam buka terbaru untuk setiap hari. Tandai hari dengan jam berbeda supaya pergantian shift tidak dibuat dari jadwal lama.",
      "Pastikan tiap jam operasional memiliki petugas untuk peran yang diperlukan. Beri jarak pergantian yang cukup untuk serah terima.",
      "Bagikan jadwal final dengan satu versi yang sama. Jika ada perubahan, beri tahu anggota tim yang terdampak dan simpan catatan revisinya.",
    ),
  },
  {
    id: "post-5",
    slug: "data-yang-perlu-disiapkan-sebelum-rekap-gaji",
    title: "Data yang perlu disiapkan sebelum rekap gaji",
    excerpt:
      "Periksa kehadiran, jadwal, dan perubahan data staf sebelum merangkum perhitungan bulanan.",
    category: "HR & Payroll",
    coverAlt: "Ilustrasi lembar rekap data tim",
    publishedAt: "2026-10-02T09:00:00.000Z",
    body: blocks(
      "Kumpulkan catatan kehadiran untuk periode yang sama dan pastikan perubahan shift sudah masuk.",
      "Periksa data staf yang berubah selama periode berjalan. Catat tanggal berlakunya agar rekap tidak mencampur dua kondisi.",
      "Minta pemeriksaan kedua pada ringkasan akhir. Simpan sumber angka yang digunakan agar koreksi dapat ditelusuri.",
    ),
  },
  {
    id: "post-6",
    slug: "kelola-pilihan-ukuran-dan-topping-di-kasir-fnb",
    title: "Kelola pilihan ukuran dan topping di kasir F&B",
    excerpt:
      "Susun varian menu supaya kasir mudah memilih, dapur menerima catatan yang jelas, dan rekap tidak rancu.",
    category: "Kasir",
    coverAlt: "Ilustrasi daftar varian menu",
    publishedAt: "2026-09-30T09:00:00.000Z",
    body: blocks(
      "Mulai dengan pilihan yang benar-benar tersedia. Kelompokkan ukuran terpisah dari tambahan agar tidak ada pilihan yang tertukar.",
      "Tuliskan nama opsi dengan istilah yang dipahami kasir dan dapur. Uji satu pesanan lengkap untuk memastikan catatan yang tercetak terbaca.",
      "Periksa kembali harga setiap tambahan dan pastikan ringkasan pesanan menunjukkan pilihan pelanggan sebelum pembayaran.",
    ),
  },
  {
    id: "post-7",
    slug: "pilih-paket-kasir-untuk-satu-atau-beberapa-outlet",
    title: "Pilih paket kasir untuk satu outlet atau beberapa outlet",
    excerpt:
      "Bandingkan jumlah lokasi, akun kasir, dan jenis laporan yang dibutuhkan sebelum memilih paket.",
    category: "Kasir",
    coverAlt: "Ilustrasi perbandingan kebutuhan outlet",
    publishedAt: "2026-09-28T09:00:00.000Z",
    body: blocks(
      "Tuliskan berapa outlet yang aktif dan siapa saja yang membutuhkan akses. Perkiraan ini membantu mempersempit pilihan paket.",
      "Bandingkan laporan yang perlu diperiksa tiap hari. Jika pemilik perlu meninjau beberapa outlet, pastikan data yang dibutuhkan bisa dilihat bersama.",
      "Cek kembali masa berlangganan dan harga per unit pada detail produk. Data di website ini hanya contoh; pastikan ketentuan aktual dengan penyedia sebelum membeli.",
    ),
  },
];

export const FALLBACK_POSTS = published;
export const FALLBACK_DRAFT_POST: BlogPost = {
  id: "post-draft",
  slug: "draft-cara-meninjau-laporan-mingguan",
  title: "Draft: Cara meninjau laporan mingguan",
  excerpt: "Artikel contoh yang belum dipublikasikan.",
  category: "Operasional",
  coverAlt: "Ilustrasi artikel draft",
  publishedAt: "2026-10-13T09:00:00.000Z",
  body: blocks("Artikel draft ini tidak ditampilkan di daftar publik."),
};
