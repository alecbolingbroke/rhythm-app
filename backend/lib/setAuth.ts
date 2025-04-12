import { createClient } from "@supabase/supabase-js"

export const createSupabaseClientWithAuth = (accessToken: string) => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!, // use anon or service key
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  )
}
