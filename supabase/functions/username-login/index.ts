import { createClient } from 'npm:@supabase/supabase-js@2.119.0';
import { createLoginHandler } from './handler.ts';
// Pre-authentication endpoint: password verified through Supabase Auth; JWT not yet available.
Deno.serve(createLoginHandler({
  url: Deno.env.get('SUPABASE_URL')!,
  serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  anonKey: Deno.env.get('SUPABASE_ANON_KEY')!,
  origin: Deno.env.get('HERSPACE_APP_ORIGIN'),
  createClient
}));
