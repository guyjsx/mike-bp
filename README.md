# Bachelor Party Planner

A Next.js web application for managing a bachelor party weekend. Features include schedule management, golf pairings, room assignments, and expense tracking.

## Setup Instructions

### 1. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Once created, go to Settings → API to find your project URL and anon key
3. Run the SQL migrations:
   - Go to SQL Editor in Supabase
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the migration
   - (Optional) Run `supabase/seed.sql` for test data

### 2. Configure Environment Variables

1. Copy the `.env.local` file and update with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Update the event details and passwords as needed

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Default Passwords

- **Attendee Access**: bach2024
- **Admin Access**: adminbach2024

## Features

- **Authentication**: Two-tier password system (attendee/admin)
- **Dashboard**: Countdown timer, quick stats, upcoming events
- **Schedule**: View all events by day
- **Golf**: Tee times and pairings
- **Accommodations**: Room assignments
- **Expenses**: Track and split costs
- **People**: Attendee directory
- **Admin**: Full CRUD capabilities for all data

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- React