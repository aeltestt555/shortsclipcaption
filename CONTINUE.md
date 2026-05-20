# ClipCaption — Project Context for New Chat

Paste this entire file at the start of a new conversation to continue building ClipCaption.

---

## Project summary

ClipCaption is a Next.js SaaS web app for TikTok creators (Moroccan market — Darija + French).

Users upload a video → get TikTok captions, hashtags, hooks, and .srt subtitles.

## Free stack (zero cost)

- **Next.js 15** — App Router, TypeScript, Tailwind CSS
- **Replit** — hosting (free tier + UptimeRobot keepalive)
- **Supabase** — database (video_jobs table) + storage (videos + audio buckets)
- **Groq** — whisper-large-v3 (transcription) + llama-3.3-70b (captions) — both free
- **FFmpeg** — audio extraction (installed via replit.nix on Replit, env var path locally)

## Folder structure

```
src/
├── app/
│   ├── page.tsx                  # Home with UploadZone
│   ├── layout.tsx
│   ├── globals.css
│   ├── dashboard/page.tsx        # Full pipeline + ResultsPanel
│   └── api/
│       ├── upload/route.ts       # Video → Supabase Storage → DB row
│       ├── process/route.ts      # FFmpeg audio extraction + Groq Whisper
│       └── generate/route.ts     # Groq LLaMA captions + SRT
├── components/
│   ├── UploadZone.tsx            # Drag & drop, XHR progress, redirects to dashboard
│   └── ResultsPanel.tsx          # Captions + hashtags + hooks + SRT download
├── lib/
│   ├── supabase/client.ts        # Browser client
│   ├── supabase/server.ts        # Admin client (service role)
│   ├── groq.ts                   # transcribeAudio() + generateCaptions()
│   ├── ffmpeg.ts                 # extractAudio() — reads FFMPEG_PATH env var
│   └── utils.ts                  # generateSRT() + downloadTextFile()
└── types/index.ts                # VideoJob, TranscriptSegment, CaptionResult
```

## Database schema (Supabase)

```sql
CREATE TABLE video_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_path TEXT NOT NULL,
  audio_path TEXT,
  transcript TEXT,
  segments JSONB,
  tiktok_caption TEXT,
  hashtags TEXT[],
  hooks TEXT[],
  srt_content TEXT,
  status TEXT DEFAULT 'uploading' CHECK (
    status IN ('uploading', 'processing', 'transcribed', 'done', 'error')
  ),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Supabase Storage buckets: `videos` (private) and `audio` (private)

Storage policy:
```sql
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL TO service_role
USING (true) WITH CHECK (true);
```

## Environment variables needed

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
FFMPEG_PATH=          # /usr/bin/ffmpeg on Replit, full path on Windows
NEXT_PUBLIC_APP_URL=
```

## Pipeline flow

```
Upload → /api/upload → Supabase Storage (videos) → DB row (status: uploading)
      → /api/process → FFmpeg extracts audio → Supabase Storage (audio)
                     → Groq Whisper → transcript + segments → DB (status: transcribed)
      → /api/generate → Groq LLaMA → captions + hashtags + hooks
                      → generateSRT(segments) → srt_content → DB (status: done)
      → Dashboard shows ResultsPanel with all results
```

## Key decisions made

- No auth yet (MVP — jobs not tied to users)
- Flat file paths in Supabase Storage (no subfolders — avoids path errors)
- XHR used for upload (not fetch) to get real upload progress %
- Groq used instead of OpenAI (completely free)
- @ffmpeg-installer/ffmpeg as npm fallback if FFMPEG_PATH not set
- Replit + replit.nix for FFmpeg auto-install on deployment
- UptimeRobot pings every 5 min to prevent Replit sleep

## Dependencies (package.json)

```json
{
  "dependencies": {
    "@ffmpeg-installer/ffmpeg": "^1.1.0",
    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "fluent-ffmpeg": "^2.1.3",
    "groq-sdk": "^0.7.0",
    "next": "15.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

## Completed phases

- [x] Phase 1 — Setup, structure, env, base UI
- [x] Phase 2 — Upload system (Supabase Storage + UploadZone component)
- [x] Phase 3 — FFmpeg audio extraction + Groq Whisper transcription
- [x] Phase 4 — Groq LLaMA caption + hashtag + hook generation
- [x] Phase 5 — SRT subtitle generation + download button
- [x] Phase 6 — Full dashboard UI with ResultsPanel

## Remaining work

- [ ] Phase 7 — Replit deployment + UptimeRobot setup

## Current errors / known issues

- FFmpeg "Cannot find ffmpeg" error on Windows → fixed by setting FFMPEG_PATH in .env.local
- Supabase "Invalid path" error → fixed by using flat filenames (no uploads/ subfolder)
- Supabase storage RLS → fixed by service role policy

## What to ask Claude next

You can continue from any phase. Example prompts:
- "Continue with Phase 7 — deploy to Replit step by step"
- "Add Supabase Auth so users can see their history"
- "The /api/process route times out on long videos — add a queue"
- "Improve the Darija caption quality in the GPT prompt"
- "Add a loading skeleton to the dashboard while processing"
