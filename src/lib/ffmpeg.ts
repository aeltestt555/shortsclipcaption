import ffmpeg from 'fluent-ffmpeg'
import { writeFile, unlink, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import os from 'os'

// Priority order for finding FFmpeg binary:
// 1. FFMPEG_PATH env var (set in .env.local for Windows, Replit Secrets for Replit)
// 2. @ffmpeg-installer/ffmpeg npm package (fallback for Vercel)
// 3. System PATH (Mac/Linux default installs)
function setupFfmpegPath() {
  if (process.env.FFMPEG_PATH) {
    ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH)
    console.log('FFmpeg path from env:', process.env.FFMPEG_PATH)
    return
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const installer = require('@ffmpeg-installer/ffmpeg')
    ffmpeg.setFfmpegPath(installer.path)
    console.log('FFmpeg path from installer:', installer.path)
  } catch {
    console.warn('FFmpeg: no FFMPEG_PATH set and @ffmpeg-installer not found — relying on system PATH')
  }
}

setupFfmpegPath()

export async function extractAudio(
  videoBuffer: Buffer,
  jobId: string
): Promise<Buffer> {
  // Use OS temp dir — works on Windows, Linux, Replit, Vercel
  const tmpDir = path.join(os.tmpdir(), 'clipcaption')

  if (!existsSync(tmpDir)) {
    await mkdir(tmpDir, { recursive: true })
  }

  const videoPath = path.join(tmpDir, `${jobId}-input.mp4`)
  const audioPath = path.join(tmpDir, `${jobId}-output.mp3`)

  try {
    // Write video to temp file
    await writeFile(videoPath, videoBuffer)

    // Extract audio optimized for Whisper:
    // - mono (1 channel) — Whisper's native format
    // - 16kHz sample rate — Whisper's native rate, smaller file
    // - 64k bitrate — enough for speech clarity
    await new Promise<void>((resolve, reject) => {
      ffmpeg(videoPath)
        .noVideo()
        .audioChannels(1)
        .audioFrequency(16000)
        .audioCodec('libmp3lame')
        .audioBitrate('64k')
        .output(audioPath)
        .on('start', (cmd) => console.log('FFmpeg started:', cmd))
        .on('end', () => {
          console.log('FFmpeg extraction complete')
          resolve()
        })
        .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
        .run()
    })

    const audioBuffer = await readFile(audioPath)
    console.log(`Audio size: ${(audioBuffer.length / 1024 / 1024).toFixed(2)}MB`)
    return audioBuffer

  } finally {
    // Always clean up temp files
    await unlink(videoPath).catch(() => {})
    await unlink(audioPath).catch(() => {})
  }
}
