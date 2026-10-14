import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || secret.length < 24)
    return NextResponse.json({ error: "Revalidation hook belum dikonfigurasi." }, { status: 503 });
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expectedBytes = Buffer.from(secret);
  const providedBytes = Buffer.from(provided);
  if (
    expectedBytes.length !== providedBytes.length ||
    !timingSafeEqual(expectedBytes, providedBytes)
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  revalidateTag("sanity-content", "max");
  return NextResponse.json(
    { revalidated: true, tag: "sanity-content" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
