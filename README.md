# React + TypeScript + Vite + shadcn/ui

## Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates and seeds the `events` table from [`public/events.ts`](public/events.ts).
3. Copy [`.env.example`](.env.example) to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project settings.
4. Start the app with `npm run dev`.

When the environment variables are missing, the app uses the existing local event fixtures. Once configured, the home page and event detail routes load from Supabase.

## Event CRUD

Full create / read / update / delete is implemented for events.

| Operation | Where                                          | How                                                                     |
| --------- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| Create    | `/create-event`, or the **Create Event** nav   | `EventForm` in `mode="create"`, with *Save draft* and *Publish* actions  |
| Read      | Home grid, `/find-event`, `/events/:id`        | `useEvents()` → `getEvents()` / `getEventById()`                        |
| Update    | `/events/:id/edit`, or the **Edit** buttons    | `EventForm` in `mode="edit"` → `updateEvent(id, values)`                |
| Delete    | **My Events** (`/my-events`) and event detail  | Confirmation dialog → `deleteEvent(id)`                                 |

### Layers

```
components/  UI only. No component talks to Supabase or localStorage directly.
   ↓
hooks/       useEvents() — read state + create/update/delete actions
   ↓
data/        events-repository.ts — the only file that knows the data source
   ↓
lib/         event-form.ts (validation + form<->record mapping), event-format.ts
```

- `data/events-repository.ts` picks the backend at call time: Supabase when
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set, otherwise
  `data/local-events-store.ts` (localStorage, seeded from `src/data/events.ts`).
- After a successful write the repository broadcasts an `eventplanner_events_changed`
  window event, and every mounted `useEvents()` refetches. That keeps the home
  grid, Find Events, and My Events in step no matter where the write happened.
  Same pattern as `user-profile-updated` in `data/user.ts`.
- Only the signed-in profile's own events expose Edit / Delete
  (`canManageEvent()`). The demo profile is `usr_001`, which owns the
  *Phnom Penh Jazz Night* and *Rooftop DJ Sessions* fixtures.

### Routes

| Path                | Page               |
| ------------------- | ------------------ |
| `/create-event`     | `CreateEventPage`  |
| `/my-events`        | `MyEventsPage`     |
| `/events/:id`       | `EventDetailPage`  |
| `/events/:id/edit`  | `EditEventPage`    |

### Validation

`lib/event-form.ts` validates on submit: title ≥ 3 chars, description ≥ 10,
date and start time required, end time after start, address or meeting link
depending on location type, capacity a whole number ≥ 1, and any cover image /
meeting link must be an `http(s)` URL. Errors render per field via
`FieldError`, and the first submit reports which fields need attention.

### Supabase writes

`supabase/schema.sql` ships the insert / update / delete policies the CRUD
operations need. They are intentionally permissive because there is no auth
yet — tighten them to `auth.uid()::text = organizer_id` before using real data.

### Verifying

```bash
npm run dev        # http://localhost:5173
npm run typecheck  # tsc
npm run lint
npm run test:crud  # data-layer + validation checks (scripts/crud-harness.ts)
npm run build
```

Local writes persist in localStorage under `eventplanner_events`. Clear that
key to restore the bundled fixtures.

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
