# AI_LOG — Kodeva

Log ini mencatat bantuan AI pada implementasi. Ringkasan prompt di bawah diparafrasekan agar mudah dibaca; jangan dianggap transkrip kata-per-kata.

## Alat yang digunakan

- Codex (GPT-6) untuk membaca brief, merancang struktur, menulis dan meninjau implementasi, dokumentasi, serta perbaikan berdasarkan hasil typecheck/lint/test/build.
- `create-next-app`, pnpm, TypeScript, ESLint, Vitest, Next.js build, dan Sanity/Supabase SDK untuk scaffold, instalasi, dan verifikasi. Ini alat engineering, bukan model AI.
- Dokumen sumber: `Fullstack_Developer_Skill_Test_DSG.pdf`, PRD Kodeva, dan materi UI Kodeva yang dipilih pengguna.

## Ringkasan instruksi pengguna

1. Analisis tahapan untuk menyelesaikan tes full-stack dari brief PDF.
2. Gunakan Next.js dan jelaskan peran CMS Sanity; susun PRD lengkap yang mengikuti brief dan masukkan inisiatif tambahan.
3. Rancang struktur project senior dengan fitur terpisah, hooks, types, lib, constants, komponen reusable, database cloud, serta file konfigurasi yang diperlukan.
4. Bangun implementasi yang dapat dicoba untuk konten campaign/blog, lead, katalog, keranjang, promo, checkout simulasi, tracking, dan panel marketing; pertahankan arah visual Kodeva.
5. Jangan gunakan copy generik atau menyatakan data demo sebagai klaim produk nyata.
6. Push repository `esaputra95/kodeva` dan deploy lewat dashboard Vercel di Edge; siapkan konfigurasi cloud dengan izin spesifik untuk secret dan origin CMS.

## Implementasi yang dibantu AI

- App Router, feature folders, Sanity schemas/Studio, query konten dengan fallback, dan endpoint revalidasi bertag.
- Katalog contoh enam produk, tiga paket per produk, perhitungan total/hemat, dan batas kuota promo gabungan lintas paket.
- Cart Zustand yang tersimpan per browser, UI katalog/detail/cart responsif, checkout server-validated yang hasilnya deterministik, dan order demo pada sesi browser.
- Form lead tervalidasi, endpoint Supabase server-only, akses dashboard berdasarkan membership, dan UI daftar/CSV.
- First-touch UTM, event-shaped `dataLayer`, blog dengan pagination, metadata SEO, pengujian logika, serta README.

## Kekeliruan AI yang tertangkap dan diperbaiki

