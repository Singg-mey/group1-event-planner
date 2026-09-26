-- Brings the live database in line with src/lib/event-form.ts and the app.
--
-- Fixes "22P02 invalid input syntax for type uuid".
--
-- Cause: events.id / events.organizer_id are uuid columns (Supabase Auth
-- issues uuids), but a policy compared organizer_id to auth.uid() with a ::text
-- cast, or an insert supplied a non-uuid id. Postgres then tried to coerce the
-- value and refused the statement.
--
-- Safe to run more than once.

-- 1. Drop every policy on events, whatever it is named. A previous fix only
--    dropped policies by known name, so a renamed or hand-written policy could
--    survive and keep coercing.
do $$
declare
  policy_name text;
begin
  for policy_name in
    select policyname from pg_policies
     where schemaname = 'public' and tablename = 'events'
  loop
    execute format('drop policy if exists %I on public.events', policy_name);
  end loop;
end $$;

-- 2. Ownership policies. Both sides are uuid, so they compare like for like and
--    no cast is involved. Casting organizer_id to text is what broke inserts.
--
--    (select auth.uid()) is the init-plan form Supabase recommends: resolved
--    once per statement rather than once per row.
create policy "Anyone can read events"
  on public.events for select
  using (true);

create policy "Organizers can create their own events"
  on public.events for insert
  to authenticated
  with check (organizer_id = (select auth.uid()));

create policy "Organizers can update their own events"
  on public.events for update
  to authenticated
  using (organizer_id = (select auth.uid()))
  with check (organizer_id = (select auth.uid()));

create policy "Organizers can delete their own events"
  on public.events for delete
  to authenticated
  using (organizer_id = (select auth.uid()));

-- 3. The placeholder owner for bundled seed events, so a fresh seed can own
--    rows without a real auth user behind it.
create table if not exists public.seed_owner (
  id uuid primary key default gen_random_uuid(),
  placeholder_organizer_id uuid not null unique,
  note text not null default 'organizer for bundled seed events'
);

insert into public.seed_owner (placeholder_organizer_id, note)
values ('00000000-0000-0000-0000-000000000001', 'organizer for bundled seed events')
on conflict (placeholder_organizer_id) do nothing;

-- 4. Hands the seeded events to the first real account that signs in.
--
--    SECURITY DEFINER bypasses RLS, which is required here: the ownership
--    policy only lets a caller touch rows it already owns, and these rows are
--    owned by the placeholder. Narrow on purpose - only that placeholder, and
--    only for a caller that owns nothing yet, so a second account can never
--    take the data away from the first.
create or replace function public.claim_seed_events()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed integer;
  placeholder uuid;
begin
  select placeholder_organizer_id into placeholder
    from public.seed_owner
   limit 1;

  if placeholder is null then
    return 0;
  end if;

  if exists (
    select 1 from public.events where organizer_id = (select auth.uid())
  ) then
    return 0;
  end if;

  update public.events
     set organizer_id = (select auth.uid())
   where organizer_id = placeholder;

  get diagnostics claimed = row_count;
  return claimed;
end;
$$;

revoke all on function public.claim_seed_events() from public;
grant execute on function public.claim_seed_events() to authenticated;

-- 5. Verify.
--
--    a) Column types. Both must say uuid.
--
-- select column_name, data_type
--   from information_schema.columns
--  where table_schema = 'public' and table_name = 'events'
--    and column_name in ('id', 'organizer_id');
--
--    b) No policy still casts organizer_id to text. Should return zero rows.
--
-- select policyname, cmd, qual, with_check
--   from pg_policies
--  where tablename = 'events'
--    and (coalesce(qual, '') || ' ' || coalesce(with_check, ''))
--        like '%auth.uid()%::text%';
--
--    c) Rows still sitting with the placeholder owner. Expected until the
--       first account claims them; should go to zero afterwards.
--
-- select id, title from public.events
--  where organizer_id = '00000000-0000-0000-0000-000000000001';
