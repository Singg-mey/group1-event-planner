# React + TypeScript + Vite + shadcn/ui

## Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates and seeds the `events` table from [`public/events.ts`](public/events.ts).
3. Copy [`.env.example`](.env.example) to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project settings.
4. Start the app with `npm run dev`.

When the environment variables are missing, the app uses the existing local event fixtures. Once configured, the home page and event detail routes load from Supabase.

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
