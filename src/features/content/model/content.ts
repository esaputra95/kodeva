import type { Product } from "@/features/products/model/types";

export type LandingContent = {
  campaignId: string;
  announcement: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    imageUrl?: string;
    imageAlt: string;
  };
  featured: {
    title: string;
    description: string;
    items: Array<{
      productId: string;
      title: string;
      description: string;
      imageUrl?: string;
      imageAlt: string;
      ctaLabel: string;
    }>;
  };
  testimonials: {
    title: string;
    items: Array<{ quote: string; attribution: string; context: string }>;
  };
  faq: { title: string; items: Array<{ question: string; answer: string }> };
  lead: { title: string; description: string; buttonLabel: string; successMessage: string };
  seo: { title: string; description: string };
};

export const FALLBACK_LANDING: LandingContent = {
  campaignId: "promo-akhir-tahun",
  announcement: "Promo Akhir Tahun · Pilih aplikasi sesuai pekerjaan tim",
  hero: {
    eyebrow: "Aplikasi bisnis untuk UMKM",
    title: "Bisnis lebih rapi, operasional lebih ringan.",
    subtitle:
      "Cek penjualan hari ini, stok yang mulai menipis, dan jadwal tim. Bandingkan aplikasi Kasir, HR & Payroll, dan Inventori sebelum memilih paket.",
    ctaLabel: "Lihat katalog produk",
    imageAlt: "Pratinjau dashboard penjualan, stok, dan jadwal tim",
  },
  featured: {
    title: "Mulai dari pekerjaan yang paling sering menyita waktu",
    description:
      "Pilih alur yang ingin dirapikan lebih dulu. Setiap produk punya paket dengan cakupan yang berbeda.",
    items: [
      {
        productId: "kasir-retail",
        title: "Kasir Retail",
        description: "Catat transaksi barcode, cetak struk, lalu cocokkan rekap harian.",
        imageAlt: "Contoh tampilan transaksi kasir",
        ctaLabel: "Lihat paket kasir",
      },
      {
        productId: "hr-payroll",
        title: "HR & Payroll",
        description: "Atur shift, catat absensi, dan siapkan rekap gaji bulanan.",
        imageAlt: "Contoh tampilan jadwal tim",
        ctaLabel: "Lihat paket HR",
      },
      {
        productId: "inventory-warehouse",
        title: "Inventori & Gudang",
        description: "Catat barang masuk dan keluar, lalu periksa stok tiap outlet.",
        imageAlt: "Contoh tampilan stok barang",
        ctaLabel: "Lihat paket inventori",
      },
    ],
  },
  testimonials: {
    title: "Situasi kerja yang bisa dibuat lebih jelas",
    items: [
      {
        quote:
          "Sebelum belanja, saya cek dulu stok di dua outlet supaya jumlah pesanan tidak cuma berdasarkan perkiraan.",
        attribution: "Contoh skenario",
        context: "Toko dengan dua outlet",
      },
      {
        quote: "Sebelum toko tutup, saya cocokkan jumlah transaksi dan catatan kas hari itu.",
        attribution: "Contoh skenario",
        context: "Toko ritel harian",
      },
    ],
  },
  faq: {
    title: "Pertanyaan sebelum memilih paket",
    items: [
      {
        question: "Apakah saya bisa mencoba alur pembelian di website ini?",
        answer:
          "Bisa. Katalog, keranjang, dan pembayaran pada website demo ini memakai data contoh. Tidak ada pembayaran sungguhan.",
      },
      {
        question: "Bagaimana memilih paket yang tepat?",
        answer:
          "Bandingkan jumlah akun dan fitur pada halaman detail produk. Harga dan periode paket ditampilkan sebelum masuk keranjang.",
      },
      {
        question: "Apakah promo berlaku untuk semua paket?",
        answer:
          "Kuota contoh ditampilkan per produk. Pilihan paket dari produk yang sama memakai kuota bersama.",
      },
      {
        question: "Apakah harga ini penawaran nyata?",
        answer:
          "Tidak. Kodeva dan seluruh harga pada website ini adalah data fiktif untuk demonstrasi tes.",
      },
    ],
  },
  lead: {
    title: "Butuh bantuan membandingkan aplikasi?",
    description:
      "Tinggalkan satu kontak yang bisa dihubungi. Ini form demo; jangan masukkan data pribadi sungguhan.",
    buttonLabel: "Minta info demo",
    successMessage: "Permintaan demo diterima. Data ini hanya untuk pengujian aplikasi.",
  },
  seo: {
    title: "Aplikasi Kasir, HR & Payroll, dan Inventori untuk UMKM | Kodeva",
    description:
      "Bandingkan paket aplikasi kasir, HR & payroll, dan inventori Kodeva untuk melihat alur kerja yang sesuai kebutuhan usaha.",
  },
};

export function resolveFeaturedProducts(content: LandingContent, products: Product[]) {
  return content.featured.items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });
}
