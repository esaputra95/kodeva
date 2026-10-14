import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Download, Mail, MessageCircle, Users } from "lucide-react";
import { SiteShell } from "@/components/layouts/site-shell";
import { SignOutButton } from "@/features/marketing/components/sign-out-button";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { LeadFiltersSchema } from "@/features/marketing/model/lead-filters";

export const metadata = { title: "Panel lead marketing", robots: { index: false, follow: false } };
type Lead = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  campaign_id: string;
  utm: Record<string, unknown>;
  landing_path: string;
  created_at: string;
};
type Props = { searchParams: Promise<{ campaignId?: string; utmSource?: string }> };

export default async function AdminDashboardPage({ searchParams }: Props) {
  if (!getSupabaseConfig())
    return (
      <SiteShell>
        <section className="section admin-page">
          <div className="container">
            <div className="setup-notice">
              <b>Supabase belum dikonfigurasi.</b>
              <p>
                Isi kredensial pada <code>.env.local</code> untuk membuka panel.
              </p>
            </div>
          </div>
        </section>
      </SiteShell>
    );
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
  if (!membership?.active)
    return (
      <SiteShell>
        <section className="section admin-page">
          <div className="container">
            <div className="admin-header">
              <div>
                <p className="eyebrow">PANEL MARKETING</p>
                <h1>Akun belum punya akses.</h1>
              </div>
              <SignOutButton />
            </div>
            <div className="setup-notice">
              <b>Alamat email belum di-allowlist.</b>
              <p>
                Minta pemilik project menambahkan UUID pengguna ini ke{" "}
                <code>public.marketing_users</code>.
              </p>
              <code>{user.id}</code>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  const rawFilters = await searchParams;
  const parsedFilters = LeadFiltersSchema.safeParse({
    campaignId: rawFilters.campaignId ?? "",
    utmSource: rawFilters.utmSource ?? "",
  });
  const filters = parsedFilters.success ? parsedFilters.data : { campaignId: "", utmSource: "" };
  let query = supabase
    .from("leads")
    .select("id,name,email,whatsapp,campaign_id,utm,landing_path,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(501);
  if (filters.campaignId) query = query.eq("campaign_id", filters.campaignId);
  if (filters.utmSource) query = query.contains("utm", { utm: { utm_source: filters.utmSource } });
  const { data, error, count } = await query;
  const total = count ?? 0;
  const tooMany = total > 500;
  const leads = (data ?? []).slice(0, 500) as Lead[];
  const exportQuery = new URLSearchParams();
  if (filters.campaignId) exportQuery.set("campaignId", filters.campaignId);
  if (filters.utmSource) exportQuery.set("utmSource", filters.utmSource);
  const exportUrl = `/api/admin/leads/export${exportQuery.size ? `?${exportQuery}` : ""}`;
  const todayCount = leads.filter(
    (lead) => new Date(lead.created_at).toDateString() === new Date().toDateString(),
  ).length;
  const sources = new Set(
    leads.map((lead) =>
      String((lead.utm as { utm?: { utm_source?: string } }).utm?.utm_source || "Direct"),
    ),
  );
  return (
    <SiteShell>
      <section className="section admin-page">
        <div className="container">
          <div className="admin-header">
            <div>
              <p className="eyebrow">PANEL MARKETING</p>
              <h1>Permintaan informasi</h1>
              <p>Lead terbaru disimpan di Supabase. Kontak hanya terlihat setelah login.</p>
            </div>
            <div className="admin-header-actions">
              <Link className="button button-outline button-small" href="/admin/campaign-links">
                Buat link campaign
              </Link>
              <SignOutButton />
            </div>
          </div>
          <div className="admin-stats">
            <article>
              <span>
                <Users size={17} /> Lead sesuai filter
              </span>
              <b>{tooMany ? "500+" : total}</b>
              <small>maksimal 500 untuk tampilan dan ekspor</small>
            </article>
            <article>
              <span>HARI INI</span>
              <b>{todayCount}</b>
              <small>permintaan pada hasil ini</small>
            </article>
            <article>
              <span>SUMBER</span>
              <b>{sources.size}</b>
              <small>asal traffic terlihat</small>
            </article>
          </div>
          <div className="admin-table-wrap">
            <form className="lead-filter-form" action="/admin">
              <label className="form-control">
                <span>ID campaign website</span>
                <input
                  name="campaignId"
                  maxLength={120}
                  defaultValue={filters.campaignId}
                  placeholder="promo-akhir-tahun"
                />
              </label>
              <label className="form-control">
                <span>UTM source</span>
                <input
                  name="utmSource"
                  maxLength={200}
                  pattern="[A-Za-z0-9_-]*"
                  defaultValue={filters.utmSource}
                  placeholder="instagram"
                />
              </label>
              <button className="button button-dark button-small" type="submit">
                Terapkan filter
              </button>
              <Link className="back-link" href="/admin">
                Hapus filter
              </Link>
            </form>
            <div className="admin-table-heading">
              <div>
                <h2>Lead masuk</h2>
                <p>
                  Urutan terbaru,{" "}
                  {tooMany
                    ? "lebih dari 500 hasil; persempit filter untuk ekspor"
                    : `${total} hasil`}
                  .
                </p>
              </div>
              {tooMany ? (
                <span className="inline-warning">
                  Hasil lebih dari 500. Tambahkan filter agar ekspor lengkap.
                </span>
              ) : (
                <a className="button button-outline button-small" href={exportUrl}>
                  <Download size={15} /> Ekspor CSV
                </a>
              )}
            </div>
            {error ? (
              <p className="inline-warning">
                Data belum dapat dimuat. Periksa kebijakan RLS di Supabase.
              </p>
            ) : leads.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Kontak</th>
                      <th>Kampanye / UTM</th>
                      <th>Diterima</th>
                      <th>Halaman</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => {
                      const source = String(
                        (lead.utm as { utm?: { utm_source?: string } }).utm?.utm_source || "Direct",
                      );
                      return (
                        <tr key={lead.id}>
                          <td>
                            <b>{lead.name}</b>
                            {lead.email ? (
                              <a href={`mailto:${lead.email}`}>
                                <Mail size={13} />
                                {lead.email}
                              </a>
                            ) : null}
                            {lead.whatsapp ? (
                              <a
                                href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                                rel="noreferrer"
                                target="_blank"
                              >
                                <MessageCircle size={13} />
                                {lead.whatsapp}
                              </a>
                            ) : null}
                          </td>
                          <td>
                            <b>{lead.campaign_id}</b>
                            <small>{source}</small>
                          </td>
                          <td>
                            {new Intl.DateTimeFormat("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(lead.created_at))}
                          </td>
                          <td>
                            <Link href={lead.landing_path}>
                              {lead.landing_path} <ArrowUpRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty">
                <span>Belum ada lead sesuai filter.</span>
                <small>Hapus filter atau kirim form dari halaman utama.</small>
              </div>
            )}
          </div>
          <p className="privacy-note">
            CSV memuat nama, kontak, UTM, path, dan waktu. Nilai yang dapat menjadi formula
            spreadsheet diberi awalan teks sebelum diekspor.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
