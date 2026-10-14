import type { Product, ProductCategory, ProductPlan } from "./types";
import { PRODUCT_CATEGORIES } from "./types";

export { PRODUCT_CATEGORIES } from "./types";

const plans = (
  prices: Array<[number, number]>,
  features: [string[], string[], string[]],
): ProductPlan[] => [
  {
    id: "basic",
    name: "Basic",
    regularPrice: prices[0][0],
    promoPrice: prices[0][1],
    features: features[0],
  },
  {
    id: "pro",
    name: "Pro",
    regularPrice: prices[1][0],
    promoPrice: prices[1][1],
    features: features[1],
  },
  {
    id: "business",
    name: "Business",
    regularPrice: prices[2][0],
    promoPrice: prices[2][1],
    features: features[2],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "kasir-retail",
    slug: "kasir-retail",
    name: "Kasir Retail",
    category: "Kasir",
    shortDescription: "Catat transaksi barcode, cetak struk, cocokkan rekap harian.",
    description:
      "Alur kasir untuk toko yang perlu melihat transaksi dan rekap tanpa menelusuri catatan satu per satu.",
    unitLabel: "per outlet / tahun",
    promoQuota: 5,
    featured: true,
    accent: "emerald",
    previewLabel: "Ringkasan penjualan toko",
    featureList: [
      "Transaksi barcode",
      "Cetak struk",
      "Rekap penjualan harian",
      "Daftar produk dan stok",
    ],
    plans: plans(
      [
        [250_000, 200_000],
        [400_000, 300_000],
        [650_000, 500_000],
      ],
      [
        ["1 kasir", "Rekap harian"],
        ["3 akun kasir", "Laporan per kategori"],
        ["Akun tanpa batas", "Multi-outlet"],
      ],
    ),
  },
  {
    id: "hr-payroll",
    slug: "hr-payroll",
    name: "HR & Payroll",
    category: "HR & Payroll",
    shortDescription: "Atur jadwal shift, catat absensi, siapkan rekap gaji.",
    description:
      "Data jadwal dan kehadiran tim tersusun supaya admin tidak perlu menggabungkan banyak catatan di akhir bulan.",
    unitLabel: "per outlet / tahun",
    promoQuota: 5,
    featured: true,
    accent: "blue",
    previewLabel: "Jadwal dan kehadiran tim",
    featureList: ["Data staf", "Jadwal shift", "Rekap kehadiran", "Ringkasan payroll"],
    plans: plans(
      [
        [300_000, 250_000],
        [520_000, 450_000],
        [800_000, 700_000],
      ],
      [
        ["Hingga 5 staf", "Rekap kehadiran"],
        ["Hingga 20 staf", "Atur jadwal shift"],
        ["Hingga 50 staf", "Ekspor payroll"],
      ],
    ),
  },
  {
    id: "inventory-warehouse",
    slug: "inventori-gudang",
    name: "Inventori & Gudang",
    category: "Add-on",
    shortDescription: "Catat barang masuk dan keluar, lalu periksa stok outlet.",
    description:
      "Pergerakan barang tercatat agar tim tahu stok yang perlu dihitung atau dipesan ulang.",
    unitLabel: "per outlet / tahun",
    promoQuota: 4,
    featured: true,
    accent: "amber",
    previewLabel: "Stok barang per lokasi",
    featureList: [
      "Barang masuk/keluar",
      "Mutasi antar-outlet",
      "Pengingat stok minimum",
      "Riwayat penyesuaian",
    ],
    plans: plans(
      [
        [280_000, 230_000],
        [460_000, 380_000],
        [760_000, 620_000],
      ],
      [
        ["1 lokasi stok", "Kartu stok"],
        ["3 lokasi stok", "Mutasi barang"],
        ["Lokasi tanpa batas", "Riwayat lengkap"],
      ],
    ),
  },
  {
    id: "kasir-fnb",
    slug: "kasir-fnb",
    name: "Kasir F&B",
    category: "Kasir",
    shortDescription: "Kelola menu, varian, catatan meja, dan rekap pesanan.",
    description:
      "Kasir untuk kedai yang perlu mencatat pilihan menu dan catatan pesanan dengan rapi.",
    unitLabel: "per outlet / tahun",
    promoQuota: 3,
    featured: false,
    accent: "violet",
    previewLabel: "Pesanan dan varian menu",
    featureList: ["Menu dan varian", "Catatan pesanan", "Nomor meja", "Rekap transaksi"],
    plans: plans(
      [
        [320_000, 270_000],
        [540_000, 470_000],
        [830_000, 720_000],
      ],
      [
        ["Menu inti", "1 akun kasir"],
        ["Varian dan topping", "3 akun kasir"],
        ["Akun tanpa batas", "Laporan per shift"],
      ],
    ),
  },
  {
    id: "attendance-online",
    slug: "absensi-online",
    name: "Absensi Online",
    category: "HR & Payroll",
    shortDescription: "Catat jam masuk dan pulang, lihat ringkasan kehadiran.",
    description: "Catatan kehadiran harian yang mudah diperiksa sebelum jadwal payroll disiapkan.",
    unitLabel: "per outlet / tahun",
    promoQuota: 3,
    featured: false,
    accent: "blue",
    previewLabel: "Ringkasan jam kerja",
    featureList: ["Catatan masuk/pulang", "Ringkasan terlambat", "Jadwal kerja", "Ekspor rekap"],
    plans: plans(
      [
        [220_000, 180_000],
        [390_000, 330_000],
        [650_000, 560_000],
      ],
      [
        ["Hingga 5 staf", "Rekap bulanan"],
        ["Hingga 20 staf", "Atur jadwal"],
        ["Hingga 50 staf", "Ekspor data"],
      ],
    ),
  },
  {
    id: "accounting-reports",
    slug: "akuntansi-laporan",
    name: "Akuntansi & Laporan",
    category: "Add-on",
    shortDescription: "Kelompokkan pemasukan dan pengeluaran untuk ringkasan usaha.",
    description: "Ringkasan kategori transaksi membantu pemilik meninjau arus kas usaha.",
    unitLabel: "per outlet / tahun",
    promoQuota: 3,
    featured: false,
    accent: "emerald",
    previewLabel: "Pemasukan dan pengeluaran",
    featureList: [
      "Kategori transaksi",
      "Ringkasan pemasukan",
      "Ringkasan pengeluaran",
      "Laporan bulanan",
    ],
    plans: plans(
      [
        [260_000, 210_000],
        [430_000, 370_000],
        [720_000, 630_000],
      ],
      [
        ["Laporan dasar", "1 akun"],
        ["Kategori khusus", "3 akun"],
        ["Akun tanpa batas", "Ekspor laporan"],
      ],
    ),
  },
];

export const getProductBySlug = (slug: string) => PRODUCTS.find((product) => product.slug === slug);
export const getProductById = (id: string) => PRODUCTS.find((product) => product.id === id);
export const getPlanById = (product: Product, id: string) =>
  product.plans.find((plan) => plan.id === id);

export type CatalogFilters = { category?: string; query?: string; sort?: string };

export function filterProducts(filters: CatalogFilters): Product[] {
  const query = filters.query?.trim().toLocaleLowerCase("id-ID") ?? "";
  const filtered = PRODUCTS.filter((product) => {
    const categoryMatches =
      !filters.category || filters.category === "Semua" || product.category === filters.category;
    const textMatches =
      !query ||
      `${product.name} ${product.shortDescription} ${product.category}`
        .toLocaleLowerCase("id-ID")
        .includes(query);
    return categoryMatches && textMatches;
  });

  if (filters.sort === "price-asc") {
    return filtered.toSorted((a, b) => a.plans[0].promoPrice - b.plans[0].promoPrice);
  }
  if (filters.sort === "price-desc") {
    return filtered.toSorted((a, b) => b.plans[0].promoPrice - a.plans[0].promoPrice);
  }
  return filtered;
}

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}
