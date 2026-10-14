import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layouts/site-shell";
import { PasswordResetRequestForm } from "@/features/marketing/components/password-reset-request-form";

export const metadata: Metadata = {
  title: "Atur ulang password panel marketing",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <SiteShell>
      <section className="section admin-login-page">
        <div className="admin-login-card">
          <Link className="back-link" href="/admin/login">
            ← Kembali ke login
          </Link>
          <span className="admin-mark">K</span>
          <p className="eyebrow">AREA MARKETING</p>
          <h1>Atur ulang password.</h1>
          <p>
            Masukkan email akun marketing. Jika terdaftar, kami kirim tautan untuk mengatur
            password.
          </p>
          <PasswordResetRequestForm />
        </div>
      </section>
    </SiteShell>
  );
}
