import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { getSupabaseConfig } from "@/integrations/supabase/config";
import { readLeadFilters } from "@/features/marketing/model/lead-filters";
import { serializeLeadCsv, type ExportableLead } from "@/features/marketing/model/lead-csv";

export async function GET(request: Request) {
  if (!getSupabaseConfig())
    return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
  const filters = readLeadFilters(new URL(request.url).searchParams);
  if (!filters.success)
    return NextResponse.json({ error: "Filter ekspor tidak valid." }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Sesi login tidak tersedia." }, { status: 401 });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Login diperlukan." }, { status: 401 });
  const { data: membership } = await supabase
    .from("marketing_users")
    .select("active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership?.active)
    return NextResponse.json({ error: "Akses marketing diperlukan." }, { status: 403 });
  let query = supabase
    .from("leads")
    .select("name,email,whatsapp,campaign_id,utm,landing_path,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(501);
  if (filters.data.campaignId) query = query.eq("campaign_id", filters.data.campaignId);
  if (filters.data.utmSource)
    query = query.contains("utm", { utm: { utm_source: filters.data.utmSource } });
  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Data lead belum dapat dimuat." }, { status: 500 });
  if ((count ?? 0) > 500)
    return NextResponse.json(
      { error: "Lebih dari 500 hasil. Tambahkan filter agar ekspor lengkap." },
      { status: 422 },
    );
  const csv = serializeLeadCsv((data ?? []) as ExportableLead[]);
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kodeva-leads.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
