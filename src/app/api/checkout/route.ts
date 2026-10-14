import { z } from "zod";
import { NextResponse } from "next/server";
import { calculateCartTotals, CartLineSchema } from "@/features/cart/model/cart-math";
import { AttributionSchema } from "@/features/attribution/model/attribution";

const CheckoutSchema = z
  .object({
    buyer: z
      .object({
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email().max(254),
      })
      .strict(),
    lines: z.array(CartLineSchema).min(1).max(30),
    attribution: AttributionSchema,
    outcome: z.enum(["success", "failed"]),
  })
  .strict();

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 16_000)
    return NextResponse.json({ error: "Permintaan terlalu besar." }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data checkout tidak valid." },
      { status: 400 },
    );
  const totals = calculateCartTotals(parsed.data.lines);
  if (totals.issues.length || totals.lines.length !== parsed.data.lines.length)
    return NextResponse.json(
      { error: "Paket tidak valid atau melewati kuota promo." },
      { status: 422 },
    );
  const order = {
    id: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    status: parsed.data.outcome === "success" ? ("succeeded" as const) : ("failed" as const),
    buyer: parsed.data.buyer,
    total: totals.total,
    lines: totals.lines.map((line) => ({
      name: line.product.name,
      plan: line.plan.name,
      quantity: line.quantity,
      total: line.lineTotal,
    })),
    createdAt: new Date().toISOString(),
    attribution: parsed.data.attribution,
  };
  return NextResponse.json({ order }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
