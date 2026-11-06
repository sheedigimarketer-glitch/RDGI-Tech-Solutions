// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { HeroAuthCard } from '../src/components/HeroAuthCard';
const mocks=vi.hoisted(()=>({anonymousAuth:vi.fn(),reset:vi.fn(),policy:vi.fn()}));
vi.mock('../src/context/AppContext',()=>({useApp:()=>({user:null,anonymousAuth:mocks.anonymousAuth,navigate:vi.fn(),signOut:vi.fn(),isTa:false,openPolicyModal:mocks.policy})}));
vi.mock('../src/services/auth',()=>({requestPasswordReset:mocks.reset}));
afterEach(()=>{cleanup();vi.clearAllMocks();});
describe('Member authentication screens',()=>{
  it('requires recovery email, password and explicit unchecked consent during signup',()=>{
    render(<HeroAuthCard />);
    expect((screen.getByLabelText('Private recovery email',{exact:false}) as HTMLInputElement).required).toBe(true);
    expect((screen.getByLabelText('Password',{exact:false}) as HTMLInputElement).minLength).toBe(12);
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
    fireEvent.click(screen.getByRole('button',{name:'Read Privacy Policy'}));
    expect(mocks.policy).toHaveBeenCalledWith('privacy');
  });
  it('submits entered credentials without trimming the password and shows verification instruction',async()=>{
    mocks.anonymousAuth.mockResolvedValue(undefined); render(<HeroAuthCard />);
    fireEvent.change(screen.getByLabelText('Username'),{target:{value:'maya_92'}});
    fireEvent.change(screen.getByLabelText('Private recovery email',{exact:false}),{target:{value:'private@example.com'}});
    fireEvent.change(screen.getByLabelText('Password',{exact:false}),{target:{value:'  a secure passphrase  '}});
    fireEvent.change(screen.getByLabelText('Age'),{target:{value:'24'}});
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByRole('button',{name:'Create free account'}).closest('form')!);
    await waitFor(()=>expect(mocks.anonymousAuth).toHaveBeenCalledWith(expect.objectContaining({username:'maya_92',password:'  a secure passphrase  ',email:'private@example.com',agreeTerms:true,mode:'register'})));
    expect(await screen.findByRole('status')).toHaveProperty('textContent','Check your email to verify your account, then sign in.');
  });
  it('shows failed sign-in without announcing success',async()=>{
    mocks.anonymousAuth.mockRejectedValue(new Error('Unable to sign in.'));render(<HeroAuthCard initialMode="signin" />);
    fireEvent.change(screen.getByLabelText('Username'),{target:{value:'maya_92'}});
    fireEvent.change(screen.getByLabelText('Password'),{target:{value:'wrong'}});
    fireEvent.submit(screen.getAllByRole('button',{name:'Sign in',exact:true}).find(button => button.getAttribute('type') === 'submit')!.closest('form')!);
    expect((await screen.findByRole('alert')).textContent).toBe('Unable to sign in.');
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('offers recovery without requiring a username or revealing account existence',async()=>{
    mocks.reset.mockResolvedValue(undefined);render(<HeroAuthCard initialMode="signin" />);
    fireEvent.click(screen.getByRole('button',{name:'Forgot password?'}));
    expect(screen.queryByLabelText('Username')).toBeNull();
    fireEvent.change(screen.getByLabelText('Private recovery email',{exact:false}),{target:{value:'private@example.com'}});
    fireEvent.submit(screen.getByRole('button',{name:'Send recovery link'}).closest('form')!);
    expect((await screen.findByRole('status')).textContent).toContain('If an account exists');
    expect(mocks.reset).toHaveBeenCalledWith('private@example.com');
  });
});
