# Kodeva Supabase files

Project cloud: `kodeva-skill-test` (`qlvxeueqaolbhtktrldl`), Singapore. The hosted project already has the schema and grants from `migrations/20261013000000_initial_leads.sql`, applied through the Supabase SQL Editor.

## Files

- `config.toml`: Supabase CLI project and local seed configuration.
- `migrations/20261013000000_initial_leads.sql`: tables, constraints, indexes, RLS policies, and role grants.
- `seed.sql`: fake leads for local development only. Do not execute it against the hosted project.
- `../.env.example`: app environment variable names and safe placeholders. Copy it to the Next.js app as `.env.local` and fill the missing keys locally.

## Start local Supabase

Copy this `supabase/` directory into the root of the Next.js repository, install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started), then run:

```sh
supabase start
supabase db reset
```

`db reset` recreates the local schema from migrations and inserts the local-only sample leads. The local CLI requires Docker. Use the CLI-generated local URL and publishable key in `.env.local` when testing against the local stack.

## Connect the hosted project

From the app repository, link the existing project and enter the database password only into the CLI prompt:

```sh
supabase link --project-ref qlvxeueqaolbhtktrldl
```

Do not put that password in chat, this folder, or a committed environment file.

The initial migration was executed manually in the hosted SQL Editor, so first check its history:

```sh
supabase migration list --linked
```

If `20261013000000` is missing from the remote migration history while the schema is present, record it as applied before using `db push`:

```sh
supabase migration repair 20261013000000 --status applied --linked
supabase migration list --linked
```

That command changes migration history only. It does not execute the SQL. After this baseline is synchronized, make future schema changes through new migration files and review them before applying them to the hosted project. Do not run `seed.sql` against the hosted project.

## App key handling

The publishable key can be used by the browser with RLS. `SUPABASE_SECRET_KEY` is server-only and is reserved for the validated lead submission handler; never expose it to browser code or commit it. The app uses Supabase URL and API keys, so the database password is not needed by normal Next.js runtime code.
