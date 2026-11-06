# HerSpace integration checkpoint — username/password authentication

Status: IMPLEMENTED AND LOCALLY TESTED; NOT DEPLOYED; NOT READY FOR PUBLIC RELEASE.

## Confirmed decisions

- Member login uses a username and password.
- Registration requires a private recovery email.
- Membership free trial is 7 days, confirmed by the product owner on 7 November 2026 (IST). This supersedes the earlier 3-month trial.
- The email is not returned by the public username-login endpoint or put in a public directory.
- Email confirmation must remain enabled in Supabase; verify the actual project setting before release.
- Source audit used the uploaded RDGI-Tech-Solutions-main.zip. Connected backend: HerSpace-RDGI, ref tzbkjvvkhxxobqsbtsdq.

## Actual findings

The active entry point is index.html → src/main.tsx → React AppProvider. The old js/ implementation is not the active React backend. Its tests/migrations must not be mistaken for verification of the active app. The original React login accepted a handle without checking a password, generated OTP locally, and trusted browser-stored users/entitlements. The inspected live database has member_profiles and member_entitlements, both with RLS, zero rows at inspection; migration history is empty. These names differ from the legacy migration files in the ZIP. No live schema, Auth configuration, secrets, users or deployments were changed during this checkpoint.

## Task register and integration matrix

| Feature | Frontend/backend evidence | Status | Remaining work |
|---|---|---|---|
| Registration | New private-email form, Supabase signUp, server trigger prepared | IMPLEMENTED / LOCALLY TESTED | Approve/apply migration; verify email confirmation and delivery using designated test accounts |
| Username/password sign-in | Server-only username lookup + password authentication + session installation | IMPLEMENTED / LOCALLY TESTED | Set exact app origin; deploy Edge Function with approval; live smoke tests |
| Recovery | Private email reset request + recovery event + password update form | IMPLEMENTED / LOCALLY TESTED (request/form) | Real delivery, callback and password update end-to-end test |
| Session trust | Auth events + getUser verification; no authentication from legacy localStorage objects | LOCALLY TESTED | Live token expiry/recovery/device tests |
| Profiles | Own profile read from member_profiles | IMPLEMENTED / LOCALLY TESTED (database access boundary) | Profile editing; server-persisted onboarding progress |
| Membership | Read-only server entitlements; browser payment simulation disabled | PARTIAL | Reconcile pricing text; real payment webhook/mandate handling; abuse and repeat-trial policy |
| Trial | Product owner confirmed 7 days; trigger creates a 7-day membership trial and a separate 7-day welcome-call expiry | IMPLEMENTED / LOCALLY TESTED | Hosted verification pending; the initial 60-day paid offer still requires confirmation |
| Bookings | Still browser state + static professionals/slots | NOT INTEGRATED | Real availability, atomic reservations, complimentary-use consumption, rescheduling/no-show rules and RLS |
| Professionals | Static directory and local applications | NOT INTEGRATED | Documents, protected uploads, verification and server-owned roles |
| Admin | Browser PIN route disabled | BLOCKED FOR PUBLIC USE | Staff authentication, server-owned RBAC and audited administration |
| Calls | Existing simulated call state and legacy Node gateway | NOT INTEGRATED | Approved provider account, real call authorization, callback verification and billing |
| Notifications | Existing local notification content | NOT INTEGRATED | Approved WhatsApp/email provider; durable jobs; delivery verification |
| Cycle data | Existing device storage implementation retained | REQUIRES REVIEW | Account isolation, recovery, export/deletion and encryption-key audit before public use |
| Audio/content | Existing assets/static data | REQUIRES REVIEW | Licensing, publication and professional review checks |
| Deployment | Vite static build and Vercel rewrite file found | BLOCKED | Actual hosting/preview URL and authorized release path |

## Local verification

Use npm ci, npm run test:auth, npm run build. Test report: 27 tests across service, React forms, session races, HTTP handler and isolated PostgreSQL/PGlite database tests. These are not live Supabase end-to-end tests. Service/HTTP tests mock upstream calls. Database tests execute the actual new migration on an isolated baseline representing the inspected two tables; this does not reproduce hosted Auth delivery, infrastructure or all production behavior. The new Edge entry point was checked with Deno. The build has a bundle-size warning. npm audit reported no known vulnerabilities at inspection; this is not a complete security audit.

## Changed areas

- src/services/auth.ts: real Supabase Auth client, validation, signup/login, recovery and profile/entitlement retrieval.
- src/components/HeroAuthCard.tsx: required private email, strong password, age/eligibility/consent and recovery form.
- src/components/PasswordRecovery.tsx: recovery password update.
- src/context/AppContext.tsx: verified sessions, invalid demo paths disabled, stale async result protection, disabled simulated paid membership changes.
- src/App.tsx: shared account forms, recovery route, disabled client-PIN admin view.
- src/components/PolicyModal.tsx: explanation of private recovery-email usage.
- supabase/functions/username-login/: endpoint and testable HTTP handler. Service-role access is server-only. Session tokens are returned only after password and email-confirmation checks.
- supabase/migrations/20261106182331_username_auth.sql: additive username column and protected mapping/throttle tables; trigger-created profiles/entitlements; owner-only read policies; no client entitlement writes.
- .env.production contains only public Supabase URL and publishable key. No service-role secret is included.
- package.json/package-lock.json: pinned Supabase SDK and test dependencies. npm is the validated package manager; original bun.lock is historical and not updated.
- Build/test configuration uses .mts, removing the CommonJS config warning. Duplicate late font import removed; same font remains linked in index.html.

## Release-blocking caveats

No real email was sent in testing, and no production account was created. Confirm the paid pricing rules, SMTP setup, redirect URL allowlist and exact frontend origin before a live auth test. Configure platform-level signup and IP abuse protection; the prepared endpoint currently has an atomic per-handle throttle only, which can lock a targeted username and does not replace perimeter protections. Existing Auth users without username mappings are not migrated automatically. Check whether any such accounts need onboarding. Recovery emails must remain private, but this does not make accounts anonymous to the service operator. No public launch until remaining critical workflows and recovery/security tests pass.

## Next input needed

The actual HerSpace running website/preview URL and hosting platform. The AI Studio editor URL is not the application origin. With that identified, prepare exact redirect/origin changes and present the live migration/function deployment for approval.
