import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Link2 } from "lucide-react";
import { SiteShell } from "@/components/layouts/site-shell";
import { CampaignLinkForm } from "@/features/marketing/components/campaign-link-form";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { getSiteUrl } from "@/lib/site-url";
import { FALLBACK_LANDING } from "@/features/content/model/content";
import { getLandingContent } from "@/features/content/server/queries";

export const metadata = { title: "Pembuat link campaign", robots: { index: false, follow: false } };
export default async function CampaignLinksPage() {
  if (!getSupabaseConfig()) redirect("/admin/login");
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: membership } = await supabase
    .from("marketing_users")
    .select("active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership?.active) redirect("/admin");
  const landing = await getLandingContent().catch(() => FALLBACK_LANDING);
  return (
    <SiteShell>
      <section className="section campaign-page">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/admin">
              <ArrowLeft size={14} /> Panel marketing
            </Link>
            <span>/</span>
            <span>Link campaign</span>
          </div>
          <div className="campaign-header">
            <div>
              <p className="eyebrow">ALAT MARKETING</p>
              <h1>Siapkan link campaign.</h1>
              <p>
                Pilih halaman, channel, dan nama campaign. Link yang dibuat langsung membawa UTM ke
                website.
              </p>
            </div>
            <span className="campaign-icon">
              <Link2 size={22} />
            </span>
          </div>
          <div className="campaign-page-grid">
            <CampaignLinkForm baseUrl={getSiteUrl()} defaultCampaign={landing.campaignId} />
            <aside className="campaign-help">
              <span className="eyebrow">CARA PAKAI</span>
              <h2>Supaya sumber lead tetap terbaca.</h2>
              <ol>
                <li>Pilih halaman tujuan yang ingin dibagikan.</li>
                <li>Gunakan channel dan nama campaign yang konsisten di semua materi.</li>
                <li>Buka hasilnya pada sesi browser baru sebelum menguji lead.</li>
              </ol>
              <p>
                First-touch attribution menyimpan link pertama pada tab. Membuka campaign kedua pada
                tab yang sama tidak menimpa sumber awal.
              </p>
              <Link className="text-link" href="/admin">
                Kembali ke daftar lead →
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
