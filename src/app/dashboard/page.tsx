'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { VideoJob } from '../../types/index'
import ResultsPanel from '../../components/ResultsPanel'

 

type Stage = 'uploading' | 'processing' | 'transcribed' | 'generating' | 'done' | 'error'

function StepIndicator({ label, done, active, error }: {
  label: string
  done: boolean
  active?: boolean
  error?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
        error   ? 'bg-red-500 text-white' :
        done    ? 'bg-green-500 text-white' :
        active  ? 'bg-violet-500 text-white animate-pulse' :
                  'bg-gray-800 text-gray-500'
      }`}>
        {error ? '✕' : done ? '✓' : active ? '…' : '○'}
      </div>
      <span className={`text-sm ${
        error  ? 'text-red-400' :
        done   ? 'text-white' :
        active ? 'text-violet-300' :
                 'text-gray-500'
      }`}>
        {label}
      </span>
    </div>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [stage, setStage] = useState<Stage>('uploading')
  const [job, setJob] = useState<VideoJob | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!jobId) return
    runFullPipeline(jobId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  async function runFullPipeline(id: string) {
    // Step 1: Process (FFmpeg + Whisper)
    setStage('processing')
    const processRes = await fetch('/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: id }),
    })
    const processData = await processRes.json()

    if (!processRes.ok) {
      setStage('error')
      setErrorMessage(processData.detail ?? processData.error ?? 'Processing failed')
      return
    }

    setStage('generating')

    // Step 2: Generate captions + SRT
    const generateRes = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: id }),
    })
    const generateData = await generateRes.json()

    if (!generateRes.ok) {
      setStage('error')
      setErrorMessage(generateData.detail ?? generateData.error ?? 'Generation failed')
      return
    }

    // Build job object from responses
    setJob({
      id,
      video_path: '',
      transcript: processData.transcript,
      tiktok_caption: generateData.tiktok_caption,
      hashtags: generateData.hashtags,
      hooks: generateData.hooks,
      srt_content: generateData.srt_content,
      status: 'done',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    setStage('done')
  }

  if (!jobId) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="text-5xl">🎬</div>
        <p className="text-gray-400">No job found.</p>
        <a href="/" className="text-violet-400 underline text-sm">Upload a video first →</a>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Processing your video</h1>
        <p className="text-gray-400 text-sm mt-1">Job ID: <span className="font-mono text-gray-500">{jobId}</span></p>
      </div>

      {/* Pipeline steps */}
      <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
        <StepIndicator label="📤 Video uploaded" done={true} />
        <StepIndicator
          label="🎙️ Extracting audio & transcribing speech (Whisper)"
          done={['generating', 'done'].includes(stage)}
          active={stage === 'processing'}
          error={stage === 'error'}
        />
        <StepIndicator
          label="✍️ Generating TikTok captions, hashtags & hooks"
          done={stage === 'done'}
          active={stage === 'generating'}
          error={stage === 'error'}
        />
        <StepIndicator
          label="📄 Building .srt subtitle file"
          done={stage === 'done'}
          active={stage === 'generating'}
        />
      </div>

      {/* Error state */}
      {stage === 'error' && (
        <div className="bg-red-950/50 border border-red-800 rounded-2xl p-5 space-y-2">
          <p className="font-semibold text-red-300">Something went wrong</p>
          <p className="text-sm text-red-400 font-mono">{errorMessage}</p>
          <a href="/" className="text-sm text-violet-400 underline block mt-2">← Try another video</a>
        </div>
      )}

      {/* Processing indicator */}
      {(stage === 'processing' || stage === 'generating') && (
        <div className="text-center py-8 space-y-3">
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            {stage === 'processing' ? 'Extracting audio and transcribing... (30–90 sec)' : 'Generating captions...'}
          </p>
        </div>
      )}

      {/* Results */}
      {stage === 'done' && job && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-green-400 font-medium">Done! Your content is ready.</p>
          </div>
          <ResultsPanel job={job} />
          <div className="text-center pt-4">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 underline transition-colors"
            >
              ← Process another video
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-gray-400 py-24 text-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
