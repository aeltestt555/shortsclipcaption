import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Use MP4, MOV, WebM, or AVI.` },
        { status: 400 }
      )
    }

    const MAX_SIZE = 200 * 1024 * 1024 // 200MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 200MB.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Flat filename — no subfolders (avoids Supabase path issues)
    const timestamp = Date.now()
    const ext = file.name.split('.').pop() ?? 'mp4'
    const videoPath = `${timestamp}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(videoPath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video', detail: uploadError.message },
        { status: 500 }
      )
    }

    // Create job record
    const { data: job, error: dbError } = await supabase
      .from('video_jobs')
      .insert({ video_path: videoPath, status: 'uploading' })
      .select()
      .single()

    if (dbError) {
      console.error('DB insert error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create job', detail: dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ jobId: job.id, videoPath }, { status: 201 })

  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: 'Internal server error', detail: err?.message },
      { status: 500 }
    )
  }
}
