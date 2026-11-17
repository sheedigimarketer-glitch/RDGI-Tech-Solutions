import { describe, expect, it, vi } from 'vitest';
import { createUsernameLogin } from '../supabase/functions/member-username-login/handler';

const origin = 'https://preview.example';
function request(body: unknown, requestOrigin = origin) {
  return new Request(origin, { method: 'POST', headers: { Origin: requestOrigin }, body: JSON.stringify(body) });
}
const form = { username: 'fixture_member', password: 'fixture-password-value' };

describe('username sign-in', () => {
  it('returns only auth tokens from a verified lookup without caching', async () => {
    const resolve = vi.fn(async () => ({ allowed: true, email: 'fixture@example.test' }));
    const authenticate = vi.fn(async () => ({ access_token: 'fixture-a', refresh_token: 'fixture-r' }));
    const handler = createUsernameLogin({ origins: [origin], resolve, authenticate });
    const response = await handler(request(form));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(origin);
    expect(await response.json()).toEqual({ access_token: 'fixture-a', refresh_token: 'fixture-r' });
    expect(resolve).toHaveBeenCalledWith(form.username);
    expect(authenticate).toHaveBeenCalledWith('fixture@example.test', form.password);
  });

  it('uses indistinguishable replies for unknown usernames and invalid credentials', async () => {
    const resolve = vi.fn()
      .mockResolvedValueOnce({ allowed: true })
      .mockResolvedValueOnce({ allowed: true, email: 'fixture@example.test' });
    const authenticate = vi.fn().mockResolvedValue(null);
    const handler = createUsernameLogin({ origins: [origin], resolve, authenticate });
    const [unknown, wrongPassword] = [await handler(request(form)), await handler(request(form))];
    expect(unknown.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(await unknown.text()).toBe(await wrongPassword.text());
    expect(authenticate).toHaveBeenCalledTimes(2);
  });

  it('rejects oversized, untrusted and throttled requests before password auth', async () => {
    const resolve = vi.fn().mockResolvedValue({ allowed: false });
    const authenticate = vi.fn();
    const handler = createUsernameLogin({ origins: [origin], resolve, authenticate });
    expect((await handler(request(form, 'https://untrusted.example'))).status).toBe(403);
    expect((await handler(request({ ...form, password: 'x'.repeat(2048) }))).status).toBe(413);
    expect((await handler(request(form))).status).toBe(429);
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(authenticate).not.toHaveBeenCalled();
  });
});
