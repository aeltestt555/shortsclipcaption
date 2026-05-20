import Groq from 'groq-sdk'
import { TranscriptSegment, CaptionResult } from '@/types'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// ─────────────────────────────────────────────
// WHISPER TRANSCRIPTION (free via Groq)
// Uses whisper-large-v3 — better than OpenAI's whisper-1
// ─────────────────────────────────────────────
export async function transcribeAudio(
  audioBuffer: Buffer,
  jobId: string
): Promise<{ text: string; segments: TranscriptSegment[] }> {
  const audioFile = new File([audioBuffer], `${jobId}.mp3`, {
    type: 'audio/mpeg',
  })

  const response = await groq.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-large-v3',
    response_format: 'verbose_json',
    // Don't force language — auto-detects Darija/French/English per file
    // The prompt hints Whisper to expect Moroccan content and code-switching
    prompt: 'Contenu TikTok en darija marocain et français. Mélange de langues possible. واش كاين شي حاجة؟',
    temperature: 0,
  })

  const segments: TranscriptSegment[] = ((response as any).segments ?? []).map((s: any) => ({
    start: s.start,
    end: s.end,
    text: s.text.trim(),
  }))

  return {
    text: response.text,
    segments,
  }
}

// ─────────────────────────────────────────────
// GPT CAPTION GENERATION (free via Groq LLM)
// ─────────────────────────────────────────────
export async function generateCaptions(
  transcript: string
): Promise<Omit<CaptionResult, 'srt_content'>> {
  const prompt = `You are a TikTok content expert specializing in Moroccan creators.
The creator speaks Darija (Moroccan Arabic dialect), French, or a mix of both.

Based on this video transcript, generate TikTok content in the SAME language(s) as the transcript.
If the transcript is in Darija → respond in Darija.
If French → French. If mixed → mix.

TRANSCRIPT:
"""
${transcript}
"""

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "tiktok_caption": "One engaging TikTok caption under 150 characters. Conversational tone, hooks the viewer in the first 3 words.",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8"],
  "hooks": [
    "Hook 1: A punchy opening line to use as video title or overlay text",
    "Hook 2: Alternative hook — different angle or emotion",
    "Hook 3: Question-based hook to drive comments"
  ]
}

Rules:
- hashtags: mix of Moroccan (#maroc #morocco #dz), niche, and viral tags. No # prefix in the array values.
- hooks: short, punchy, under 10 words each
- caption: must make people stop scrolling`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  })

  const raw = completion.choices[0]?.message?.content ?? '{}'

  try {
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      tiktok_caption: parsed.tiktok_caption ?? '',
      hashtags: parsed.hashtags ?? [],
      hooks: parsed.hooks ?? [],
    }
  } catch {
    console.error('Failed to parse caption JSON:', raw)
    return {
      tiktok_caption: '',
      hashtags: [],
      hooks: [],
    }
  }
}
