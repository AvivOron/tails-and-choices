# Tales & Choices — Agent Guide

Next.js 14+ App Router, TypeScript, Tailwind, RTL Hebrew.

## Stack
- Auth: NextAuth (Google) — `lib/auth.ts`
- DB: Supabase JS client — `lib/supabase.ts`, types in `types/database.ts`
- LLM: Gemini 2.5 Flash Lite — `lib/gemini.ts`
- UI: framer-motion, lucide-react, Heebo font

## Key conventions
- All pages are `'use client'` — auth via `useSession()`
- API routes use `getServerSession` + `createServiceClient()` (service role)
- `dir="rtl"` on `<html>`, all story text uses `direction: 'rtl'`
- `basePath: '/tales-and-choices'` set in `next.config.ts`

## Routes
- `/` landing (redirects to /library if authed)
- `/create` character creator
- `/story/[id]` story loop
- `/story/[id]/read` reader mode
- `/library` story list
- `POST /api/stories` create story + chapter 1
- `POST /api/stories/[id]/chapters` next chapter from choice
- `GET/DELETE /api/stories/[id]` get or delete story

## DB tables
`stories`: id, user_id, hero_name, hero_gender, companion_names[], setting, rolling_summary, is_active, created_at
`chapters`: id, story_id, chapter_number, content, choice_made, option_a, option_b, created_at
