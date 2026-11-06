// @vitest-environment jsdom
import React from 'react';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
const mocks=vi.hoisted(()=>({status:vi.fn(),signIn:vi.fn(),overview:vi.fn(),factor:vi.fn(),verify:vi.fn(),enroll:vi.fn(),recover:vi.fn(),reset:vi.fn(),signOut:vi.fn(),callback:null as any}));
vi.mock('../src/services/auth',()=>({supabase:{auth:{onAuthStateChange:(cb:any)=>{mocks.callback=cb;return{data:{subscription:{unsubscribe:vi.fn()}}};}}}}));
vi.mock('../src/services/admin',()=>({staffStatus:mocks.status,signInAdmin:mocks.signIn,adminOverview:mocks.overview,verifiedFactor:mocks.factor,verifyAdminFactor:mocks.verify,enrollAdminFactor:mocks.enroll,recoverAdmin:mocks.recover,resetAdminPassword:mocks.reset,signOutAdmin:mocks.signOut}));
import { AdminPortal } from '../src/views/AdminPortal';
beforeEach(()=>{window.history.replaceState({},'', '/');vi.resetAllMocks();mocks.status.mockResolvedValue(null);mocks.factor.mockResolvedValue('test-factor');});
afterEach(cleanup);
it('renders the private staff login with no public admin signup',async()=>{
 render(<AdminPortal/>);expect(await screen.findByLabelText('Email address')).toBeTruthy();expect(screen.getByLabelText('Password')).toHaveProperty('type','password');expect(screen.queryByRole('button',{name:/register/i})).toBeNull();
});
it('never renders the dashboard for a signed-in non-staff user',async()=>{
 mocks.status.mockResolvedValue({is_staff:false,has_admin_access:false});render(<AdminPortal/>);expect(await screen.findByText('Access restricted')).toBeTruthy();expect(mocks.overview).not.toHaveBeenCalled();
});
it('requires authenticator verification before loading the overview',async()=>{
 mocks.status.mockResolvedValue({is_staff:true,has_admin_access:false});render(<AdminPortal/>);expect(await screen.findByLabelText('Authenticator code')).toBeTruthy();expect(mocks.overview).not.toHaveBeenCalled();
});
it('loads real dashboard data only after the server approves admin access',async()=>{
 mocks.status.mockResolvedValue({is_staff:true,has_admin_access:true});mocks.overview.mockResolvedValue({member_count:12,active_trial_count:9,welcome_calls_used:2,members:[]});render(<AdminPortal/>);
 expect(await screen.findByText('Your care workspace')).toBeTruthy();expect(screen.getByText('12')).toBeTruthy();expect(screen.getByText('No members have registered yet.')).toBeTruthy();
});
it('does not display dashboard data after sign-out',async()=>{
 mocks.status.mockResolvedValue({is_staff:true,has_admin_access:true});mocks.overview.mockResolvedValue({member_count:12,active_trial_count:9,welcome_calls_used:2,members:[]});render(<AdminPortal/>);await screen.findByText('Your care workspace');
 const {act}=await import('@testing-library/react');await act(async()=>mocks.callback('SIGNED_OUT'));
 await waitFor(()=>expect(screen.queryByText('Your care workspace')).toBeNull());expect(screen.getByLabelText('Email address')).toBeTruthy();
});
it('shows generic recovery confirmation without revealing whether an email is registered',async()=>{
 mocks.recover.mockResolvedValue(undefined);render(<AdminPortal/>);await screen.findByLabelText('Email address');fireEvent.click(screen.getByRole('button',{name:'Forgot password?'}));fireEvent.change(screen.getByLabelText('Private staff email'),{target:{value:'staff@example.com'}});fireEvent.submit(screen.getByRole('button',{name:'Send recovery link'}).closest('form')!);
 expect((await screen.findByRole('status')).textContent).toContain('If an account exists');expect(mocks.recover).toHaveBeenCalledWith('staff@example.com');
});

it('lets an invited verified account set its own password without granting or loading admin data',async()=>{
 window.history.replaceState({},'', '/admin/setup');mocks.status.mockResolvedValue({is_staff:false,has_admin_access:false});render(<AdminPortal/>);
 expect(await screen.findByLabelText('New password')).toBeTruthy();expect(mocks.overview).not.toHaveBeenCalled();
});
