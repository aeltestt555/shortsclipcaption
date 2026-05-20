# 🎬 ClipCaption

> Upload a video → get TikTok captions, hashtags, hooks & subtitles instantly.
> Built for Moroccan creators — works with **Darija, French & English**.

---

## 💡 What it does

1. You upload a video (MP4, MOV, WebM — up to 200MB)
2. FFmpeg extracts the audio
3. Groq Whisper transcribes the speech (auto-detects language)
4. Groq LLaMA generates TikTok captions, hashtags, and hooks
5. The app builds a `.srt` subtitle file from the timestamps
6. Everything appears in a dashboard — copy, download, done

**Total cost: $0/month** (free stack)

---

## 🆓 Free Stack

| Layer | Tool | Cost |
|---|---|---|
| Frontend + API | Next.js (App Router + TypeScript) | Free |
| Hosting | Replit | Free |
| Styling | Tailwind CSS | Free |
| Database + Storage | Supabase | Free (1GB) |
| Transcription | Groq — whisper-large-v3 | Free |
| Caption generation | Groq — llama-3.3-70b | Free |
| Audio extraction | FFmpeg (via replit.nix) | Free |
| Keep-alive | UptimeRobot | Free |

---

## 📁 Project structure

```
clipcaption/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home — upload zone
│   │   ├── layout.tsx                # Root layout + navbar
│   │   ├── globals.css
│   │   └── dashboard/
│   │       └── page.tsx              # Results dashboard (full pipeline)
│   │   └── api/
│   │       ├── upload/route.ts       # Receives video → Supabase Storage
│   │       ├── process/route.ts      # FFmpeg + Whisper transcription
│   │       └── generate/route.ts     # GPT captions + SRT generation
│   ├── components/
│   │   ├── UploadZone.tsx            # Drag & drop with progress bar
│   │   └── ResultsPanel.tsx          # Captions, hashtags, SRT download
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   └── server.ts             # Admin client (server-side only)
│   │   ├── groq.ts                   # Whisper + LLM via Groq
│   │   ├── ffmpeg.ts                 # Audio extraction
│   │   └── utils.ts                  # SRT generator + download helper
│   └── types/index.ts                # Shared TypeScript types
├── .env.local.template               # Copy this to .env.local and fill in
├── .replit                           # Replit run config
├── replit.nix                        # Auto-installs FFmpeg on Replit
├── next.config.ts
├── CONTINUE.md                       # Paste this into a new chat to continue
└── README.md
```

---

## ⚙️ Local development setup (Windows)

### 1. Prerequisites

