import { describe, it, expect, vi, beforeEach } from 'vitest';
const mocks = vi.hoisted(() => ({ auth: { signUp: vi.fn(), signOut: vi.fn(), setSession: vi.fn(), resetPasswordForEmail: vi.fn() }, functions: { invoke: vi.fn() }, from: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => mocks }));
let auth: typeof import('../src/services/auth');
beforeEach(async () => {
  vi.resetAllMocks(); vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_test');
  vi.stubGlobal('window', { location: { origin: 'https://herspace.example' } });
  auth = await import('../src/services/auth');
});
describe('HerSpace real authentication boundary', () => {
  it('normalizes handles and rejects email-like or invalid usernames', () => {
    expect(auth.normalizeUsername(' Maya_92 ')).toBe('maya_92');
    for (const value of ['a','22maya','maya@example.com','maya/../x']) expect(() => auth.normalizeUsername(value)).toThrow();
  });
  const account = { username: 'Maya_92', email: 'private@example.com', password: '  a secure passphrase  ', age: 24, identity: 'woman', agreeTerms: true };
  it('requires a recovery email, adult eligibility, consent and a strong password', async () => {
    for (const change of [{email:''},{age:17},{age:NaN},{identity:'other'},{agreeTerms:false},{password:'short'}]) await expect(auth.registerAccount({...account,...change})).rejects.toThrow();
    expect(mocks.auth.signUp).not.toHaveBeenCalled();
  });
  it('registers through Supabase, preserves password spaces, and requests email verification', async () => {
    mocks.auth.signUp.mockResolvedValue({data:{user:{},session:null},error:null});
    await auth.registerAccount(account);
    expect(mocks.auth.signUp).toHaveBeenCalledWith(expect.objectContaining({email:account.email,password:account.password,options:expect.objectContaining({emailRedirectTo:'https://herspace.example/',data:expect.objectContaining({username:'maya_92',terms_accepted:true})})}));
  });
  it('does not retain an unverified signup session', async () => {
    mocks.auth.signUp.mockResolvedValue({data:{user:{email_confirmed_at:null},session:{}},error:null});
    await auth.registerAccount(account); expect(mocks.auth.signOut).toHaveBeenCalled();
  });
  it('does not accept failed password authentication or fabricate a session', async () => {
    mocks.functions.invoke.mockResolvedValue({data:null,error:new Error('denied')});
    await expect(auth.loginAccount('maya_92','wrong')).rejects.toThrow('Unable to sign in');
    expect(mocks.auth.setSession).not.toHaveBeenCalled();
  });
  it('establishes only the session returned by the password endpoint', async () => {
    const session={access_token:'test-access',refresh_token:'test-refresh'};
    mocks.functions.invoke.mockResolvedValue({data:session,error:null}); mocks.auth.setSession.mockResolvedValue({error:null});
    await auth.loginAccount('MAYA_92',account.password);
    expect(mocks.functions.invoke).toHaveBeenCalledWith('username-login',{body:{username:'maya_92',password:account.password}});
    expect(mocks.auth.setSession).toHaveBeenCalledWith(session);
  });
  it('refuses to load profiles for unverified email identities', async () => {
    await expect(auth.loadAccount({id:'test',email_confirmed_at:null} as any)).rejects.toThrow('Verify');
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it('sends password recovery only to the supplied private email and configured callback', async () => {
    mocks.auth.resetPasswordForEmail.mockResolvedValue({error:null}); await auth.requestPasswordReset(' private@example.com ');
    expect(mocks.auth.resetPasswordForEmail).toHaveBeenCalledWith('private@example.com',{redirectTo:'https://herspace.example/'});
  });
});
