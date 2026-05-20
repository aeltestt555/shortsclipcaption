import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { extractAudio } from '@/lib/ffmpeg'
import { transcribeAudio } from '@/lib/groq'

export const maxDuration = 300 // 5 minutes — needed for long videos

export async function POST(request: NextRequest) {
  let jobId: string | undefined

  try {
    const body = await request.json()
    jobId = body.jobId as string

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Fetch job
    const { data: job, error: jobError } = await supabase
      .from('video_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // 2. Mark as processing
    await supabase
      .from('video_jobs')
      .update({ status: 'processing' })
      .eq('id', jobId)

    // 3. Download video from Supabase Storage
    console.log('Downloading video:', job.video_path)
    const { data: videoData, error: downloadError } = await supabase.storage
      .from('videos')
      .download(job.video_path)

    if (downloadError || !videoData) {
      throw new Error(`Failed to download video: ${downloadError?.message}`)
    }

    const videoBuffer = Buffer.from(await videoData.arrayBuffer())
    console.log(`Video: ${(videoBuffer.length / 1024 / 1024).toFixed(2)}MB`)

    // 4. Extract audio with FFmpeg
    console.log('Extracting audio...')
    const audioBuffer = await extractAudio(videoBuffer, jobId)

    // 5. Upload audio to Supabase Storage
    const audioPath = `${jobId}.mp3`
    const { error: audioUploadError } = await supabase.storage
      .from('audio')
      .upload(audioPath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      })

    if (audioUploadError) {
      throw new Error(`Failed to upload audio: ${audioUploadError.message}`)
    }

    // 6. Transcribe with Whisper via Groq (free)
    console.log('Transcribing with Groq Whisper...')
    const { text, segments } = await transcribeAudio(audioBuffer, jobId)
    console.log(`Transcript (${segments.length} segments): ${text.slice(0, 80)}...`)

    // 7. Save to DB
    const { error: updateError } = await supabase
      .from('video_jobs')
      .update({
        audio_path: audioPath,
        transcript: text,
        segments: segments,
        status: 'transcribed',
      })
      .eq('id', jobId)

    if (updateError) {
      throw new Error(`Failed to save transcript: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      jobId,
      transcript: text,
      segmentCount: segments.length,
    })

  } catch (err: any) {
    console.error('Process error:', err)

    if (jobId) {
      const supabase = createAdminClient()
      await supabase
        .from('video_jobs')
        .update({ status: 'error', error_message: err.message })
        .eq('id', jobId)
    }

    return NextResponse.json(
      { error: 'Processing failed', detail: err.message },
      { status: 500 }
    )
  }
}
