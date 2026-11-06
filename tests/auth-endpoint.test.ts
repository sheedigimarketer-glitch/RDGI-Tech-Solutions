import { beforeEach, it, expect, vi } from 'vitest';
import { createLoginHandler } from '../supabase/functions/username-login/handler';
const permitted=vi.fn(),lookup=vi.fn(),getUser=vi.fn(),signIn=vi.fn();
const admin={rpc:permitted,from:()=>({select:()=>({eq:()=>({maybeSingle:lookup})})}),auth:{admin:{getUserById:getUser}}};
const normal={auth:{signInWithPassword:signIn}};
const client=vi.fn((_url:string,key:string)=>key==='service-key'?admin:normal);
const make=(origin:string|undefined='https://herspace.example')=>createLoginHandler({url:'https://supabase.example',serviceKey:'service-key',anonKey:'public-key',origin,createClient:client});
const request=(data:any={username:'maya_92',password:'a secure password'},origin='https://herspace.example')=>new Request('https://supabase.example/functions/v1/username-login',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(data)});
beforeEach(()=>{
  vi.clearAllMocks();
  permitted.mockResolvedValue({data:true,error:null});lookup.mockResolvedValue({data:{user_id:'alice'},error:null});
  getUser.mockResolvedValue({data:{user:{email:'private@example.com'}},error:null});
  signIn.mockResolvedValue({data:{user:{email_confirmed_at:'2026-11-06'},session:{access_token:'access',refresh_token:'refresh'}},error:null});
});
it('fails closed when the permitted app origin is not configured',async()=>{
  expect((await make('')(request())).status).toBe(503);expect(client).not.toHaveBeenCalled();
});
it('rejects another browser origin and malformed handles before lookup',async()=>{
  expect((await make()(request(undefined,'https://attacker.example'))).status).toBe(403);
  expect((await make()(request({username:'../x',password:'secret'}))).status).toBe(401);expect(client).not.toHaveBeenCalled();
});
it('does not expose credentials or recovery email; authenticates through the public client',async()=>{
  const result=await make()(request());expect(result.status).toBe(200);
  expect(await result.json()).toEqual({access_token:'access',refresh_token:'refresh'});
  expect(signIn).toHaveBeenCalledWith({email:'private@example.com',password:'a secure password'});
  expect(result.headers.get('cache-control')).toBe('no-store');
});
it('returns identical authentication errors for unknown users and incorrect passwords',async()=>{
  signIn.mockResolvedValue({data:{session:null},error:{message:'invalid credentials'}});
  const wrong=await make()(request());lookup.mockResolvedValue({data:null,error:null});
  const unknown=await make()(request());expect(wrong.status).toBe(401);expect(unknown.status).toBe(401);
  expect(await wrong.json()).toEqual(await unknown.json());expect(signIn).toHaveBeenCalledTimes(2);
});
it('rejects an unverified account even if upstream returned a session',async()=>{
  signIn.mockResolvedValue({data:{session:{access_token:'access'},user:{email_confirmed_at:null}},error:null});
  expect((await make()(request())).status).toBe(401);
});
it('enforces throttle denial and fails closed on throttle storage failures',async()=>{
  permitted.mockResolvedValue({data:false,error:null});expect((await make()(request())).status).toBe(429);
  permitted.mockResolvedValue({data:null,error:{message:'db unavailable'}});expect((await make()(request())).status).toBe(503);
  expect(signIn).not.toHaveBeenCalled();
});
it('does not accept oversized or non-POST requests',async()=>{
  expect((await make()(request({username:'maya_92',password:'x'.repeat(3000)}))).status).toBe(413);
  expect((await make()(new Request('https://supabase.example/'))).status).toBe(405);
});
