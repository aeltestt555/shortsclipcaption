import { TranscriptSegment } from '@/types'

// Convert seconds to SRT timestamp format: HH:MM:SS,mmm
function secondsToSrtTime(seconds: number): string {
  const date = new Date(seconds * 1000)
  const hh = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const mm = date.getUTCMinutes().toString().padStart(2, '0')
  const ss = date.getUTCSeconds().toString().padStart(2, '0')
  const ms = date.getUTCMilliseconds().toString().padStart(3, '0')
  return `${hh}:${mm}:${ss},${ms}`
}

// Convert Whisper segments array to .srt file content
export function generateSRT(segments: TranscriptSegment[]): string {
  return segments
    .map((segment, index) => {
      const start = secondsToSrtTime(segment.start)
      const end = secondsToSrtTime(segment.end)
      const text = segment.text.trim()
      // SRT format: index \n timestamp \n text \n blank line
      return `${index + 1}\n${start} --> ${end}\n${text}`
    })
    .join('\n\n')
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

// Trigger browser download of a text file
export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
