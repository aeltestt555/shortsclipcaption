// 'use client'

// import { useEffect, useState, Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'

// import { VideoJob } from '../../types/index'
// import ResultsPanel from '../../components/ResultsPanel'

 

// type Stage = 'uploading' | 'processing' | 'transcribed' | 'generating' | 'done' | 'error'

// function StepIndicator({ label, done, active, error }: {
//   label: string
//   done: boolean
//   active?: boolean
//   error?: boolean
// }) {
//   return (
//     <div className="flex items-center gap-3">
//       <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
//         error   ? 'bg-red-500 text-white' :
//         done    ? 'bg-green-500 text-white' :
//         active  ? 'bg-violet-500 text-white animate-pulse' :
//                   'bg-gray-800 text-gray-500'
//       }`}>
//         {error ? '✕' : done ? '✓' : active ? '…' : '○'}
//       </div>
//       <span className={`text-sm ${
//         error  ? 'text-red-400' :
//         done   ? 'text-white' :
//         active ? 'text-violet-300' :
//                  'text-gray-500'
//       }`}>
//         {label}
//       </span>
//     </div>
//   )
// }

// function DashboardContent() {
//   const searchParams = useSearchParams()
//   const jobId = searchParams.get('jobId')

//   const [stage, setStage] = useState<Stage>('uploading')
//   const [job, setJob] = useState<VideoJob | null>(null)
//   const [errorMessage, setErrorMessage] = useState('')

//   useEffect(() => {
//     if (!jobId) return
//     runFullPipeline(jobId)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [jobId])

//   async function runFullPipeline(id: string) {
//     // Step 1: Process (FFmpeg + Whisper)
//     setStage('processing')
//     const processRes = await fetch('/api/process', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ jobId: id }),
//     })
//     const processData = await processRes.json()

//     if (!processRes.ok) {
//       setStage('error')
//       setErrorMessage(processData.detail ?? processData.error ?? 'Processing failed')
//       return
//     }

//     setStage('generating')

//     // Step 2: Generate captions + SRT
//     const generateRes = await fetch('/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ jobId: id }),
//     })
//     const generateData = await generateRes.json()

//     if (!generateRes.ok) {
//       setStage('error')
//       setErrorMessage(generateData.detail ?? generateData.error ?? 'Generation failed')
//       return
//     }

//     // Build job object from responses
//     setJob({
//       id,
//       video_path: '',
//       transcript: processData.transcript,
//       tiktok_caption: generateData.tiktok_caption,
//       hashtags: generateData.hashtags,
//       hooks: generateData.hooks,
//       srt_content: generateData.srt_content,
//       status: 'done',
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     })

//     setStage('done')
//   }

//   if (!jobId) {
//     return (
//       <div className="text-center py-24 space-y-4">
//         <div className="text-5xl">🎬</div>
//         <p className="text-gray-400">No job found.</p>
//         <a href="/" className="text-violet-400 underline text-sm">Upload a video first →</a>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-2xl font-bold">Processing your video</h1>
//         <p className="text-gray-400 text-sm mt-1">Job ID: <span className="font-mono text-gray-500">{jobId}</span></p>
//       </div>

//       {/* Pipeline steps */}
//       <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
//         <StepIndicator label="📤 Video uploaded" done={true} />
//         <StepIndicator
//           label="🎙️ Extracting audio & transcribing speech (Whisper)"
//           done={['generating', 'done'].includes(stage)}
//           active={stage === 'processing'}
//           error={stage === 'error'}
//         />
//         <StepIndicator
//           label="✍️ Generating TikTok captions, hashtags & hooks"
//           done={stage === 'done'}
//           active={stage === 'generating'}
//           error={stage === 'error'}
//         />
//         <StepIndicator
//           label="📄 Building .srt subtitle file"
//           done={stage === 'done'}
//           active={stage === 'generating'}
//         />
//       </div>

//       {/* Error state */}
//       {stage === 'error' && (
//         <div className="bg-red-950/50 border border-red-800 rounded-2xl p-5 space-y-2">
//           <p className="font-semibold text-red-300">Something went wrong</p>
//           <p className="text-sm text-red-400 font-mono">{errorMessage}</p>
//           <a href="/" className="text-sm text-violet-400 underline block mt-2">← Try another video</a>
//         </div>
//       )}

//       {/* Processing indicator */}
//       {(stage === 'processing' || stage === 'generating') && (
//         <div className="text-center py-8 space-y-3">
//           <div className="flex justify-center gap-1.5">
//             {[0, 1, 2].map(i => (
//               <div
//                 key={i}
//                 className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce"
//                 style={{ animationDelay: `${i * 0.15}s` }}
//               />
//             ))}
//           </div>
//           <p className="text-gray-400 text-sm">
//             {stage === 'processing' ? 'Extracting audio and transcribing... (30–90 sec)' : 'Generating captions...'}
//           </p>
//         </div>
//       )}

