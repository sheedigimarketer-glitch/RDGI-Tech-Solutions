export function createLoginHandler(config: { url: string; serviceKey: string; anonKey: string; origin?: string; createClient: (url: string, key: string, options: any) => any }) {
const { url, serviceKey, anonKey, origin, createClient } = config;
return async (req: Request) => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': origin || '', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
  if (!origin) return reply(503, { error: 'Service unavailable' });
  if (req.headers.get('origin') && req.headers.get('origin') !== origin) return reply(403, { error: 'Request rejected' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' });
  try {
    const raw = await req.text();
    if (raw.length > 2048) return reply(413, { error: 'Request too large' });
    const { username, password } = JSON.parse(raw);
    if (typeof username !== 'string' || !/^[a-z][a-z0-9_]{2,31}$/.test(username) || typeof password !== 'string' || !password || password.length > 128) return reply(401, { error: 'Unable to sign in' });
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    // Shared, atomic account throttle; applies equally to known and unknown usernames.
    const { data: permitted, error: throttleError } = await admin.rpc('herspace_allow_login', { handle: username });
    if (throttleError) return reply(503, { error: 'Service unavailable' });
    if (!permitted) return reply(429, { error: 'Try again later' });
    const { data: handle, error: lookupError } = await admin.from('account_handles').select('user_id').eq('username', username).maybeSingle();
    if (lookupError) return reply(503, { error: 'Service unavailable' });
    const account = handle ? await admin.auth.admin.getUserById(handle.user_id) : null;
    // Unknown handles still traverse Supabase password authentication.
    const email = account?.data.user?.email || 'unknown-account@invalid.example';
    const auth = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email, password });
    if (error || !handle || !data.session || !data.user?.email_confirmed_at) return reply(401, { error: 'Unable to sign in' });
    return reply(200, { access_token: data.session.access_token, refresh_token: data.session.refresh_token });
  } catch { return reply(400, { error: 'Request could not be processed' }); }
};
}
