import { createClient } from "@supabase/supabase-js";

function createSupabaseClient(key: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseServerClient() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return anonKey ? createSupabaseClient(anonKey) : null;
}

export function getSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return serviceRoleKey ? createSupabaseClient(serviceRoleKey) : null;
}
