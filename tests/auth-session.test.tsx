// @vitest-environment jsdom
import React from 'react';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
const mocks=vi.hoisted(()=>({callback:null as any,getUser:vi.fn(),loadAccount:vi.fn(),unsubscribe:vi.fn()}));
vi.mock('../src/services/auth',()=>({
  supabase:{auth:{onAuthStateChange:(callback:any)=>{mocks.callback=callback;return {data:{subscription:{unsubscribe:mocks.unsubscribe}}};},getUser:mocks.getUser}},
  requireClient:vi.fn(),loginAccount:vi.fn(),registerAccount:vi.fn(),loadAccount:mocks.loadAccount
}));
import { AppProvider, useApp } from '../src/context/AppContext';
const Probe=()=>{const {user,entitlement}=useApp();return <><span data-testid="identity">{user?.id || 'signed-out'}</span><span data-testid="trial">{entitlement?.trialEndsAt || 'none'}</span></>};
beforeEach(()=>{localStorage.clear();vi.clearAllMocks();});
afterEach(cleanup);
it('never accepts forged browser user or membership records as authentication',()=>{
  localStorage.setItem('herspace_user',JSON.stringify({id:'forged-admin',role:'admin'}));
  localStorage.setItem('herspace_entitlement',JSON.stringify({trialEndsAt:'2099-01-01'}));
  render(<AppProvider><Probe/></AppProvider>);
  expect(screen.getByTestId('identity').textContent).toBe('signed-out');
  expect(screen.getByTestId('trial').textContent).toBe('none');
});
it('ignores an account load that completes after sign-out',async()=>{
  let finish:any;
  mocks.getUser.mockResolvedValue({data:{user:{id:'alice'}},error:null});
  mocks.loadAccount.mockReturnValue(new Promise(resolve=>{finish=resolve;}));
  render(<AppProvider><Probe/></AppProvider>);
  await act(async()=>{mocks.callback('SIGNED_IN',{user:{id:'alice'}});});
  await waitFor(()=>expect(mocks.loadAccount).toHaveBeenCalled());
  await act(async()=>{mocks.callback('SIGNED_OUT',null);});
  await act(async()=>{finish({user:{id:'alice'},entitlement:{trialEndsAt:'2027-02-06'}});});
  expect(screen.getByTestId('identity').textContent).toBe('signed-out');
  expect(screen.getByTestId('trial').textContent).toBe('none');
});
