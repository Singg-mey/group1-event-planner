create table if not exists public.events (
  -- uuid, not text: organizer_id mirrors auth.users.id, and Supabase Auth
  -- issues uuids. A text column here is what produced
  -- "22P02 invalid input syntax for type uuid" on every insert.
  id uuid primary key default gen_random_uuid(),
  -- No foreign key to auth.users(id) on purpose: the seed events are owned by
  -- a placeholder uuid that has no auth user, and demo data should not
  -- require creating one. Ownership is enforced by the RLS policies below.
  organizer_id uuid not null,
  title text not null,
  description text not null,
  category text not null,
  tags text[] not null default '{}',
  start_datetime timestamptz not null,
  end_datetime timestamptz not null,
  timezone text not null,
  location jsonb not null,
  cover_image text not null,
  gallery_images text[] not null default '{}',
  status text not null check (status in ('draft', 'published', 'cancelled', 'completed')),
  visibility text not null check (visibility in ('public', 'private', 'invite-only')),
  capacity integer not null check (capacity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Seed rows are owned by this placeholder until the first real account claims
-- them via claim_seed_events(). It is a uuid because organizer_id is one.
-- Replace 000...001 with your own auth user id before seeding if you prefer.
create table if not exists public.seed_owner (
  id uuid primary key default gen_random_uuid(),
  placeholder_organizer_id uuid not null unique,
  note text not null default 'organizer for bundled seed events'
);

insert into public.seed_owner (placeholder_organizer_id, note)
values ('00000000-0000-0000-0000-000000000001', 'organizer for bundled seed events')
on conflict (placeholder_organizer_id) do nothing;

alter table public.events enable row level security;

drop policy if exists "Anyone can read events" on public.events;
create policy "Anyone can read events"
  on public.events for select
  using (true);

-- Write policies for the create / update / delete operations.
--
-- organizer_id and auth.uid() are both uuid, so these compare like for like
-- and no cast is needed. Casting either side to text is what previously made
-- Postgres try to coerce the column and fail with 22P02.
--
-- (select auth.uid()) is the init-plan form Supabase recommends: the function
-- is resolved once per statement instead of once per row.
drop policy if exists "Anyone can create events" on public.events;
create policy "Organizers can create their own events"
  on public.events for insert
  to authenticated
  with check (organizer_id = (select auth.uid()));

drop policy if exists "Anyone can update events" on public.events;
create policy "Organizers can update their own events"
  on public.events for update
  to authenticated
  using (organizer_id = (select auth.uid()))
  with check (organizer_id = (select auth.uid()));

drop policy if exists "Anyone can delete events" on public.events;
create policy "Organizers can delete their own events"
  on public.events for delete
  to authenticated
  using (organizer_id = (select auth.uid()));

-- Hands the seeded events to the first real account that signs in.
--
-- SECURITY DEFINER runs as the owner (postgres) and so bypasses RLS, which is
-- required here: the ownership policy above only lets a caller touch rows it
-- already owns, and these rows are owned by the placeholder uuid. The function
-- is deliberately narrow - it reassigns only that placeholder, and only for a
-- caller that owns nothing yet, so a second account can never take the data
-- away from the first.
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

  -- Only hand over when the caller owns nothing, so the first account to sign
  -- in keeps the data and later ones cannot take it.
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


-- Seed events.
--
-- Ids are fixed uuids so re-running this is idempotent. Every row is owned by
-- the placeholder organizer, so the first account to sign in claims the lot
-- through claim_seed_events().
--
-- There is deliberately no foreign key from events.organizer_id to
-- auth.users(id): the placeholder has no auth user, and demo data should not
-- require creating one. Ownership is still enforced by the RLS policies above.
insert into public.events (
  id, organizer_id, title, description, category, tags, start_datetime,
  end_datetime, timezone, location, cover_image, gallery_images, status,
  visibility, capacity, created_at, updated_at
) values
(
  '11111111-1111-4111-8111-111111111101', '00000000-0000-0000-0000-000000000001',
  'Phnom Penh Jazz Night',
  'An evening of live jazz featuring local and international artists.',
  'music', array['jazz', 'live-music', 'concert'], '2026-10-10T19:00:00+07:00',
  '2026-10-10T23:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Street 240, Daun Penh, Phnom Penh","lat":11.5625,"lng":104.9282}',
  'https://picsum.photos/seed/jazz/1200/600',
  array['https://picsum.photos/seed/jazz-1/800/600','https://picsum.photos/seed/jazz-2/800/600'],
  'published', 'public', 200, '2026-09-01T09:00:00Z', '2026-09-10T12:30:00Z'
),
(
  '11111111-1111-4111-8111-111111111102', '00000000-0000-0000-0000-000000000001',
  'Frontend Dev Meetup',
  'Monthly online meetup for frontend developers to share talks and demos.',
  'tech', array['react', 'typescript', 'meetup'], '2026-10-15T18:30:00+07:00',
  '2026-10-15T21:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"online","meeting_link":"https://meet.google.com/abc-defg-hij"}',
  'https://picsum.photos/seed/meetup/1200/600', '{}',
  'published', 'invite-only', 100, '2026-09-05T08:15:00Z', '2026-09-05T08:15:00Z'
),
(
  '11111111-1111-4111-8111-111111111103', '00000000-0000-0000-0000-000000000001',
  'Khmer Classical Dance Showcase',
  'A performance of traditional Apsara dance followed by a gallery walk of local artists.',
  'cultural and arts', array['dance', 'apsara', 'art-exhibition'], '2026-10-24T17:00:00+07:00',
  '2026-10-24T20:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Chaktomuk Theatre, Sisowath Quay, Phnom Penh","lat":11.5732,"lng":104.9321}',
  'https://picsum.photos/seed/apsara/1200/600',
  array['https://picsum.photos/seed/apsara-1/800/600','https://picsum.photos/seed/apsara-2/800/600','https://picsum.photos/seed/apsara-3/800/600'],
  'published', 'public', 300, '2026-09-08T11:00:00Z', '2026-09-12T09:20:00Z'
),
(
  '11111111-1111-4111-8111-111111111104', '00000000-0000-0000-0000-000000000001',
  'Rooftop DJ Sessions',
  'Sunset-to-midnight DJ sets with city views and a curated cocktail menu.',
  'nightlife', array['dj', 'rooftop', 'party'], '2026-11-07T18:00:00+07:00',
  '2026-11-08T00:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Street 51, BKK1, Phnom Penh","lat":11.5541,"lng":104.9215}',
  'https://picsum.photos/seed/rooftop/1200/600',
  array['https://picsum.photos/seed/rooftop-1/800/600'],
  'draft', 'private', 150, '2026-09-15T10:00:00Z', '2026-09-18T16:45:00Z'
),
(
  '11111111-1111-4111-8111-111111111105', '00000000-0000-0000-0000-000000000001',
  'Street Food Festival',
  'Taste dishes from over 30 local vendors, with cooking demos and live music.',
  'food and drink', array['street-food', 'festival', 'local-cuisine'], '2026-11-14T16:00:00+07:00',
  '2026-11-14T22:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Koh Pich (Diamond Island), Phnom Penh","lat":11.5488,"lng":104.9391}',
  'https://picsum.photos/seed/streetfood/1200/600',
  array['https://picsum.photos/seed/streetfood-1/800/600','https://picsum.photos/seed/streetfood-2/800/600'],
  'cancelled', 'public', 1000, '2026-08-20T07:30:00Z', '2026-09-17T14:00:00Z'
),
(
  '11111111-1111-4111-8111-111111111106', '00000000-0000-0000-0000-000000000001',
  'Riverside Clean-Up Day',
  'Join neighbours to clean up the riverside, with breakfast provided for volunteers.',
  'community', array['volunteering', 'environment', 'outdoor'], '2026-08-30T06:30:00+07:00',
  '2026-08-30T10:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Sisowath Quay, Phnom Penh","lat":11.5696,"lng":104.9318}',
  'https://picsum.photos/seed/cleanup/1200/600',
  array['https://picsum.photos/seed/cleanup-1/800/600','https://picsum.photos/seed/cleanup-2/800/600'],
  'completed', 'public', 80, '2026-08-01T08:00:00Z', '2026-08-31T09:00:00Z'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  tags = excluded.tags,
  start_datetime = excluded.start_datetime,
  end_datetime = excluded.end_datetime,
  timezone = excluded.timezone,
  location = excluded.location,
  cover_image = excluded.cover_image,
  gallery_images = excluded.gallery_images,
  status = excluded.status,
  visibility = excluded.visibility,
  capacity = excluded.capacity,
  updated_at = excluded.updated_at;
