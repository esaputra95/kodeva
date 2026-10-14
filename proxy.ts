import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/integrations/supabase/config";

export async function proxy(request: NextRequest) {
  const config = getSupabaseConfig();
  if (!config) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(values) {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values) response.cookies.set(name, value, options);
      },
    },
  });
  await supabase.auth.getClaims();
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