| Temuan                                                                                                                                            | Cara terdeteksi                                                                                      | Perbaikan                                                                                                                           | Verifikasi                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Halaman katalog mengimpor `PRODUCT_CATEGORIES` dari modul catalog, tetapi konstanta saat itu hanya diekspor modul types.                          | `pnpm typecheck` melaporkan ekspor tidak ditemukan dan parameter kategori menjadi implicit `any`.    | Ekspor ulang konstanta dari catalog agar konsumsi route konsisten.                                                                  | `pnpm typecheck` kembali lolos.                                             |
| Komponen hasil checkout memanggil `setState` langsung di body effect untuk membaca sessionStorage.                                                | ESLint rule `react-hooks/set-state-in-effect` menandai pola render berantai.                         | Membaca sessionStorage lewat microtask terjadwal dan membatalkan callback saat effect cleanup.                                      | `pnpm lint` kembali lolos.                                                  |
| Footer membaca tahun dari `new Date()` saat route sedang diprerender.                                                                             | `next build` menolak nilai waktu yang berubah pada route `/admin/login`.                             | Tahun tes dibuat eksplisit pada copy footer agar hasil prerender stabil.                                                            | `pnpm build` final lolos dan menghasilkan seluruh route.                    |
| `CartHydrator` membaca API persist di server ketika `localStorage` tidak tersedia, sehingga middleware persist tidak terpasang pada instance SSR. | `next build` gagal merender `/admin` dengan `persist.rehydrate` bernilai undefined.                  | Store memakai adapter storage aman untuk server dan browser; hidrasi tetap dijalankan setelah mount client.                         | `pnpm build` final lolos dan menghasilkan seluruh route.                    |
| Uji kategori mengasumsikan kata “absensi” hanya cocok dengan satu produk.                                                                         | Vitest menunjukkan deskripsi produk HR juga mengandung kata tersebut.                                | Assertion diperbaiki agar mencerminkan pencarian substring pada nama/deskripsi/kategori.                                            | `pnpm test`: 16 test pada 7 file lolos.                                     |
| Cache Components eksperimental diaktifkan pada route blog yang perlu membaca `searchParams` untuk pagination.                                     | `next build` menolak prerender `/blog` karena nilai runtime dibaca di luar Suspense.                 | Mode eksperimental dimatikan; pagination tetap memakai App Router biasa dan query Sanity memakai revalidasi eksplisit 60 detik/tag. | `pnpm build` final lolos dan menghasilkan seluruh route.                    |
| Halaman hasil checkout menampilkan “Ringkasan sesi tidak ditemukan” sesaat sebelum membaca `sessionStorage`.                                      | Smoke test checkout manual melihat HTML awal sebelum hydration, walau rincian order kemudian tampil. | Tambah state `loaded`; tampilkan status memuat sampai pembacaan sesi selesai agar pesan kosong tidak berkedip.                      | Uji ulang browser memperlihatkan hasil order saja setelah checkout.         |
| Copy detail produk memakai “Harga per” di depan label yang sudah memuat kata “per”.                                                               | Pemeriksaan tampilan produksi dan source.                                                            | Hapus kata “per” tambahan; gunakan label unit katalog.                                                                              | Pemeriksaan format pada source yang diubah.                                 |
| Snapshot aksesibilitas form deployment sempat menyertakan nilai key server pada output alat.                                                      | Output pemeriksaan form Vercel.                                                                      | Snapshot berikutnya menyamarkan seluruh nilai key/form. Nilai credential tidak disalin ke repository atau dokumentasi.              | Key tersimpan sebagai Secret khusus Production; rotasi key belum dilakukan. |

## Verifikasi yang dijalankan

Verifikasi lokal terakhir pada 14 Oktober 2026: `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test` (16 test/7 file), `pnpm peers check`, dan `pnpm build` semuanya lolos. Build menghasilkan halaman statis/dinamis dan endpoint API; smoke check production lokal menerima HTTP 200 pada landing, katalog, dan blog. Tampilan landing, tambah paket, ringkasan cart, dan checkout berhasil diperiksa pada viewport mobile.

Deployment produksi pada 14 Oktober 2026 tersedia di [kodeva-seven.vercel.app](https://kodeva-seven.vercel.app), terhubung ke repository GitHub branch `main`. Build Vercel dan redeploy setelah pengaturan URL situs berstatus Ready. Landing, katalog, blog, tambah Kasir Retail Pro → cart → checkout berhasil, dan login Sanity Studio diperiksa melalui Edge. Form live berhasil menyimpan lead dummy; record dikonfirmasi di tabel Supabase `leads`. Host Studio dan CORS dengan credentials dikonfigurasi untuk domain produksi setelah izin pengguna.

Lighthouse belum menghasilkan skor karena Chrome Launcher gagal membuka debugging port di lingkungan ini. Dataset Sanity masih kosong; publikasi CMS dan perubahan konten tanpa redeploy belum diuji. Allowlist marketing kosong, sehingga login/RLS dengan user marketing serta akses reviewer belum diverifikasi. Environment lokal masih placeholder, sementara Production sudah memakai konfigurasi Vercel. Jangan menulis bahwa target Lighthouse 80 atau seluruh acceptance cloud sudah lolos sebelum mengukurnya.

## Bagian yang harus ditulis sendiri oleh peserta

> Tulis di sini satu paragraf pendek dengan gaya kamu sendiri: keputusan teknis yang paling kamu pertahankan, alasan kamu memilihnya, trade-off yang kamu terima, dan apa yang akan kamu ubah bila punya satu minggu lagi. Hapus instruksi ini setelah kamu menulis. Bagian ini memang belum diisi AI.
