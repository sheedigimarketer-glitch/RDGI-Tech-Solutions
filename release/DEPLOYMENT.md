# Auth integration release preparation

This is a review candidate, not a complete platform release. Do not publish it publicly.

## Before any live change

1. Obtain the running frontend origin and hosting platform. Validate that the origin is stable, uses HTTPS and is controlled by the owner.
2. Recheck current schema, table grants, RLS policies and Auth user/mapping requirements. The local baseline was inspected, not a production backup.
3. Verify a recoverable backup/snapshot and export the current schema/grants before applying changes. Use a staging environment where available. New paid services/branches need approval.
4. Verify email confirmation is enabled, email sender/SMTP delivery works for the intended recipients, and the callback URL is explicitly allowlisted. Keep password protection and rate limits enabled.
5. Present the exact changes, impact and rollback to the product owner and obtain approval. No approval was requested or assumed during the preparation checkpoint.

## Exact candidate changes

Apply ONLY supabase/migrations/20261106182331_username_auth.sql to the inspected database after review. Do not run db push against all migrations: original 001–005 describe an incompatible legacy schema and the live migration history is empty. Preserve existing rows. This candidate adds profile.username, account_handles and account_login_limits, two restricted functions, a signup trigger and own-row SELECT policies. It revokes client INSERT access to profiles and leaves entitlements server-managed. Existing profile RLS policies remain, but table privileges limit client access to SELECT.

Deploy username-login with its index.ts and handler.ts and verify_jwt=false. JWT verification must be off only for this pre-authentication function because members have no session yet; the handler itself verifies their password through Supabase Auth. No other endpoint authentication setting is changed. Set HERSPACE_APP_ORIGIN to the exact approved origin with no trailing slash. The function fails closed when absent. Supabase-provided service-role and anon server environment values are read at runtime, not placed in the frontend.

Frontend production configuration contains only the connected project's URL and publishable key. Build with npm ci and npm run build; deploy dist through the approved hosting platform. Do not host the repository root or legacy server.js as a public static directory. Keep all unintegrated bookings/payments/calls out of a public launch.

## Required hosted smoke tests

Use designated test accounts and an approved email recipient (do not use real member medical data): signup, verified email callback, successful username login, incorrect password, duplicate handle, recovery email, password update, old-password failure, sign-out, refresh/reload and expired session. Test user A cannot read B's profile or entitlements through the Data API, and neither member can alter entitlement dates, handles or staff roles. Verify the endpoint does not return an email on failed requests, accepts only the intended browser origin, and rate-limits repeated failures. Check Supabase security advisors after applying the schema. Record observed results and actual release identifiers.

## Rollback approach

Prefer maintenance mode while correcting a failed rollout; do not restore the publicly accessible mock login/admin PIN as a working security system. Disable the new frontend entry points and username-login function while retaining newly created data. If a signup trigger blocks unrelated registration, remove ONLY herspace_member_signup from auth.users after approval and diagnosis. Retain account_handles, account_login_limits and profile.username to avoid losing new identities. Do not delete member/auth rows. If table grants need rollback, restore them from the pre-change snapshot rather than guessing. Deploying new frontend/endpoint code can be reversed by the hosting platform's prior-release mechanism, but that prior source contains demo authentication and must remain inaccessible to public members.

A destructive rollback or account deletion requires separate approval and verified recovery. No rollback has been run.
