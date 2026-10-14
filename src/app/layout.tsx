import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { APP_NAME } from "@/constants/app";
import { getSiteUrl } from "@/lib/site-url";
import { AttributionCapture } from "@/features/attribution/components/attribution-capture";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: `${APP_NAME} — Operasional usaha lebih rapi`, template: `%s | ${APP_NAME}` },
  description:
    "Bandingkan contoh aplikasi kasir, HR & payroll, serta inventori untuk operasional UMKM.",
  applicationName: APP_NAME,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: APP_NAME,
    title: "Kodeva — Operasional usaha lebih rapi",
    description: "Cek kebutuhan kasir, jadwal tim, dan stok dalam satu pilihan software demo.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={jakartaSans.variable}>
      <body>
        <AttributionCapture />
        {children}
      </body>
    </html>
  );
}
