# HerSpace member access repair

## Root cause

Vercel production and the supplied ZIP both identify commit
`c5edbd85125e96af51e49924073a6403489ef02d` (“Harden HerSpace walkthrough before handover”).
In that commit, `src/views/OnboardingViews.tsx:13–18` unconditionally rendered the
Member Access notice and the Return to home button. Line 253 assigned the same
component to sign-in. The dormant `src/components/HeroAuthCard.tsx:10` repeated the
message. None of those code paths attempted authentication.

The commit removed a walkthrough that could set a signed-in identity in browser
storage without verifying an account on the server. The project also contains an
older `js/` OTP and email-auth implementation, but `index.html` loads the React
entry point at `src/main.tsx`. The old browser identities are independent of
Supabase Auth accounts. Existing Supabase users should sign in with their registered
email, or use recovery if needed. Someone who only used the previous walkthrough
can register a verified account.

HerSpace is a React and TypeScript single-page app built with Vite. It shares a
Supabase Auth client with the staff portal. A read-only inspection of the live
Supabase schema confirmed the member tables are `member_profiles` and
`member_entitlements`, both with row-level security and own-row read policies.
The profile also has an own-row insert policy. The legacy `member_identity`,
`member_entitlement`, `member_onboarding` and `claim_first_trial` in older
repository migrations are absent from this deployment. Those migrations should
not be applied as part of this repair. Vercel shows a Ready deployment and the
Vite framework preset. This identifies the source regression independently of
email delivery, callback settings, or credentials.

## Changed files

| File | Purpose |
|---|---|
| `src/App.tsx` | Connects member routes to the account forms and the existing protected views. Localizes the progress header. |
| `src/views/MemberAccessView.tsx` | Adds bilingual registration, sign-in, profile completion, verification and password recovery screens. Uses generic errors for duplicates and invalid credentials. |
| `src/context/useMemberSession.ts` | Observes Supabase authentication events, verifies the account with Auth, and loads profile and benefits before admitting a member to protected screens. |
| `src/services/member.ts` | Reads the authenticated member’s profile and entitlements, validates age and eligibility, and inserts a missing profile under the verified Auth UUID. |
| `src/services/auth.ts` | Uses the existing Supabase project and supports an explicit public configuration pair. Uses an in-memory session for the member reset callback. |
| `src/context/AppContext.tsx` | Guards member routes, tracks onboarding completion, signs out with Supabase, and clears private in-memory state on account changes. Removes unused client billing simulation. |
| `src/views/OnboardingViews.tsx` | Removes the placeholder, keeps tour, membership and service selection, and displays benefits from Supabase when present. |
| `src/views/PersonalSpaceView.tsx` | Shows trial days only when the member has a current server-recorded trial. |
| `src/components/BookingModal.tsx` | Keeps the existing booking interface available to browse. Submission reports service unavailability because this deployment has no real booking backend. |
| `src/components/Header.tsx` and `src/components/HeroAuthCard.tsx` | Connect navigation and logout to the restored member flow. |
| `src/types/index.ts` | Represents missing age and eligibility on legacy profiles without inventing values. |
| `src/vite-env.d.ts` and `.env.example` | Document `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the active React client. |
| `tests/auth-member-access.test.tsx` and `tests/auth-security-handover.test.tsx` | Test the restored flow and retain coverage against trusting legacy local identity, OTP and telephony bypasses. |

The existing account database and staff security configuration were inspected
read-only. Signup uses email and password with Supabase and completes the profile
after verification. Phone OTP remains disabled. Authenticated users can enter
the existing Personal Space, dashboard and optional My Cycle screens. Local
onboarding completion is stored per authenticated UUID in the current browser.
An existing completion timestamp from Supabase is honored on any device. The
live schema grants profile insert and select to members and currently has no
profile update grant. New completion is therefore device-specific. No trial,
complimentary session, or payment is created client-side. The live project has
no appointments table for member bookings.

## Redeploy to the existing Vercel project

1. Extract the ZIP. In the existing GitHub checkout, create a branch from
   `main`. Copy the contents of the extracted `RDGI-Tech-Solutions-main` folder
   into the checkout root. Keep the existing repository and remote.
2. From that root, run `npm ci`, `npm run lint`, `npm run test:auth` and
   `npm run build`. The project builds to `dist`.
3. In [Vercel](https://vercel.com/), open the existing `rdgi-tech-solutions`
   project. Use the **Vite** preset, the repository root, `npm run build` as
   the build command, and `dist` as the output directory. The existing Vercel
   project reports Node 26.x. The local checks used Node 24.22.1. Keep the
   existing SPA rewrite in `vercel.json` so direct member and admin callbacks
   are served by the React app.
4. In **Project Settings → Environment Variables**, check the pair
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Preview and
   Production. Use the URL and the public publishable key from the same existing
   HerSpace-RDGI project. The shipped production configuration and built-in
   fallback target that project. Vercel exposed the names
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production, but did not
   list a Production override for `VITE_SUPABASE_PUBLISHABLE_KEY`. The active
   React client reads the publishable-key name. Never put a service-role or
   secret key in a `VITE_` variable.
5. In [Supabase](https://supabase.com/dashboard), open HerSpace-RDGI. Under
   **Authentication → URL Configuration**, verify the Site URL is
   `https://rdgi-tech-solutions.vercel.app` and add these exact Redirect URLs
   while retaining the existing staff entries.
   - `https://rdgi-tech-solutions.vercel.app/member/confirm`
   - `https://rdgi-tech-solutions.vercel.app/member/reset`
   Verify the Email provider and member sign-ups are enabled, email confirmation
   is required, and confirmation and recovery emails use the provider-generated
   link and working SMTP delivery.