//       {/* Results */}
//       {stage === 'done' && job && (
//         <div className="space-y-4">
//           <div className="flex items-center gap-3">
//             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//             <p className="text-green-400 font-medium">Done! Your content is ready.</p>
//           </div>
//           <ResultsPanel job={job} />
//           <div className="text-center pt-4">
//             <a
//               href="/"
//               className="text-sm text-gray-500 hover:text-gray-300 underline transition-colors"
//             >
//               ← Process another video
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function DashboardPage() {
//   return (
//     <Suspense fallback={<div className="text-gray-400 py-24 text-center">Loading...</div>}>
//       <DashboardContent />
//     </Suspense>
//   )
// }


'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ResultsPanel from '../../components/ResultsPanel'
import { VideoJob } from '../../types/index'

type Stage = 'uploading' | 'processing' | 'transcribed' | 'generating' | 'done' | 'error'

// ── SVG Icons ────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ── Step row ──────────────────────────────────────────────────
function Step({
  label,
  sub,
  done,
  active,
  error,
  index,
}: {
  label: string
  sub: string
  done: boolean
  active?: boolean
  error?: boolean
  index: number
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid var(--border)',
      opacity: (!done && !active && !error) ? 0.35 : 1,
      transition: 'opacity 0.4s',
    }}>
      {/* Step indicator */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: done
          ? 'rgba(69,255,154,0.12)'
          : active
          ? 'var(--accent-dim)'
          : error
          ? 'rgba(255,69,69,0.12)'
          : 'var(--bg-raised)',
        border: `1px solid ${
          done
            ? 'rgba(69,255,154,0.25)'
            : active
            ? 'rgba(232,255,71,0.25)'
            : error
            ? 'rgba(255,69,69,0.25)'
            : 'var(--border)'
        }`,
        transition: 'all 0.4s',
      }}>
        {done ? (
          <span style={{ color: 'var(--green)' }}><CheckIcon /></span>
        ) : active ? (
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--accent)',
            animation: 'pulse-dot 1.2s ease-in-out infinite',
          }} />
        ) : error ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--text-muted)',
          }}>
            {String(index).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Labels */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '15px',
          fontWeight: 700,
          color: error ? 'var(--red)' : done ? 'var(--text-primary)' : active ? 'var(--accent)' : 'var(--text-primary)',
          letterSpacing: '-0.01em',
          marginBottom: '2px',
          transition: 'color 0.3s',
        }}>{label}</p>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontWeight: 300,
        }}>{sub}</p>
      </div>

      {/* Time estimate for active */}
      {active && (
        <span style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontWeight: 300,
          whiteSpace: 'nowrap',
        }}>
          30–90s
        </span>
      )}
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────
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
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '15px' }}>
          No video found.
        </p>
        <a href="/" style={{
          color: 'var(--accent)',
          fontSize: '14px',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}>
          Upload a video →
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }} className="animate-fade-up">
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          {stage === 'done' ? 'Content ready' : 'Processing'}
          {stage !== 'done' && stage !== 'error' && (
            <span style={{ color: 'var(--accent)' }}>.</span>
          )}
        </h1>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          letterSpacing: '0.01em',
        }}>
          Job <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{jobId?.slice(0, 16)}...</span>
        </p>
      </div>

      {/* Pipeline steps */}
      {stage !== 'done' && (
        <div className="animate-fade-up animate-fade-up-1" style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '4px 24px 0',
          marginBottom: '32px',
        }}>
          <Step
            index={1}
            label="Upload complete"
            sub="Video stored securely"
            done={true}
          />
          <Step
            index={2}
            label="Audio extraction & transcription"
            sub="FFmpeg · Groq Whisper large-v3"
            done={['generating', 'done'].includes(stage)}
            active={stage === 'processing'}
            error={stage === 'error'}
          />
          <Step
            index={3}
            label="Caption & hook generation"
            sub="Groq LLaMA 3.3 70B"
            done={stage === 'done'}
            active={stage === 'generating'}
            error={stage === 'error'}
          />
          <Step
            index={4}
            label="Subtitle file"
            sub="Timestamped .srt export"
            done={stage === 'done'}
            active={stage === 'generating'}
          />
        </div>
      )}

      {/* Error */}
      {stage === 'error' && (
        <div className="animate-fade-up" style={{
          background: 'rgba(255,69,69,0.05)',
          border: '1px solid rgba(255,69,69,0.2)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--red)',
            marginBottom: '8px',
            letterSpacing: '-0.01em',
          }}>
            Something went wrong
          </p>
          <p style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'rgba(255,69,69,0.7)',
            marginBottom: '16px',
            lineHeight: 1.5,
          }}>
            {errorMessage}
          </p>
          <a href="/" style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            ← Try another video
          </a>
        </div>
      )}

      {/* Active processing animation */}
      {(stage === 'processing' || stage === 'generating') && (
        <div className="animate-fade-up" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 0',
          marginBottom: '8px',
        }}>
          {/* Spinner */}
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid var(--border-strong)',
            borderTop: '2px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }} />
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            fontWeight: 300,
          }}>
            {stage === 'processing'
              ? 'Extracting audio and transcribing speech...'
              : 'Generating captions, hooks and hashtags...'}
          </p>
        </div>
      )}

      {/* Results */}
      {stage === 'done' && job && (
        <div className="animate-fade-up">
          {/* Done badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(69,255,154,0.08)',
            border: '1px solid rgba(69,255,154,0.2)',
            borderRadius: '99px',
            marginBottom: '28px',
          }}>
            <span style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'inline-block',
              boxShadow: '0 0 6px var(--green)',
            }} />
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--green)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
            }}>
              Ready
            </span>
          </div>

          <ResultsPanel job={job} />

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href="/" style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontWeight: 300,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Process another video
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '80px 0', fontWeight: 300 }}>
        Loading...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
