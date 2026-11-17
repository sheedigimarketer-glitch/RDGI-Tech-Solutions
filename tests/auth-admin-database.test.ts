import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, it, expect } from 'vitest';
const db=new PGlite();
const staff='11111111-1111-4111-8111-111111111111', member='22222222-2222-4222-8222-222222222222';
const otherMember = '33333333-3333-4333-8333-333333333333';
beforeAll(async()=>{
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
  create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
  grant usage on schema auth to authenticated;
  create table auth.users(id uuid primary key);
  insert into auth.users values('${staff}'),('${member}'),('${otherMember}');`);
  await db.exec(readFileSync('supabase/baseline/member-schema.sql', 'utf8'));
  await db.exec(`insert into member_profiles(user_id,full_name) values('${member}','Member Alias');
  insert into member_entitlements(user_id, trial_ends_at, welcome_call_expires_at)
  values('${member}', now() + interval '3 months', now() + interval '7 days');`);
  await db.exec(readFileSync('supabase/migrations/20261106190523_admin_portal.sql','utf8'));
  await db.query('insert into admin_accounts(user_id) values($1)',[staff]);
},30000);
afterAll(()=>db.close());
async function asUser(id:string,aal:string,run:()=>Promise<void>){
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${id}';set request.jwt.claims='{"aal":"${aal}","user_metadata":{"role":"admin"}}';`);
  try{await run();}finally{await db.exec('reset role');}
}
it('does not authorise an ordinary member, even with MFA and forged user metadata',async()=>{
 await asUser(member,'aal2',async()=>{
   expect((await db.query('select herspace_staff_status() as status')).rows).toEqual([{status:{is_staff:false,has_admin_access:false}}]);
   await expect(db.query('select herspace_admin_overview()')).rejects.toThrow('Admin access denied');
 });
});
it('requires MFA for an authorised staff member',async()=>{
 await asUser(staff,'aal1',async()=>{
   expect((await db.query('select herspace_staff_status() as status')).rows).toEqual([{status:{is_staff:true,has_admin_access:false}}]);
   await expect(db.query('select herspace_admin_overview()')).rejects.toThrow('Admin access denied');
 });
});
it('returns real counts only to assigned staff with MFA and excludes private contact details',async()=>{
 await asUser(staff,'aal2',async()=>{
   const {rows}=await db.query<{overview:any}>('select herspace_admin_overview() as overview');
   expect(rows[0].overview.member_count).toBe(1);expect(rows[0].overview.active_trial_count).toBe(1);expect(rows[0].overview.members[0].display_name).toBe('Member Alias');
   expect(rows[0].overview.members[0]).not.toHaveProperty('email');expect(rows[0].overview.members[0]).not.toHaveProperty('phone');
 });
});
it('prevents self-promotion and direct staff-table reads',async()=>{
 await asUser(member,'aal2',async()=>{
   await expect(db.query('select * from admin_accounts')).rejects.toThrow('permission denied');
   await expect(db.query('insert into admin_accounts(user_id) values($1)',[member])).rejects.toThrow('permission denied');
   await expect(db.query('update admin_accounts set enabled=true')).rejects.toThrow('permission denied');
 });
});
it('denies anonymous function execution',async()=>{
 await db.exec('set role anon');
 try{await expect(db.query('select herspace_staff_status()')).rejects.toThrow('permission denied');await expect(db.query('select herspace_admin_overview()')).rejects.toThrow('permission denied');}
 finally{await db.exec('reset role');}
});
it('revokes access immediately when the staff assignment is disabled',async()=>{
 await db.query('update admin_accounts set enabled=false where user_id=$1',[staff]);
 await asUser(staff,'aal2',async()=>{await expect(db.query('select herspace_admin_overview()')).rejects.toThrow('Admin access denied');});
});

it('isolates profiles and benefits and blocks all direct member benefit writes', async () => {
  await asUser(otherMember, 'aal1', async () => {
    expect((await db.query('select * from member_profiles where user_id=$1', [member])).rows).toEqual([]);
    expect((await db.query('select * from member_entitlements where user_id=$1', [member])).rows).toEqual([]);
    await expect(db.query('update member_profiles set full_name=$1 where user_id=$2', ['Forged', member])).rejects.toThrow('permission denied');
    await expect(db.query('update member_entitlements set trial_ends_at=now() where user_id=$1', [otherMember])).rejects.toThrow('permission denied');
    await expect(db.query('delete from member_profiles where user_id=$1', [member])).rejects.toThrow('permission denied');
  });
});

it('allows own eligible profile creation and denies forged or underage profiles', async () => {
  await asUser(otherMember, 'aal1', async () => {
    const insert = "insert into member_profiles(user_id, full_name, date_of_birth, eligibility_category, preferred_language) values ($1, 'Fixture Member', $2, 'woman', 'en')";
    await expect(db.query(insert, [member, '1990-01-01'])).rejects.toThrow('row-level security');
    await expect(db.query(insert, [otherMember, new Date().toISOString().slice(0, 10)])).rejects.toThrow('row-level security');
    await expect(db.query("insert into member_profiles(user_id, full_name, onboarding_completed_at) values ($1, 'Fixture Member', now())", [otherMember])).rejects.toThrow('permission denied');
    await db.query(insert, [otherMember, '1990-01-01']);
    expect((await db.query('select user_id from member_profiles')).rows).toEqual([{ user_id: otherMember }]);
  });
});
