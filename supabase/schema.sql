create table if not exists public.events (
  id text primary key,
  organizer_id text not null,
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

alter table public.events enable row level security;

drop policy if exists "Anyone can read events" on public.events;
create policy "Anyone can read events"
  on public.events for select
  using (true);

insert into public.events (
  id, organizer_id, title, description, category, tags, start_datetime,
  end_datetime, timezone, location, cover_image, gallery_images, status,
  visibility, capacity, created_at, updated_at
) values
(
  'evt_001', 'usr_001', 'Phnom Penh Jazz Night',
  'An evening of live jazz featuring local and international artists.',
  'music', array['jazz', 'live-music', 'concert'], '2026-10-10T19:00:00+07:00',
  '2026-10-10T23:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Street 240, Daun Penh, Phnom Penh","lat":11.5625,"lng":104.9282}',
  'https://picsum.photos/seed/jazz/1200/600',
  array['https://picsum.photos/seed/jazz-1/800/600', 'https://picsum.photos/seed/jazz-2/800/600'],
  'published', 'public', 200, '2026-09-01T09:00:00Z', '2026-09-10T12:30:00Z'
),
(
  'evt_002', 'usr_002', 'Frontend Dev Meetup',
  'Monthly online meetup for frontend developers to share talks and demos.',
  'tech', array['react', 'typescript', 'meetup'], '2026-10-15T18:30:00+07:00',
  '2026-10-15T21:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"online","meeting_link":"https://meet.google.com/abc-defg-hij"}',
  'https://picsum.photos/seed/meetup/1200/600', '{}',
  'published', 'invite-only', 100, '2026-09-05T08:15:00Z', '2026-09-05T08:15:00Z'
),
(
  'evt_003', 'usr_003', 'Khmer Classical Dance Showcase',
  'A performance of traditional Apsara dance followed by a gallery walk of local artists.',
  'cultural and arts', array['dance', 'apsara', 'art-exhibition'], '2026-10-24T17:00:00+07:00',
  '2026-10-24T20:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Chaktomuk Theatre, Sisowath Quay, Phnom Penh","lat":11.5732,"lng":104.9321}',
  'https://picsum.photos/seed/apsara/1200/600',
  array['https://picsum.photos/seed/apsara-1/800/600', 'https://picsum.photos/seed/apsara-2/800/600', 'https://picsum.photos/seed/apsara-3/800/600'],
  'published', 'public', 300, '2026-09-08T11:00:00Z', '2026-09-12T09:20:00Z'
),
(
  'evt_004', 'usr_001', 'Rooftop DJ Sessions',
  'Sunset-to-midnight DJ sets with city views and a curated cocktail menu.',
  'nightlife', array['dj', 'rooftop', 'party'], '2026-11-07T18:00:00+07:00',
  '2026-11-08T00:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Street 51, BKK1, Phnom Penh","lat":11.5541,"lng":104.9215}',
  'https://picsum.photos/seed/rooftop/1200/600',
  array['https://picsum.photos/seed/rooftop-1/800/600'],
  'draft', 'private', 150, '2026-09-15T10:00:00Z', '2026-09-18T16:45:00Z'
),
(
  'evt_005', 'usr_004', 'Street Food Festival',
  'Taste dishes from over 30 local vendors, with cooking demos and live music.',
  'food and drink', array['street-food', 'festival', 'local-cuisine'], '2026-11-14T16:00:00+07:00',
  '2026-11-14T22:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Koh Pich (Diamond Island), Phnom Penh","lat":11.5488,"lng":104.9391}',
  'https://picsum.photos/seed/streetfood/1200/600',
  array['https://picsum.photos/seed/streetfood-1/800/600', 'https://picsum.photos/seed/streetfood-2/800/600'],
  'cancelled', 'public', 1000, '2026-08-20T07:30:00Z', '2026-09-17T14:00:00Z'
),
(
  'evt_006', 'usr_005', 'Riverside Clean-Up Day',
  'Join neighbours to clean up the riverside, with breakfast provided for volunteers.',
  'community', array['volunteering', 'environment', 'outdoor'], '2026-08-30T06:30:00+07:00',
  '2026-08-30T10:00:00+07:00', 'Asia/Phnom_Penh',
  '{"type":"physical","address":"Sisowath Quay, Phnom Penh","lat":11.5696,"lng":104.9318}',
  'https://picsum.photos/seed/cleanup/1200/600',
  array['https://picsum.photos/seed/cleanup-1/800/600', 'https://picsum.photos/seed/cleanup-2/800/600'],
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
