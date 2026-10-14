export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey || url.includes("replace-with") || anonKey.includes("replace-with"))
    return null;
  return { url, anonKey };
}
