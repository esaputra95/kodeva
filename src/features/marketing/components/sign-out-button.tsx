"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/integrations/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="button button-outline button-small"
      type="button"
      onClick={async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase?.auth.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      Keluar
    </button>
  );
}
