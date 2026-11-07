import { createClient } from '@supabase/supabase-js';

const indianPhone = /^\+91[6-9]\d{9}$/;

function prepareCall(env) {
  const { EXOTEL_API_KEY: key, EXOTEL_API_TOKEN: token, EXOTEL_ACCOUNT_SID: account,
    EXOTEL_CALLER_ID: caller, HERSPACE_PILOT_CALL_FROM: from, HERSPACE_PILOT_CALL_TO: to } = env;
  if (!key || !token || !/^[\w-]+$/.test(account || '') || !/^\+?\d{10,15}$/.test(caller || '')
    || !indianPhone.test(from || '') || !indianPhone.test(to || '') || from === to) return null;
  return {
    url: `https://api.exotel.com/v1/Accounts/${account}/Calls/connect`,
    options: {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${key}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ From: from, To: to, CallerId: caller, TimeLimit: '30', Record: 'false' })
    }
  };
}

function prepareMessage(env) {
  const { WHATSAPP_ACCESS_TOKEN: token, WHATSAPP_TEST_PHONE_NUMBER_ID: sender,
    WHATSAPP_GRAPH_VERSION: version, HERSPACE_PILOT_WHATSAPP_TO: to } = env;
  if (!token || !/^\d+$/.test(sender || '') || !/^v\d+\.\d+$/.test(version || '')
    || !indianPhone.test(to || '')) return null;
  return {
    url: `https://graph.facebook.com/${version}/${sender}/messages`,
    options: {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to.slice(1),
        type: 'template',
        template: { name: 'hello_world', language: { code: 'en_US' } }
      })
    }
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const env = process.env;
  if (env.VERCEL_ENV !== 'preview' || env.HERSPACE_COMMUNICATIONS_PILOT !== 'enabled') {
    return res.status(503).json({ error: 'Communications testing is unavailable.' });
  }

  const match = /^Bearer ([\w.-]+)$/.exec(req.headers.authorization || '');
  if (!match) return res.status(401).json({ error: 'Sign in to run a test.' });
  const { channel } = req.body || {};
  if (channel !== 'call' && channel !== 'whatsapp') return res.status(400).json({ error: 'Choose a test service.' });
  if (env.HERSPACE_SUPABASE_URL !== 'https://tzbkjvvkhxxobqsbtsdq.supabase.co'
    || !env.HERSPACE_SUPABASE_PUBLISHABLE_KEY?.startsWith('sb_publishable_')) {
    return res.status(503).json({ error: 'Communications testing is unavailable.' });
  }

  try {
    const client = createClient(env.HERSPACE_SUPABASE_URL, env.HERSPACE_SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: `Bearer ${match[1]}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    const { data: staff, error: staffError } = await client.rpc('herspace_staff_status');
    if (staffError || staff?.has_admin_access !== true) {
      return res.status(403).json({ error: 'Staff access with two-step verification is required.' });
    }
    const request = channel === 'call' ? prepareCall(env) : prepareMessage(env);
    if (!request) return res.status(503).json({ error: 'This test service is not configured.' });

    const { data: reserved, error } = await client.rpc('herspace_reserve_communications_test', { channel });
    if (error) return res.status(503).json({ error: 'The test allowance could not be verified.' });
    if (reserved !== true) return res.status(409).json({ error: 'The test allowance for this service has been used.' });

    const response = await fetch(request.url, {
      ...request.options, method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000)
    });
    const data = await response.json();
    const acceptedId = channel === 'call' ? data?.Call?.Sid : data?.messages?.[0]?.id;
    if (!response.ok || !acceptedId) return res.status(502).json({ error: 'The provider did not accept the test request. Check its dashboard before retrying.' });
    return res.status(202).json({ message: 'The provider accepted the test request. Confirm receipt on the test phone.' });
  } catch {
    return res.status(502).json({ error: 'The test result is unknown. Check the provider dashboard before retrying.' });
  }
}
