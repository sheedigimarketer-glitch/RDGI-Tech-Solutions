import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import handler from '../api/communications/pilot.js';
import legacyCall from '../api/telephony/connect.js';

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ rpc }) }));

function invoke(channel: string, authorization = 'Bearer test.jwt.token') {
  const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn() };
  return handler({
    method: 'POST', headers: { authorization },
    body: { channel, userPhone: '+919000000099', listenerId: 'client-supplied' }
  }, res).then(() => res);
}

beforeEach(() => {
  rpc.mockReset();
  rpc.mockResolvedValueOnce({ data: { has_admin_access: true } }).mockResolvedValueOnce({ data: true });
  for (const [name, value] of Object.entries({
    VERCEL_ENV: 'preview',
    HERSPACE_COMMUNICATIONS_PILOT: 'enabled',
    HERSPACE_SUPABASE_URL: 'https://tzbkjvvkhxxobqsbtsdq.supabase.co',
    HERSPACE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
    EXOTEL_API_KEY: 'test-key',
    EXOTEL_API_TOKEN: 'test-token',
    EXOTEL_ACCOUNT_SID: 'test-account',
    EXOTEL_CALLER_ID: '04400000000',
    HERSPACE_PILOT_CALL_FROM: '+919000000001',
    HERSPACE_PILOT_CALL_TO: '+919000000002',
    WHATSAPP_ACCESS_TOKEN: 'test-token',
    WHATSAPP_TEST_PHONE_NUMBER_ID: '100000',
    WHATSAPP_GRAPH_VERSION: 'v25.0',
    HERSPACE_PILOT_WHATSAPP_TO: '+919000000003'
  })) vi.stubEnv(name, value);
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('does not activate in production even when provider credentials are present', async () => {
  vi.stubEnv('VERCEL_ENV', 'production');
  const res = await invoke('call');
  expect(res.status).toHaveBeenCalledWith(503);
  expect(fetch).not.toHaveBeenCalled();
});

it('prevents anonymous and non-admin requests from reaching a provider', async () => {
  expect((await invoke('call', '')).status).toHaveBeenCalledWith(401);
  rpc.mockReset().mockResolvedValueOnce({ data: { has_admin_access: false } });
  expect((await invoke('whatsapp')).status).toHaveBeenCalledWith(403);
  expect(fetch).not.toHaveBeenCalled();
});

it('requires the database allowance before any provider request', async () => {
  rpc.mockReset().mockResolvedValueOnce({ data: { has_admin_access: true } }).mockResolvedValueOnce({ data: false });
  expect((await invoke('call')).status).toHaveBeenCalledWith(409);
  expect(fetch).not.toHaveBeenCalled();
});

it('dials only the configured test phones with recording disabled', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(Response.json({ Call: { Sid: 'test' } }));
  expect((await invoke('call')).status).toHaveBeenCalledWith(202);
  const [url, options] = vi.mocked(fetch).mock.calls[0];
  expect(url).toBe('https://api.exotel.com/v1/Accounts/test-account/Calls/connect');
  expect(Object.fromEntries(options?.body as URLSearchParams)).toMatchObject({
    From: '+919000000001', To: '+919000000002', Record: 'false', TimeLimit: '30'
  });
});

it('sends only the stock WhatsApp test template to the configured test phone', async () => {
  vi.mocked(fetch).mockResolvedValueOnce(Response.json({ messages: [{ id: 'test' }] }));
  expect((await invoke('whatsapp')).status).toHaveBeenCalledWith(202);
  const [, options] = vi.mocked(fetch).mock.calls[0];
  expect(JSON.parse(options?.body as string)).toMatchObject({
    to: '919000000003', template: { name: 'hello_world' }
  });
});

it('does not display a simulated success on the old member call endpoint', () => {
  const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn() };
  legacyCall({ method: 'POST' }, res);
  expect(res.status).toHaveBeenCalledWith(503);
  expect(fetch).not.toHaveBeenCalled();
});
