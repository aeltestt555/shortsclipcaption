// 'use client'

// import { useState } from 'react'
// import { downloadTextFile } from '../lib/utils'
// import { VideoJob } from '../types/index'

// interface ResultsPanelProps {
//   job: VideoJob
// }

// function CopyButton({ text }: { text: string }) {
//   const [copied, setCopied] = useState(false)

//   const copy = async () => {
//     await navigator.clipboard.writeText(text)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   return (
//     <button
//       onClick={copy}
//       className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
//     >
//       {copied ? '✅ Copied!' : '📋 Copy'}
//     </button>
//   )
// }

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
//       <h2 className="font-bold text-white text-lg">{title}</h2>
//       {children}
//     </div>
//   )
// }

// export default function ResultsPanel({ job }: ResultsPanelProps) {
//   return (
//     <div className="space-y-4">

//       {/* TikTok Caption */}
//       {job.tiktok_caption && (
//         <Section title="🎯 TikTok Caption">
//           <div className="flex items-start justify-between gap-4">
//             <p className="text-gray-200 leading-relaxed flex-1">{job.tiktok_caption}</p>
//             <CopyButton text={job.tiktok_caption} />
//           </div>
//           <p className="text-xs text-gray-500">{job.tiktok_caption.length} / 150 characters</p>
//         </Section>
//       )}

//       {/* Hooks / Titles */}
//       {job.hooks && job.hooks.length > 0 && (
//         <Section title="🪝 Hooks & Titles">
//           <div className="space-y-3">
//             {job.hooks.map((hook, i) => (
//               <div key={i} className="flex items-center justify-between gap-4 bg-gray-800 rounded-xl px-4 py-3">
//                 <span className="text-gray-200 text-sm flex-1">{hook}</span>
//                 <CopyButton text={hook} />
//               </div>
//             ))}
//           </div>
//         </Section>
//       )}

//       {/* Hashtags */}
//       {job.hashtags && job.hashtags.length > 0 && (
//         <Section title="# Hashtags">
//           <div className="flex flex-wrap gap-2">
//             {job.hashtags.map((tag, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1.5 bg-violet-900/50 text-violet-300 rounded-full text-sm font-medium"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//           <div className="flex justify-end">
//             <CopyButton text={job.hashtags.map(h => `#${h}`).join(' ')} />
//           </div>
//         </Section>
//       )}

//       {/* SRT Subtitles Download */}
//       {job.srt_content && (
//         <Section title="📄 Subtitles (.srt)">
//           <div className="bg-gray-800 rounded-xl p-4 max-h-40 overflow-y-auto">
//             <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
//               {job.srt_content.slice(0, 300)}
//               {job.srt_content.length > 300 && '\n...'}
//             </pre>
//           </div>
//           <button
//             onClick={() => downloadTextFile(job.srt_content!, `clipcaption-${job.id.slice(0, 8)}.srt`)}
//             className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors text-sm"
//           >
//             ⬇️ Download .srt File
//           </button>
//         </Section>
//       )}

//       {/* Full Transcript */}
//       {job.transcript && (
//         <Section title="📝 Full Transcript">
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex-1">
//               <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
//                 {job.transcript}
//               </p>
//             </div>
//             <CopyButton text={job.transcript} />
//           </div>
//         </Section>
//       )}

//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { downloadTextFile } from '../lib/utils'
import { VideoJob } from '../types/index'

interface ResultsPanelProps {
  job: VideoJob
}

// ── SVG Icons ────────────────────────────────────────────────
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

// ── Copy Button ───────────────────────────────────────────────
function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 14px',
        background: copied ? 'rgba(69,255,154,0.1)' : 'var(--bg-raised)',
        border: `1px solid ${copied ? 'rgba(69,255,154,0.3)' : 'var(--border-strong)'}`,
        borderRadius: '8px',
        color: copied ? 'var(--green)' : 'var(--text-secondary)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        fontFamily: 'var(--font-body)',
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Copied' : label}
    </button>
  )
}

// ── Section wrapper ───────────────────────────────────────────
function Section({
  label,
  accent = false,
  children,
}: {
  label: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${accent ? 'rgba(232,255,71,0.15)' : 'var(--border)'}`,
      borderRadius: '20px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: accent ? 'var(--accent)' : 'var(--text-muted)',
          fontFamily: 'var(--font-display)',
        }}>{label}</span>
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function ResultsPanel({ job }: ResultsPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Caption */}
      {job.tiktok_caption && (
        <Section label="TikTok Caption" accent>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <p className="arabic" style={{
              flex: 1,
              fontFamily: 'var(--font-arabic)',
              fontSize: '20px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              direction: 'rtl',
              textAlign: 'right',
            }}>
              {job.tiktok_caption}
            </p>
            <CopyBtn text={job.tiktok_caption} />
          </div>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '12px',
            fontWeight: 300,
          }}>
            {job.tiktok_caption.length} / 150 chars
          </p>
        </Section>
      )}

      {/* Hooks */}
      {job.hooks && job.hooks.length > 0 && (
        <Section label="Hooks & Titles">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {job.hooks.map((hook, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '14px 16px',
                background: 'var(--bg-raised)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    width: '20px',
                    flexShrink: 0,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="arabic" style={{
                    fontFamily: 'var(--font-arabic)',
                    fontSize: '16px',
                    color: 'var(--text-primary)',
                    direction: 'rtl',
                    textAlign: 'right',
                    flex: 1,
                  }}>{hook}</span>
                </div>
                <CopyBtn text={hook} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Hashtags */}
      {job.hashtags && job.hashtags.length > 0 && (
        <Section label="Hashtags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {job.hashtags.map((tag, i) => (
              <span key={i} style={{
                padding: '6px 14px',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-strong)',
                borderRadius: '99px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}>
                #{tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CopyBtn text={job.hashtags.map(h => `#${h}`).join(' ')} label="Copy all" />
          </div>
        </Section>
      )}

      {/* SRT */}
      {job.srt_content && (
        <Section label="Subtitles — .srt">
          <div style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '14px 16px',
            maxHeight: '120px',
            overflow: 'hidden',
            marginBottom: '16px',
            position: 'relative',
          }}>
            <pre style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontWeight: 300,
              lineHeight: 1.7,
            }}>
              {job.srt_content.slice(0, 280)}
              {job.srt_content.length > 280 && '\n...'}
            </pre>
            {/* fade out */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '40px',
              background: 'linear-gradient(to bottom, transparent, var(--bg-base))',
            }} />
          </div>

          <button
            onClick={() => downloadTextFile(job.srt_content!, `clipcaption-${job.id.slice(0, 8)}.srt`)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <DownloadIcon />
            Download .srt file
          </button>
        </Section>
      )}

      {/* Transcript */}
      {job.transcript && (
        <Section label="Transcript">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <p className="arabic" style={{
              flex: 1,
              fontFamily: 'var(--font-arabic)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              direction: 'rtl',
              textAlign: 'right',
              maxHeight: '180px',
              overflowY: 'auto',
              fontWeight: 300,
            }}>
              {job.transcript}
            </p>
            <CopyBtn text={job.transcript} />
          </div>
        </Section>
      )}

    </div>
  )
}
