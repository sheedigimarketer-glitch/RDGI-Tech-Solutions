// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { App } from '../src/App';
import { AppProvider, useApp } from '../src/context/AppContext';

const backend = vi.hoisted(() => {
  let listeners: Array<(event: string, session: unknown) => void> = [];
  return {
    account: null as any,
    profile: null as any,
    entitlement: null as any,
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    getUser: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
    signOut: vi.fn(),
    insert: vi.fn(),
    read: vi.fn(),
    subscribe(listener: (event: string, session: unknown) => void) {
      listeners.push(listener);
      queueMicrotask(() => {
        if (listeners.includes(listener)) listener('INITIAL_SESSION', this.account ? { user: this.account } : null);
      });
      return { data: { subscription: { unsubscribe: () => { listeners = listeners.filter(fn => fn !== listener); } } } };
    },
    emit(event: string) {
      for (const listener of listeners) listener(event, this.account ? { user: this.account } : null);
    }
  };
});

vi.mock('../src/services/auth', () => ({
  memberResetPath: '/member/reset',
  memberSigninPath: '/member/sign-in',
  validatePassword: (value: string) => {
    if (value.length < 12 || value.length > 128) throw new Error('weak_password');
  },
  supabase: {
    auth: {
      signUp: backend.signUp, signInWithPassword: backend.signInWithPassword, getUser: backend.getUser,
      resetPasswordForEmail: backend.resetPasswordForEmail, updateUser: backend.updateUser, signOut: backend.signOut,
      onAuthStateChange: backend.subscribe.bind(backend)
    },
    from: (table: string) => ({
      select: () => ({ eq: (column: string, id: string) => ({
        maybeSingle: () => backend.read(table, column, id)
      }) }),
      insert: backend.insert
    })
  }
}));

const account = { id: 'real-member', email: 'member@example.test', email_confirmed_at: '2026-11-06', created_at: '2026-11-06' };
const profile = { full_name: 'Member Alias', date_of_birth: '1995-05-06', eligibility_category: 'woman', onboarding_completed_at: '2026-11-07' };
const main = () => within(screen.getByRole('main'));
const enter = (label: string, value: string) => fireEvent.change(main().getByLabelText(label), { target: { value } });
const submit = (name: string) => fireEvent.click(main().getByRole('button', { name }));
const waitForHeading = (name: string | RegExp) => screen.findByRole('heading', { name });

function DashboardLink() {
  const { navigate } = useApp();
  return <button onClick={() => navigate('dashboard')}>Test protected route</button>;
}
function launch() {
  return render(<AppProvider><App /><DashboardLink /></AppProvider>);
}

