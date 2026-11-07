import { expect, it, vi } from 'vitest';
import { enrollAdminFactor } from '../src/services/admin';

vi.mock('../src/services/auth', () => ({
  requireClient: () => ({
    auth: {
      mfa: {
        enroll: async () => ({
          data: {
            id: 'test-factor',
            totp: { qr_code: 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg"><path fill="#000"/></svg>' }
          },
          error: null
        })
      }
    }
  })
}));

it('encodes the SDK SVG payload once so the QR image can render', async () => {
  const result = await enrollAdminFactor();
  const url = new URL(result.qr);
  expect(url.hash).toBe('');
  const response = await fetch(url);
  expect(response.headers.get('content-type')).toContain('image/svg+xml');
  expect(await response.text()).toBe('<svg xmlns="http://www.w3.org/2000/svg"><path fill="#000"/></svg>');
  expect(result.id).toBe('test-factor');
});
