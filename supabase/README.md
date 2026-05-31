# Supabase setup

The app runs without Supabase (catalog falls back to `lib/artworks.ts` seed data).
To enable the real data layer:

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the project URL + anon key + service-role key into `.env.local`
   (see `.env.example` → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`).
3. Apply the schema and seed:

   **Option A — Supabase CLI**
   ```bash
   supabase link --project-ref <ref>
   supabase db push          # applies migrations/0001_init.sql
   psql "$DATABASE_URL" -f supabase/seed.sql
   ```

   **Option B — SQL editor**
   Paste `migrations/0001_init.sql` then `seed.sql` into the dashboard SQL editor.

4. Create a public Storage bucket named `artworks` (or set `SUPABASE_STORAGE_BUCKET`).

Once configured, `isSupabaseConfigured` flips true and repositories read live data.
RLS exposes only `published` artworks to the public anon key; all writes go through
the server-side service-role client (`lib/supabase/admin.ts`).