beforeEach(() => {
  vi.resetAllMocks();
  window.history.replaceState(null, '', '/');
  window.scrollTo = vi.fn();
  backend.account = null;
  backend.profile = null;
  backend.entitlement = null;
  backend.signUp.mockResolvedValue({ data: { session: null }, error: null });
  backend.getUser.mockImplementation(async () => ({ data: { user: backend.account }, error: null }));
  backend.read.mockImplementation(async (table: string) => ({
    data: table === 'member_profiles' ? backend.profile : backend.entitlement, error: null
  }));
  backend.signOut.mockImplementation(async () => {
    backend.account = null;
    backend.emit('SIGNED_OUT');
    return { error: null };
  });
  backend.insert.mockImplementation(async (row: any) => {
    backend.profile = row;
    return { error: null };
  });
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

it('registers with Supabase, gives duplicates the same message and requires verification', async () => {
  launch();
  fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
  await waitForHeading('Create your HerSpace account');
  const fill = () => {
    enter('Email address', 'NEW@example.test');
    enter('Password (12–128 characters)', 'safe-demo-password');
    const consent = main().getByRole('checkbox') as HTMLInputElement;
    if (!consent.checked) fireEvent.click(consent);
    submit('Create account');
  };
  fill();
  const generic = /If this email can be registered/;
  expect(await main().findByText(generic)).toBeTruthy();
  expect(backend.signUp).toHaveBeenCalledWith({
    email: 'new@example.test', password: 'safe-demo-password',
    options: { emailRedirectTo: window.location.origin + '/member/confirm' }
  });
  expect(backend.insert).not.toHaveBeenCalled();

  backend.signUp.mockResolvedValueOnce({ data: { session: null }, error: { code: 'user_already_exists' } });
  fill();
  expect(await main().findByText(generic)).toBeTruthy();
  expect(backend.signUp).toHaveBeenCalledTimes(2);
});

it('resumes a verified signup, validates eligibility and completes all four onboarding steps', async () => {
  window.history.replaceState(null, '', '/member/confirm');
  backend.account = account;
  const app = launch();
  await waitForHeading('Complete your member profile');
  enter('Your name or preferred alias', 'Member Alias');
  enter('Date of birth (18+)', '2017-01-01');
  enter('Eligibility', 'woman');
  fireEvent.click(main().getByRole('checkbox'));
  fireEvent.submit(main().getByRole('button', { name: 'Continue to the tour' }).closest('form')!);
  expect(await main().findByRole('alert')).toHaveProperty('textContent', 'Check your details, age eligibility and consent.');
  expect(backend.insert).not.toHaveBeenCalled();

  enter('Date of birth (18+)', '1995-01-01');
  submit('Continue to the tour');
  await waitForHeading('Three Kinds of Caring Support');
  expect(backend.insert).toHaveBeenCalledWith(expect.objectContaining({
    user_id: account.id, full_name: 'Member Alias', eligibility_category: 'woman'
  }));
  expect(screen.getByText('Step 2 of 4')).toBeTruthy();

  submit('Skip Tour');
  await waitForHeading('Membership');
  expect(screen.getByText('Step 3 of 4')).toBeTruthy();
  expect(main().queryByText('Free trial active')).toBeNull();
  submit('Choose & Book a Service →');
  await waitForHeading('Choose Your First Care Session');
  expect(screen.getByText('Step 4 of 4')).toBeTruthy();

  submit('Go to My Personal Space →');
  await waitForHeading('Welcome, Member');
  expect(localStorage.getItem('herspace_onboarding_completed:' + account.id)).toBeTruthy();
  app.unmount();
  window.history.replaceState(null, '', '/member/sign-in');
  launch();
  await waitForHeading('Welcome, Member');
});

it('protects the dashboard, handles invalid credentials, restores a session and signs out', async () => {
  backend.profile = profile;
  backend.signInWithPassword.mockResolvedValueOnce({ error: { code: 'invalid_credentials' } });
  backend.signInWithPassword.mockImplementationOnce(async () => {
    backend.account = account;
    backend.emit('SIGNED_IN');
    return { error: null };
  });
  const app = launch();
  fireEvent.click(screen.getByText('Test protected route'));
  await waitForHeading('Welcome back');
  expect(backend.read).not.toHaveBeenCalled();
  const fill = (password: string) => {
    enter('Email address', account.email);
    enter('Password', password);
    submit('Sign In');
  };
  fill('bad-password');
  expect(await main().findByRole('alert')).toHaveProperty('textContent', 'Check your email and password, and verify your email before signing in.');
  fill('existing-password');
  expect(await screen.findByText('MEMBER SESSIONS & PRIVILEGES')).toBeTruthy();
  expect(backend.read).toHaveBeenCalledWith('member_profiles', 'user_id', account.id);

  app.unmount();
  launch();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Enter My Safe Space →' })).toBeTruthy());
  fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));
  await main().findByRole('button', { name: 'Sign In' });
  expect(backend.signOut).toHaveBeenCalledWith({ scope: 'local' });
  fireEvent.click(screen.getByText('Test protected route'));
  await waitForHeading('Welcome back');
});

it('keeps an unverified auth session outside member records and dashboard', async () => {
  backend.account = { ...account, email_confirmed_at: undefined };
  backend.profile = profile;
  launch();
  fireEvent.click(screen.getByText('Test protected route'));
  await waitForHeading('Could not load your account');
  expect(backend.read).not.toHaveBeenCalled();
});

it('switches the member form to Tamil and requests a generic reset email', async () => {
  backend.resetPasswordForEmail.mockResolvedValueOnce({ error: null });
  launch();
  fireEvent.click(main().getByRole('button', { name: 'Sign In' }));
  await waitForHeading('Welcome back');
  fireEvent.click(screen.getByRole('button', { name: 'Switch Language' }));
  expect(main().getByLabelText('மின்னஞ்சல் முகவரி')).toBeTruthy();
  expect(main().getByLabelText('கடவுச்சொல்')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Switch Language' }));
  submit('Forgot password?');
  enter('Email address', account.email);
  submit('Send reset link');
  expect(await main().findByText(/If the email belongs to an eligible account/)).toBeTruthy();
  expect(backend.resetPasswordForEmail).toHaveBeenCalledWith(account.email, {
    redirectTo: window.location.origin + '/member/reset'
  });
});

it('allows a password update only after a recovery event', async () => {
  window.history.replaceState(null, '', '/member/reset');
  backend.account = account;
  backend.updateUser.mockResolvedValueOnce({ error: null });
  launch();
  expect(await main().findByText('Request a fresh reset link to continue.')).toBeTruthy();
  expect(backend.getUser).not.toHaveBeenCalled();
  backend.emit('PASSWORD_RECOVERY');
  await main().findByLabelText('Password (12–128 characters)');
  enter('Password (12–128 characters)', 'replacement-password');
  enter('Confirm new password', 'different-password');
  submit('Save new password');
  expect(await main().findByText('Passwords must match.')).toBeTruthy();
  expect(backend.updateUser).not.toHaveBeenCalled();
  enter('Password (12–128 characters)', 'replacement-password');
  enter('Confirm new password', 'replacement-password');
  submit('Save new password');
  expect(await main().findByText(/Password updated/)).toBeTruthy();
  expect(backend.updateUser).toHaveBeenCalledWith({ password: 'replacement-password' });
});