6. Commit and push the branch to GitHub. Open the resulting Vercel Preview.
   For email testing, add that Preview's exact `/member/confirm` and
   `/member/reset` URLs to Supabase before sending email. Use a designated test
   mailbox to exercise verification, login, dashboard, refresh, logout and reset.
   Verify the staff sign-in and MFA path with an authorized staff user.
7. Merge to the connected production branch after the Preview checks pass.
   In Vercel, confirm the resulting Production deployment is Ready and the
   production domain points to it. Repeat the member smoke test with a designated
   account. If necessary, roll back the Vercel deployment to the prior build.

References are [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
and [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).

## Verification

| Check | Result |
|---|---|
| Dependency install, TypeScript and Vite production build | Passed. Existing Vite configuration, CSS import ordering, and bundle size warnings were reported. |
| Local startup and callback routing | Vite on loopback and the standalone production build server returned HTTP 200 for the homepage, member callbacks, and staff sign-in. The standalone OTP and telephony routes returned their expected 410 and 503 responses. |
| Current automated auth suite | 24 tests passed. The new React tests use simulated Supabase responses for signup, duplicate handling, verification, eligibility, sign-in, bad credentials, recovery, session restoration, protected dashboard, logout, English/Tamil switching, and the four onboarding steps. The existing staff authorization tests also passed. |
| Chromium against the local production bundle | Passed with Supabase HTTP responses intercepted. Exercised the actual browser SDK and request paths for signup, confirmation callback, profile read and insert, four onboarding steps, session reload, Tamil switch, invalid and valid sign-in, logout, and recovery. Verified recovery did not write a Supabase session to local storage. |
| Live database and Vercel settings | Read-only schema, row-level security, grants, deployment commit, framework, and environment-variable names checked. |
| Legacy JS test scripts | Three unconfigured legacy scripts fail on the pre-existing `typeof import` syntax in `js/config.js`, a file outside the active React entry point. |
| Hosted member authentication | Requires the redeployed app, working SMTP and a designated real test account. Live email delivery, signup, login, and password change were not exercised. |
| Production deployment | The existing deployment was inspected. This repair was prepared for redeployment and was not published to Vercel. |
