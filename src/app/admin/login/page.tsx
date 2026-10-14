import Link from "next/link";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layouts/site-shell";
import { MarketingLoginForm } from "@/features/marketing/components/login-form";
import { getSupabaseConfig } from "@/integrations/supabase/config";
export const metadata: Metadata = {
  title: "Login panel marketing",
  robots: { index: false, follow: false },
};
export default function AdminLoginPage() {
  const configured = Boolean(getSupabaseConfig());
  return (
    <SiteShell>
      <section className="section admin-login-page">
        <div className="admin-login-card">
          <Link className="back-link" href="/">
            ← Kembali ke Kodeva
          </Link>
          <span className="admin-mark">K</span>
          <p className="eyebrow">AREA MARKETING</p>
          <h1>Masuk ke panel lead.</h1>
          <p>Gunakan akun Supabase yang sudah dimasukkan ke allowlist marketing.</p>
          {configured ? (
            <MarketingLoginForm />
          ) : (
            <div className="setup-notice">
              <b>Konfigurasi belum lengkap</b>
              <p>
                Salin <code>.env.example</code> ke <code>.env.local</code>, lalu isi publishable key
                Supabase.
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
