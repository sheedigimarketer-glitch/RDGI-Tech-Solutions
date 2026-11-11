# Clean staging database

For a fresh isolated Supabase project, run `member-schema.sql`, then
`../migrations/20261106190523_admin_portal.sql`. The `001`–`005` SQL files are historical
experiments with different table names and permissive booking writes. Keep them out
of the active provisioning path. The staging baseline is deliberately outside the
migration directory so it cannot be applied automatically to an existing project.

This is a schema-only reconstruction with a restricted insert grant and eligibility
checks. Existing nullable profile fields remain readable. Compare the live ledger,
column grants and policies before designing an additive production migration.
Entitlements are readable by their owner and writable only by trusted roles.
After the member and admin baselines, apply these in order for a staging rehearsal:

1. `issue-member-entitlements.sql`
2. `welcome-session-booking.sql`
3. `member-identity-claims.sql`
4. `welcome-slot-overlap.sql`

The identity migration uses the Supabase `pgcrypto` extension in the `extensions`
schema. Retain the private fingerprint key with database backups. The migration
records current verified identities for existing entitlements. Reconcile any
historical verified identities that changed before applying it in production.

Only trusted operators may publish slots for approved trained human listeners.
Use staging test phones and approved synthetic listener accounts for rehearsals.
