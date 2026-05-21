# Project Base

## Tech Stack
- Next.js 15 + TypeScript
- Tailwind CSS + ShadCN UI
- Supabase (database + auth + storage)
- Google OAuth (already configured)
- Formik + Yup (forms)
- Moment.js (dates)
- Sonner (notifications)
- Gemini AI API ready

## Folder Structure
- src/app → pages
- src/components → reusable components
- src/hooks → custom hooks (useAuth.ts ready)
- src/utils → supabase.ts + types.ts ready
- src/db → SQL files

## Already Built
- Google Login
- Header component
- Article CRUD operations
- Image upload to Supabase Storage
- Search with debounce
- Pagination
- Skeleton loaders
- Toast notifications

## Environment Variables Needed
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- GEMINI_API_KEY