# CS Society Clone

The CS Society official website built with Next.js, TailwindCSS, and Supabase.

## Quick Start

```bash
./start.sh
```

The application will be available at `http://localhost:3000` (or the next available port).

## Setup

For detailed setup instructions including Supabase configuration, see [SETUP.md](./SETUP.md).

## Features

### Public Pages
- ✅ **Home page** - Hero section with animated gradient background, features grid, and call-to-action
- ✅ **Events page** - Upcoming events listing with RSVP buttons, fetched from Supabase
- ✅ **Projects page** - Student project showcase with images, tags, and GitHub links

### Authentication
- ✅ **OAuth sign-in** - Google and GitHub authentication via Supabase Auth
- ✅ **Session management** - Persistent sessions with automatic refresh via middleware
- ✅ **User profiles** - Automatic profile creation on signup with avatar support

### Admin Features
- ✅ **Admin dashboard** - Protected admin area for content management
- ✅ **Event creation** - Admins can create new events (Workshop, Study Jam, Tech Talk, etc.)
- ✅ **Role-based access** - Middleware protection for admin routes

### Technical Features
- ✅ **Responsive design** - Mobile-friendly layouts with TailwindCSS
- ✅ **Supabase integration** - Database with Row Level Security (RLS) policies
- ✅ **Mock data fallback** - Works without Supabase configuration
- ✅ **Next.js 16 App Router** - Server and client components
- ✅ **TypeScript** - Full type safety throughout

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: TailwindCSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (OAuth providers)
- **Language**: TypeScript
- **UI**: React 19
- **Hosting**: Ready for Vercel deployment

## Project Structure

```
cs_society_clone/
├── app/
│   ├── admin/events/       # Admin event creation page
│   ├── auth/callback/      # OAuth callback handler
│   ├── events/             # Public events page
│   ├── login/              # Login page with OAuth buttons
│   ├── projects/           # Public projects page
│   ├── layout.tsx          # Root layout with AuthProvider
│   └── page.tsx            # Home page
├── components/
│   ├── Navigation.tsx      # Header with auth state & admin link
│   └── Footer.tsx          # Footer component
├── lib/
│   ├── auth-context.tsx    # React context for auth state
│   ├── supabase.ts         # Browser Supabase client
│   └── supabase-server.ts  # Server Supabase client
├── middleware.ts           # Session refresh & admin route protection
└── supabase/
    └── schema.sql          # Database schema, RLS policies & seed data
```

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run ESLint
```

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Notes

- The application uses mock data when Supabase is not configured
- All images are from Unsplash
- Navigation includes placeholder links for Forum, Learning, and Store pages (not yet implemented)
- To make a user an admin, run: `UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';`
