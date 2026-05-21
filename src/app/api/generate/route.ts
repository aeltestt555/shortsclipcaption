import { TranscriptSegment } from './../../../types/index';
import { NextRequest, NextResponse } from 'next/server'
    
import { generateSRT } from '../../../lib/utils';
import { generateCaptions } from '../../../lib/groq';
import { createAdminClient } from '../../../lib/supabase/server';
 
 
export const maxDuration = 60

export async function POST(request: NextRequest) {
  let jobId: string | undefined

  try {
    const body = await request.json()
    jobId = body.jobId as string

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Fetch job with transcript
    const { data: job, error: jobError } = await supabase
      .from('video_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (!job.transcript) {
      return NextResponse.json(
        { error: 'No transcript found. Run /api/process first.' },
        { status: 400 }
      )
    }

    // 2. Generate captions with Groq LLM (free)
    console.log('Generating captions with Groq...')
    const { tiktok_caption, hashtags, hooks } = await generateCaptions(job.transcript)

    // 3. Generate SRT from segments
    const segments: TranscriptSegment[] = job.segments ?? []
    const srt_content = segments.length > 0
      ? generateSRT(segments)
      : `1\n00:00:00,000 --> 00:00:05,000\n${job.transcript.slice(0, 80)}`

    // 4. Save everything to DB
    const { error: updateError } = await supabase
      .from('video_jobs')
      .update({
        tiktok_caption,
        hashtags,
        hooks,
        srt_content,
        status: 'done',
      })
      .eq('id', jobId)

    if (updateError) {
      throw new Error(`Failed to save results: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      jobId,
      tiktok_caption,
      hashtags,
      hooks,
      srt_content,
    })

  } catch (err: any) {
    console.error('Generate error:', err)

    if (jobId) {
      const supabase = createAdminClient()
      await supabase
        .from('video_jobs')
        .update({ status: 'error', error_message: err.message })
        .eq('id', jobId)
    }

    return NextResponse.json(
      { error: 'Generation failed', detail: err.message },
      { status: 500 }
    )
  }
}