- Node.js 18+ → [nodejs.org](https://nodejs.org)
- Git → [git-scm.com](https://git-scm.com)
- Supabase account → [supabase.com](https://supabase.com) (free)
- Groq account → [console.groq.com](https://console.groq.com) (free)

### 2. Install FFmpeg on Windows

```bash
winget install --id Gyan.FFmpeg -e
```

Restart terminal, then verify:
```bash
ffmpeg -version
where ffmpeg    # copy this path — you'll need it
```

### 3. Clone and install

```bash
git clone https://github.com/yourname/clipcaption.git
cd clipcaption
npm install
```

### 4. Environment variables

Copy the template and fill it in:
```bash
copy .env.local.template .env.local
```

Open `.env.local` and fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GROQ_API_KEY=gsk_...
FFMPEG_PATH=C:\path\to\ffmpeg.exe
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Supabase setup

**Create two storage buckets** in Supabase → Storage:
- `videos` (private)
- `audio` (private)

**Run this SQL** in Supabase → SQL Editor:

```sql
-- Jobs table
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

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON video_jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage policy (lets service role upload/download)
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy to Replit (Free)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourname/clipcaption.git
git push -u origin main
```

### 2. Import to Replit

1. Go to [replit.com](https://replit.com) → Create Repl
2. Choose **Import from GitHub**
3. Paste your repo URL
4. Replit auto-detects Node.js

### 3. FFmpeg on Replit

FFmpeg is auto-installed via `replit.nix` — nothing to do manually.

Verify in Replit Shell:
```bash
ffmpeg -version
which ffmpeg    # should print /usr/bin/ffmpeg
```

### 4. Add Secrets in Replit

Go to Replit → left sidebar → 🔒 **Secrets** → add each:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
| `GROQ_API_KEY` | your Groq key |
| `FFMPEG_PATH` | `/usr/bin/ffmpeg` |
| `NEXT_PUBLIC_APP_URL` | `https://your-repl.repl.co` |

### 5. Run on Replit

Click the **Run** button. First build takes ~2 minutes.

Your app will be live at: `https://clipcaption.your-username.repl.co`

### 6. Keep it awake (UptimeRobot)

Free Replit tier sleeps after 5 min of inactivity:

1. Go to [uptimerobot.com](https://uptimerobot.com) → free account
2. Add Monitor → HTTP(S)
3. URL: `https://your-repl.repl.co`
4. Interval: 5 minutes
5. Done ✅

---

## 🔁 How the pipeline works

```
User uploads video
      │
      ▼
POST /api/upload
  ✓ Validates type + size
  ✓ Uploads to Supabase Storage (videos bucket)
  ✓ Creates video_jobs row { status: 'uploading' }
  ✓ Returns jobId → redirect to /dashboard?jobId=...
      │
      ▼
POST /api/process
  ✓ Downloads video from Supabase Storage
  ✓ FFmpeg: extracts audio (mono, 16kHz MP3)
  ✓ Uploads audio to Supabase Storage (audio bucket)
  ✓ Groq Whisper: transcribes → text + timestamps
  ✓ Saves transcript + segments to DB
  ✓ status → 'transcribed'
      │
      ▼
POST /api/generate
  ✓ Reads transcript from DB
  ✓ Groq LLaMA: generates caption, hashtags, hooks
  ✓ Converts segments → .srt format
  ✓ Saves all results to DB
  ✓ status → 'done'
      │
      ▼
Dashboard
  ✓ Shows TikTok caption (copy button)
  ✓ Shows hooks/titles (copy each)
  ✓ Shows hashtags (copy all)
  ✓ Download .srt file button
  ✓ Full transcript (copy)
```

---

## 🔑 Getting your free API keys

### Groq (Whisper + LLM — both free)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (GitHub login works)
3. API Keys → Create API Key
4. Copy key → paste in `.env.local` as `GROQ_API_KEY`

Models used:
- `whisper-large-v3` — transcription
- `llama-3.3-70b-versatile` — caption generation

### Supabase (Database + Storage — free up to 1GB)
1. Go to [supabase.com](https://supabase.com)
2. New project
3. Settings → API → copy URL + anon key + service_role key

---

## 🇲🇦 Darija support notes

Whisper has no native Darija model. What happens:
- Whisper detects it as Arabic (`ar`)
- Transcribes using Modern Standard Arabic phonetics
- Darija words transcribed phonetically (not always perfect spelling)

The `prompt` field in the Groq Whisper call hints the model:
```
"Contenu TikTok en darija marocain et français."
```

The LLaMA caption prompt instructs it to respond in the same language as the transcript — so if the transcript is Darija, captions will be in Darija.

---

## 📋 Build phases checklist

- [x] Phase 1 — Project setup, folder structure, TypeScript, Tailwind
- [x] Phase 2 — Video upload system (Supabase Storage + UploadZone UI)
- [x] Phase 3 — FFmpeg audio extraction + Groq Whisper transcription
- [x] Phase 4 — Groq LLaMA caption + hashtag + hook generation
- [x] Phase 5 — SRT subtitle generation + download
- [x] Phase 6 — Results dashboard UI (all panels + copy buttons)
- [ ] Phase 7 — Replit deployment + UptimeRobot keep-alive

---

## 🛣️ Post-MVP roadmap

- Supabase Auth — save history per user account
- Job queue (Inngest) — handle videos > 5 min without timeout
- Caption editor — edit before copying
- Direct TikTok share API
- Usage dashboard — track jobs per user
- Stripe billing — pay-as-you-go after free quota
- Better Darija support — fine-tuned prompt or custom model

---

## 📝 License

MIT — do whatever you want with it.
