# Tales & Choices

Interactive Hebrew storytelling app for toddlers (ages 3-5). Sign in with Google, create a hero, and make choices that shape the story — powered by Gemini.

## Dev

```bash
cp .env.example .env  # fill in values
npm install
npm run dev
```

## Env vars

| Var | Where to get it |
|-----|----------------|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth app |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API |
| `GEMINI_API_KEY` | aistudio.google.com |

## Supabase setup

Run in SQL Editor:

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  hero_name TEXT NOT NULL,
  hero_gender TEXT NOT NULL,
  companion_names TEXT[],
  setting TEXT,
  rolling_summary TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id),
  chapter_number INTEGER,
  content TEXT NOT NULL,
  choice_made TEXT,
  option_a TEXT,
  option_b TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deploy (Vercel)

Add all env vars. Update `NEXTAUTH_URL` to your Vercel domain. Add Vercel redirect URI to Google OAuth app.
