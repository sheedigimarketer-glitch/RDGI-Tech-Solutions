import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, it, expect } from 'vitest';
const db = new PGlite();
const alice='11111111-1111-4111-8111-111111111111', bob='22222222-2222-4222-8222-222222222222';
beforeAll(async () => {
  // Minimal test baseline reproduces the two inspected live tables; not a production migration.
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
  grant usage on schema auth to authenticated;
  create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb,created_at timestamptz not null default now());
  create table public.member_profiles(user_id uuid primary key references auth.users(id),full_name text not null check(char_length(trim(full_name)) between 2 and 100),created_at timestamptz default now(),updated_at timestamptz default now(),date_of_birth date,eligibility_category text check(eligibility_category in ('woman','transgender_woman')),country text,city text,preferred_language text,onboarding_completed_at timestamptz);
  create table public.member_entitlements(user_id uuid primary key references auth.users(id),trial_started_at timestamptz not null default now(),trial_ends_at timestamptz not null,welcome_call_expires_at timestamptz not null,welcome_call_used_at timestamptz,created_at timestamptz not null default now());`);
  await db.exec(readFileSync('supabase/migrations/20261106182331_username_auth.sql','utf8'));
  for (const [id,name] of [[alice,'alice'],[bob,'bob']]) await db.query(`insert into auth.users(id,email,raw_user_meta_data,created_at) values ($1,$2,$3,'2026-11-06T10:00:00Z')`,[id,name+'@example.com',JSON.stringify({username:name,age:24,identity:'woman',terms_accepted:true})]);
}, 30000);
afterAll(() => db.close());
it('creates an atomic username, member profile and exactly seven days of trial',async()=>{
  const {rows}=await db.query(`select p.username,e.trial_ends_at='2026-11-13T10:00:00Z'::timestamptz as correct_trial,e.welcome_call_expires_at='2026-11-13T10:00:00Z'::timestamptz as correct_voucher from member_profiles p join member_entitlements e using(user_id) where user_id=$1`,[alice]);
  expect(rows).toEqual([{username:'alice',correct_trial:true,correct_voucher:true}]);
});
it('rejects duplicate usernames transactionally',async()=>{
  await expect(db.query(`insert into auth.users(id,email,raw_user_meta_data) values(gen_random_uuid(),'duplicate@example.com',$1)`,[JSON.stringify({username:'ALICE',age:24,identity:'woman',terms_accepted:true})])).rejects.toThrow();
  expect((await db.query(`select count(*)::integer as n from auth.users`)).rows).toEqual([{n:2}]);
});
it('rejects underage signup at the database boundary',async()=>{
  await expect(db.query(`insert into auth.users(id,email,raw_user_meta_data) values(gen_random_uuid(),'young@example.com',$1)`,[JSON.stringify({username:'young',age:17,identity:'woman',terms_accepted:true})])).rejects.toThrow('Invalid registration');
});
it('RLS isolates members and prevents client entitlement writes and handle lookups',async()=>{
  await db.exec(`set role authenticated; set request.jwt.claim.sub='${alice}';`);
  try {
    expect((await db.query('select username from member_profiles')).rows).toEqual([{username:'alice'}]);
    expect((await db.query('select user_id from member_entitlements')).rows).toEqual([{user_id:alice}]);
    await expect(db.query('select * from account_handles')).rejects.toThrow('permission denied');
    await expect(db.query("update member_entitlements set trial_ends_at=now()+interval '1 year'")).rejects.toThrow('permission denied');
    await expect(db.query("select public.herspace_allow_login('alice')")).rejects.toThrow('permission denied');
  } finally { await db.exec('reset role'); }
});
it('unauthenticated callers cannot read member records',async()=>{
  await db.exec('set role anon');
  try { await expect(db.query('select * from member_profiles')).rejects.toThrow('permission denied'); }
  finally { await db.exec('reset role'); }
});
it('distributed login throttle allows ten attempts then blocks, and resets after the window',async()=>{
  for(let i=0;i<10;i++) expect((await db.query("select herspace_allow_login('alice') as allowed")).rows).toEqual([{allowed:true}]);
  expect((await db.query("select herspace_allow_login('alice') as allowed")).rows).toEqual([{allowed:false}]);
  await db.exec("update account_login_limits set window_started_at=now()-interval '16 minutes' where username='alice'");
  expect((await db.query("select herspace_allow_login('alice') as allowed")).rows).toEqual([{allowed:true}]);
});
