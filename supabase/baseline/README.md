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
A verified phone, benefit issuance and redemption are separate launch requirements.
