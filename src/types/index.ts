export interface VideoJob {
  id: string
  video_path: string
  audio_path?: string
  transcript?: string
  segments?: TranscriptSegment[]
  tiktok_caption?: string
  hashtags?: string[]
  hooks?: string[]
  srt_content?: string
  status: 'uploading' | 'processing' | 'transcribed' | 'done' | 'error'
  error_message?: string
  created_at: string
  updated_at: string
}

export interface TranscriptSegment {
  start: number  // seconds
  end: number
  text: string
}

export interface CaptionResult {
  tiktok_caption: string
  hashtags: string[]
  hooks: string[]
  srt_content: string
}
