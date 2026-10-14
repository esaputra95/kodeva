# Kodeva

Kodeva adalah demo campaign untuk enam aplikasi bisnis fiktif. Pengunjung dapat membandingkan paket, menyimpan pilihan ke keranjang, lalu mencoba checkout berhasil atau gagal. Marketing mengubah konten landing dan artikel di Sanity, sementara lead masuk ke Supabase dan hanya dapat dibaca akun marketing yang di-allowlist.

Tidak ada penjualan, lisensi, atau pembayaran sungguhan. Jangan masukkan data kontak pribadi pada demo publik.

Dokumen: [PRD](PRD-Kodeva.md) · [AI log](AI_LOG.md).

## Deploy produksi

- Website: [kodeva-seven.vercel.app](https://kodeva-seven.vercel.app).
- CMS: [Sanity Studio](https://kodeva-seven.vercel.app/studio), login memakai akun anggota project Sanity.
- Panel: [login marketing](https://kodeva-seven.vercel.app/admin/login).
- Source: [esaputra95/kodeva](https://github.com/esaputra95/kodeva), branch `main`; push ke branch ini memicu deployment Vercel.

Pada 14 Oktober 2026, build Vercel berstatus Ready. Landing, katalog, blog, tambah paket → cart → checkout berhasil, dan login Sanity Studio diperiksa melalui Edge. Lead demo `QA Deploy 14 Okt 2026` diterima form live dan terlihat sebagai record di tabel Supabase `leads`; email pengujiannya memakai domain `example.com`.

Konfigurasi Sanity dan publishable key Supabase disimpan untuk Production/Preview. `NEXT_PUBLIC_SITE_URL=https://kodeva-seven.vercel.app` dan `SUPABASE_SECRET_KEY` hanya disimpan untuk Production; key server memakai tipe Sensitive/Secret. Host `/studio` terdaftar di Sanity dan origin `https://kodeva-seven.vercel.app` memiliki credentials allowed. Nilai secret tidak disimpan di repository. File `.env` lokal tersedia dan diabaikan Git; pengujian cloud di bawah memakai konfigurasi Production.

Pada pemeriksaan lanjutan 14 Oktober 2026, artikel “Cara Agar Bisnis lebih rapi” sudah muncul pada blog produksi dari Sanity. Perubahan publish berikutnya, konten campaign landing, dan webhook masih perlu diuji; cache konten memakai revalidasi 60 detik. Login/RLS akun marketing dan akses reviewer belum diverifikasi ulang.

## Jalankan lokal

Butuh Node.js 24 dan pnpm 11. Dari folder `kodeva-app`:

```sh
cp .env.example .env.local
pnpm install
pnpm dev
```

Buka `http://localhost:3000`. Isi kunci layanan di `.env.local` secara lokal; file itu diabaikan Git dan jangan kirim kuncinya melalui chat atau commit.

| Variabel                               | Sumber                                               | Dipakai untuk                                                                                    |
| -------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                 | URL lokal / domain deploy                            | Canonical URL dan link campaign.                                                                 |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`        | Sanity project `kodeva` (`77o8k6wz`)                 | Membaca landing, artikel, dan gambar.                                                            |
| `NEXT_PUBLIC_SANITY_DATASET`           | Dataset project, rencana `production`                | Konten published. Jika dataset belum ada, buat dataset bernama `production` di Sanity.           |
| `NEXT_PUBLIC_SUPABASE_URL`             | Project `kodeva-skill-test` (`qlvxeueqaolbhtktrldl`) | Auth marketing dan database.                                                                     |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API Keys               | Login browser dengan RLS. Nilai publishable aman digunakan di browser; akses tetap dibatasi RLS. |
| `SUPABASE_SECRET_KEY`                  | Supabase → Project Settings → API Keys               | Server-only insert lead. Jangan beri prefix `NEXT_PUBLIC_`.                                      |
| `SANITY_REVALIDATE_SECRET`             | Buat nilai acak minimal 24 karakter                  | Secret opsional untuk webhook publish Sanity.                                                    |

Landing, blog, katalog, cart, dan checkout simulasi dapat dibuka tanpa kunci Supabase. Form lead memerlukan `SUPABASE_SECRET_KEY`; panel marketing memerlukan publishable key, akun Auth, dan allowlist. Konten landing/blog menggunakan salinan fallback ketika Sanity belum berisi dokumen.

## Konten di Sanity

Studio berjalan di `/studio` dan meminta login Sanity. Dataset yang dipakai adalah `production`. Buat satu dokumen `campaignLanding` untuk mengubah copy hero, pilihan produk, cerita skenario, FAQ, form lead, dan metadata SEO. Buat kategori dan artikel untuk mengubah blog. Post hanya tampil pada perspektif published; artikel contoh lokal muncul dari fixture jika dataset kosong.

Request konten diberi cache 60 detik. Agar perubahan publish menyegarkan cache lebih cepat, buat webhook Sanity untuk create/update/delete dokumen `campaignLanding`, `post`, dan `blogCategory`; kirim `POST` ke `https://<domain>/api/revalidate` dengan header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`. Simpan secret yang sama di environment deploy. Tanpa webhook, konten berubah paling lambat pada revalidasi request berikutnya setelah satu menit.

## Lead dan panel marketing

Migration `supabase/migrations/20261013000000_initial_leads.sql` membuat tabel leads, membership marketing, dan RLS. Migration tersebut sudah dijalankan pada project Supabase tes. Jangan jalankan `seed.sql` ke hosted project; isinya hanya fixture lokal.

Untuk menyiapkan akun:

1. Buat user pada Supabase Authentication. Nonaktifkan public signup jika panel tidak akan dibagikan ke reviewer.
2. Login sekali ke `/admin`; halaman menampilkan UUID akun yang belum di-allowlist.
3. Dari SQL Editor Supabase, izinkan user tersebut: `insert into public.marketing_users (user_id) values ('<UUID-DARI-HALAMAN-ADMIN>');`.
4. Login ulang di `/admin/login`. Akses data dicek lagi melalui RLS; secret key hanya dipakai route lead di server.

Form menyimpan nama, satu kontak, campaign ID, first-touch UTM, dan path halaman. Honeypot, validasi Zod, batas payload, unique submission ID, dan RLS melindungi alur demo. Service key tidak pernah dikirim ke browser. Panel dapat memfilter berdasarkan ID campaign website dan `utm_source`, mengekspor maksimal 500 hasil menjadi CSV, dan menyiapkan link UTM Instagram/TikTok dari tujuan yang diizinkan. CSV memasukkan lima field UTM dan melindungi nilai awal formula spreadsheet.

## Keranjang dan checkout

Katalog memakai fixture harga canonical di `src/features/products/model/catalog.ts`. Jumlah promo dijumlahkan lintas paket untuk produk yang sama. Cart tersimpan pada localStorage dan payload checkout divalidasi ulang di server terhadap fixture tersebut.

Checkout menawarkan hasil simulasi berhasil/gagal yang dapat dipilih, bukan random. Hasil sukses mengosongkan cart; hasil gagal membiarkan cart tersedia untuk dicoba ulang. Ringkasan order dan first-touch attribution tersimpan hanya pada sessionStorage browser agar hasil bisa dilihat pada halaman berikutnya. Tidak ada order/payment database, gateway, email, atau pengiriman lisensi.

## Berbagi tautan

Landing campaign, detail produk, dan artikel memakai komponen `ShareActions` yang sama. Pengunjung dapat membuka menu share perangkat, menyiapkan pesan WhatsApp, atau menyalin tautan langsung. Link WhatsApp membuka tab baru dan tetap meminta pengunjung memilih penerima serta mengirim sendiri. Tautan yang dibagikan memakai URL halaman tanpa query/UTM atau fragment.

Browser tanpa native share beralih ke clipboard; jika clipboard ditolak, tampil input tautan yang dapat dipilih dan disalin manual. Membatalkan menu share tidak menyalin apa pun dan tidak mencatat keberhasilan. Event `share` pada `dataLayer` memuat jenis konten, ID, dan metode; klik WhatsApp mencatat pilihan kanal, bukan bukti pesan terkirim.

## Struktur kode

```text
src/
├── app/                 # Route, layout, metadata, dan API handlers
├── components/          # UI dan site shell lintas fitur
├── features/            # Cart, products, content, leads, checkout, blog, attribution, marketing, sharing
├── integrations/        # Client Sanity dan Supabase
├── lib/                 # Helper format, URL, class names
├── constants/           # Nilai lintas fitur
└── sanity/schemaTypes/  # Skema Studio
```

Route hanya mengatur rendering dan data awal. Komponen UI lintas domain tinggal di `components`; komponen yang memuat keputusan bisnis tinggal bersama `features/<domain>`. Aksi dan validasi murni berada di model/server modul fitur agar bisa diuji tanpa render React.

## Cek sebelum menjalankan

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm format:check
pnpm build
```

Suite berisi 25 unit test pada 8 file: hitung harga dan kuota lintas paket, perubahan cart, katalog, checkout server yang mengabaikan harga dari browser, pilihan hasil simulasi, first-touch UTM, pembuat link, normalisasi kontak, pengamanan CSV, serta native share/cancel/fallback dan encoding tautan WhatsApp. Build produksi lokal juga sudah dibuka; landing, katalog, dan blog merespons HTTP 200, lalu alur tambah paket → keranjang → checkout berhasil diperiksa manual di browser mobile. Tes ini tidak menggantikan uji login/permissions pada Supabase atau alur preview deploy.

## Yang belum siap untuk pengumpulan

- File `.env` lokal tersedia; koneksi lead/auth lokal belum diuji. Insert lead Production sudah diverifikasi.
- Siapkan atau verifikasi akun Auth dan membership reviewer marketing, lalu uji login/RLS serta CSV. Allowlist terakhir diperiksa saat deployment awal dan saat itu kosong.
- Login Studio dan pembacaan artikel published sudah terbukti. Uji perubahan konten berikutnya tanpa redeploy, termasuk campaign landing dan gambar CMS.
- Lighthouse mobile belum menghasilkan skor: proses CLI tidak dapat menyalakan Chrome di lingkungan ini (`waiting for dynamic debugging port`). Target 80 tetap belum boleh diklaim; jalankan Lighthouse dari Chrome setelah deploy/di mesin demo.
- Durasi pengerjaan aktual perlu dicatat sebelum submit; jangan mengisi perkiraan seolah hasil pengukuran.
- README ini dan `AI_LOG.md` berisi kontribusi AI. Isi bagian “ditulis sendiri” di AI log dengan paragraf yang benar-benar kamu tulis.

Status ini dicatat apa adanya supaya reviewer dapat membedakan implementasi lokal dan layanan yang masih perlu disiapkan.
