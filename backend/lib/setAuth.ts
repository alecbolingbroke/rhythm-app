import { createClient } from "@supabase/supabase-js"

export const createSupabaseClientWithAuth = (accessToken: string) => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  )
}
