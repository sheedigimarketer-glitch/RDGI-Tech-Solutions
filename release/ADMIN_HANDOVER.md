# HerSpace admin login — review candidate

## Scope

Dedicated /admin/login page with email/password authentication, mandatory TOTP verification, first-time authenticator pairing, recovery and sign-out. The responsive lavender/plum page is styled independently of the member interface. There is no default password and no public staff registration. The previous client-only admin PIN screen is no longer imported or routed.

The dashboard reads real member counts, active-trial counts, welcome-call usage and up to 100 recent member aliases. It excludes email addresses, phone numbers and health records. Professional approvals, booking administration, payment management and calling are visibly not enabled. This is a staff login foundation, not a claim that the entire HerSpace platform is ready for client production use.

## Database and access model

Only supabase/migrations/20261106190523_admin_portal.sql belongs to this candidate. It is additive and compatible with the two inspected live member tables; do not replay legacy migrations 001–005. The migration creates admin_accounts with RLS and no client table access, plus self-status and guarded overview RPCs. Roles come from enabled server-owned assignments; client-editable metadata is never authoritative. Overview requests require both an enabled staff assignment and JWT aal2. Disabling an assignment denies subsequent requests without waiting for a token refresh.

No account is granted admin access by the migration. The product owner must identify the exact private staff email, and the resolved Auth user UUID must be verified before assignment. Never embed passwords, MFA codes, service-role keys or the owner's private email in this public repository. For new identities, use a secure invitation/credential-setup flow; the account holder sets their own password and enrolls their own authenticator privately.

## Validation

Thirteen scoped tests pass locally: database tests exercise the actual admin migration in isolated PostgreSQL/PGlite, and React tests cover restricted staff status, MFA gating, real-data rendering, sign-out clearing and generic recovery responses. The production build passes. These are not hosted Auth, SMTP or end-to-end deployment results.

## Before activation

1. Reinspect live schema, grants and functions. Preserve the pre-change metadata and verify recovery for any existing objects that could be affected. This migration does not modify existing member tables or records.
2. Obtain approval to apply this exact additive migration to HerSpace-RDGI. The additive migration and the explicitly approved verified-owner assignment have now been applied. No other account was assigned.
3. Identify the authorised email and corresponding verified Supabase Auth user. Obtain approval for that exact staff assignment. Invite/set credentials securely if necessary. Configure the exact recovery callback https://rdgi-tech-solutions.vercel.app/admin/login; keep email verification enabled.
4. Deploy a protected preview, and have the account holder privately verify sign-in, authenticator pairing, sign-out and recovery. API-test that a normal member and staff at aal1 cannot read the overview. Re-run security advisors.
5. Obtain production deployment approval before merging/publishing. Keep all other incomplete member functionality clearly outside any production-ready handover claim.

## Rollback

If deployment fails, restore the previous frontend deployment while keeping the admin endpoint inaccessible. For immediate access revocation, disable the exact admin_accounts assignment through the approved server-side channel. Revoke authenticated EXECUTE on public.herspace_admin_overview and public.herspace_staff_status if the new portal must be fully disabled. Preserve staff rows and member records. Destructive removal is unnecessary and requires separate approval. The previous public demo PIN must not be treated as secure administration.

## Remaining handover blockers

The intended owner email was supplied privately, and its Auth identity was email-verified before the approved staff assignment. The additive migration and staff assignment are applied. Redirect allowlisting, actual hosted sign-in/MFA/recovery tests and production frontend deployment remain pending. Lost-authenticator support requires verified owner assistance; no automatic bypass is implemented. Other member-side mock authentication, memberships, booking/calling/payment simulations predate this focused admin change and remain outside its scope; draft PR #1 tracks the broader integration work.

## Initial invitation path

Use the approved /admin/setup callback for the first private invitation. A verified invited account may set only its own password before assignment. This screen does not grant an admin role and does not load the overview. The server-owned assignment is still required before authenticator setup and access to the staff dashboard. No intended owner email is committed to this repository.

## Verified backend activation checkpoint

After explicit product-owner approval, the admin migration was applied to the inspected HerSpace-RDGI project and the verified intended owner account was enabled. Privileged SQL tests using role/claim emulation passed: anonymous RPC execution denied, authenticated clients cannot read/write admin_accounts, an unassigned identity with forged user metadata was denied, assigned staff at aal1 were denied overview access, and assigned staff at aal2 received the real overview. This validates the database authorization path, not a real browser password login or authenticator enrollment. No password, session token, owner email or owner UUID is committed here.

Security advisors report the intentional RLS/no-client-policy status of admin_accounts. Previously existing warnings about public.rls_auto_enable execution privileges and leaked-password protection remain outside this approved migration. Review them before a full production release: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable and https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
