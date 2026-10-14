import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { LeadSubmissionSchema, splitContact } from "@/features/leads/server/schema";

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 12_000)
    return NextResponse.json({ error: "Permintaan terlalu besar." }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const parsed = LeadSubmissionSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Periksa kembali data." },
      { status: 400 },
    );
  if (parsed.data.website) return NextResponse.json({ ok: true }, { status: 200 });
  const contact = splitContact(parsed.data.contact);
  if (!contact)
    return NextResponse.json(
      { error: "Masukkan email atau nomor WhatsApp yang valid." },
      { status: 400 },
    );

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret || secret.includes("replace-with"))
    return NextResponse.json(
      {
        error:
          "Penyimpanan form belum dikonfigurasi. Isi kunci Supabase lokal untuk menyimpan permintaan.",
      },
      { status: 503 },
    );
  const supabase = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from("leads").insert({
    submission_id: parsed.data.submissionId,
    name: parsed.data.name,
    email: contact.email,
    whatsapp: contact.whatsapp,
    campaign_id: parsed.data.campaignId,
    utm: parsed.data.attribution,
    landing_path: parsed.data.landingPath,
  });
  if (error?.code === "23505") return NextResponse.json({ ok: true }, { status: 200 });
  if (error) {
    console.error("Lead insertion failed", error.code, error.message);
    return NextResponse.json(
      { error: "Permintaan belum tersimpan. Coba lagi sebentar." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
