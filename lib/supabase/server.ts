import { createClient } from "@supabase/supabase-js";

function normalizeEnvValue(value?: string) {
  if (!value) {
    return "";
  }

  return value.trim().replace(/^['"]|['"]$/g, "");
}

function createSupabaseClient(key: string) {
  const url = normalizeEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  );
  const normalizedKey = normalizeEnvValue(key);

  if (!url || !normalizedKey) {
    return null;
  }

  return createClient(url, normalizedKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseServerClient() {
  const anonKey = normalizeEnvValue(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  return anonKey ? createSupabaseClient(anonKey) : null;
}

export function getSupabaseAdminClient() {
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  );

  return serviceRoleKey ? createSupabaseClient(serviceRoleKey) : null;
}
