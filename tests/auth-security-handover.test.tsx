// @vitest-environment jsdom
import React from 'react';
import { createRequire } from 'node:module';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { AppProvider, useApp } from '../src/context/AppContext';
import { HeroAuthCard } from '../src/components/HeroAuthCard';

const require = createRequire(import.meta.url);

afterEach(() => {
  cleanup();
  localStorage.clear();
});

it('ignores legacy browser identity and private records on the member entry card', () => {
  localStorage.setItem('herspace_user', JSON.stringify({ id: 'old-demo-user', isAuthenticated: true }));
  localStorage.setItem('herspace_appointments', JSON.stringify([{ id: 'old-appointment' }]));
  localStorage.setItem('herspace_cycle', JSON.stringify({ logs: [{ id: 'old-cycle' }] }));
  localStorage.setItem('herspace_pro_applications', JSON.stringify([{ id: 'old-application' }]));

  function PrivateState() {
    const { user, appointments, cycle, proApplications } = useApp();
    return <output>{JSON.stringify([user, appointments, cycle.logs, proApplications])}</output>;
  }

  render(<AppProvider><HeroAuthCard /><PrivateState /></AppProvider>);
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
  expect(screen.queryByRole('textbox')).toBeNull();
  expect(screen.getByText('[null,[],[],[]]')).toBeTruthy();
  expect(localStorage.getItem('herspace_appointments')).toContain('old-appointment');
});

it.each([
  ['../api/auth/otp.js', 410],
  ['../api/telephony/connect.js', 503],
])('fails closed on %s even when request data is supplied', (path, expectedStatus) => {
  const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn() };
  require(path)({ method: 'POST', body: { action: 'send', phone: '+12025550199', bookingId: 'fake' } }, res);
  expect(res.status).toHaveBeenCalledWith(expectedStatus);
  expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
  expect(res.json.mock.calls[0][0]).toEqual({ error: expect.any(String) });
});
