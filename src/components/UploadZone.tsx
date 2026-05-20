'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export default function UploadZone() {
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleUpload = useCallback(async (file: File) => {
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a video file (MP4, MOV, WebM, AVI)')
      setUploadState('error')
      return
    }
    if (file.size > 200 * 1024 * 1024) {
      setErrorMessage('File too large. Maximum is 200MB.')
      setUploadState('error')
      return
    }

    setFileName(file.name)
    setUploadState('uploading')
    setProgress(0)
    setErrorMessage('')

    const formData = new FormData()
    formData.append('video', file)

    // Use XHR for real upload progress tracking
    const xhr = new XMLHttpRequest()
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status === 201) {
        const data = JSON.parse(xhr.responseText)
        setUploadState('success')
        router.push(`/dashboard?jobId=${data.jobId}`)
      } else {
        const data = JSON.parse(xhr.responseText)
        setErrorMessage(data.error ?? 'Upload failed')
        setUploadState('error')
      }
    }
    xhr.onerror = () => {
      setErrorMessage('Network error. Check your connection and try again.')
      setUploadState('error')
    }
    xhr.open('POST', '/api/upload')
    xhr.send(formData)
  }, [router])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const reset = () => {
    setUploadState('idle')
    setProgress(0)
    setErrorMessage('')
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
        className="hidden"
        id="video-input"
      />

      {uploadState === 'idle' && (
        <label
          htmlFor="video-input"
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-16 cursor-pointer transition-all duration-200 ${
            dragOver ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-900'
          }`}
        >
          <div className="text-5xl">🎬</div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">Drop your video here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse — MP4, MOV, WebM up to 200MB</p>
          </div>
          <span className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-colors">
            Choose Video
          </span>
        </label>
      )}

      {uploadState === 'uploading' && (
        <div className="border-2 border-gray-700 rounded-2xl p-16 flex flex-col items-center gap-6">
          <div className="text-4xl animate-pulse">⏳</div>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span className="truncate max-w-[200px]">{fileName}</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div
                className="bg-violet-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">Please don't close this tab</p>
        </div>
      )}

      {uploadState === 'success' && (
        <div className="border-2 border-green-800 bg-green-950/30 rounded-2xl p-16 flex flex-col items-center gap-3">
          <div className="text-5xl">✅</div>
          <p className="text-green-400 font-semibold">Upload complete! Redirecting to dashboard...</p>
        </div>
      )}

      {uploadState === 'error' && (
        <div className="border-2 border-red-800 bg-red-950/30 rounded-2xl p-12 flex flex-col items-center gap-4">
          <div className="text-5xl">❌</div>
          <p className="text-red-300 font-medium text-center">{errorMessage}</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
