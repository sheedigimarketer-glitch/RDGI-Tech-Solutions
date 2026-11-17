import { createClient } from 'npm:@supabase/supabase-js@2.119.0';
import { createUsernameLogin } from './handler.ts';

const url = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const projectRef = new URL(url).hostname.split('.')[0];
const origins = projectRef === 'ixtpdvxilstlfknudqbq'
  ? [
      'https://rdgi-tech-solutions-git-release-hers-1681c6-rdgi-tech-solutions.vercel.app',
      'http://localhost:8080'
    ]
  : projectRef === 'tzbkjvvkhxxobqsbtsdq'
    ? ['https://rdgi-tech-solutions.vercel.app']
    : [];
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

Deno.serve(createUsernameLogin({
  origins,
  async resolve(username) {
    const admin = createClient(url, serviceKey, options);
    const { data, error } = await admin.rpc('herspace_resolve_username_login', { requested_username: username });
    if (error || !data) throw new Error('Username lookup failed');
    return data;
  },
  async authenticate(email, password) {
    const auth = createClient(url, anonKey, options);
    const { data, error } = await auth.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user?.email_confirmed_at) return null;
    return { access_token: data.session.access_token, refresh_token: data.session.refresh_token };
  }
}));
