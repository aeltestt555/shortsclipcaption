'use client'

import { useState } from 'react'
import { downloadTextFile } from '../lib/utils'
import { VideoJob } from '../types/index'

interface ResultsPanelProps {
  job: VideoJob
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
    >
      {copied ? '✅ Copied!' : '📋 Copy'}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
      <h2 className="font-bold text-white text-lg">{title}</h2>
      {children}
    </div>
  )
}

export default function ResultsPanel({ job }: ResultsPanelProps) {
  return (
    <div className="space-y-4">

      {/* TikTok Caption */}
      {job.tiktok_caption && (
        <Section title="🎯 TikTok Caption">
          <div className="flex items-start justify-between gap-4">
            <p className="text-gray-200 leading-relaxed flex-1">{job.tiktok_caption}</p>
            <CopyButton text={job.tiktok_caption} />
          </div>
          <p className="text-xs text-gray-500">{job.tiktok_caption.length} / 150 characters</p>
        </Section>
      )}

      {/* Hooks / Titles */}
      {job.hooks && job.hooks.length > 0 && (
        <Section title="🪝 Hooks & Titles">
          <div className="space-y-3">
            {job.hooks.map((hook, i) => (
              <div key={i} className="flex items-center justify-between gap-4 bg-gray-800 rounded-xl px-4 py-3">
                <span className="text-gray-200 text-sm flex-1">{hook}</span>
                <CopyButton text={hook} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Hashtags */}
      {job.hashtags && job.hashtags.length > 0 && (
        <Section title="# Hashtags">
          <div className="flex flex-wrap gap-2">
            {job.hashtags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-violet-900/50 text-violet-300 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex justify-end">
            <CopyButton text={job.hashtags.map(h => `#${h}`).join(' ')} />
          </div>
        </Section>
      )}

      {/* SRT Subtitles Download */}
      {job.srt_content && (
        <Section title="📄 Subtitles (.srt)">
          <div className="bg-gray-800 rounded-xl p-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
              {job.srt_content.slice(0, 300)}
              {job.srt_content.length > 300 && '\n...'}
            </pre>
          </div>
          <button
            onClick={() => downloadTextFile(job.srt_content!, `clipcaption-${job.id.slice(0, 8)}.srt`)}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors text-sm"
          >
            ⬇️ Download .srt File
          </button>
        </Section>
      )}

      {/* Full Transcript */}
      {job.transcript && (
        <Section title="📝 Full Transcript">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {job.transcript}
              </p>
            </div>
            <CopyButton text={job.transcript} />
          </div>
        </Section>
      )}

    </div>
  )
}
