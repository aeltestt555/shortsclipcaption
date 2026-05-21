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
            <p className="text-lg font-semibold text-white">اسحب الفيديو هنا</p>
            <p className="text-sm text-gray-400 mt-1">أو اضغط للاختيار — ملفات MP4 و MOV و WebM حتى 200MB</p>
          </div>
          <span className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-semibold transition-colors">
اختر الفيديو          </span>
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
// 'use client'

// import { useState, useCallback, useRef } from 'react'
// import { useRouter } from 'next/navigation'

// type UploadState = 'idle' | 'uploading' | 'success' | 'error'

// const UploadIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
//     <polyline points="17 8 12 3 7 8"/>
//     <line x1="12" y1="3" x2="12" y2="15"/>
//   </svg>
// )

// const VideoIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="23 7 16 12 23 17 23 7"/>
//     <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
//   </svg>
// )

// export default function UploadZone() {
//   const [uploadState, setUploadState] = useState<UploadState>('idle')
//   const [progress, setProgress] = useState(0)
//   const [errorMessage, setErrorMessage] = useState('')
//   const [dragOver, setDragOver] = useState(false)
//   const [fileName, setFileName] = useState('')
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const router = useRouter()

//   const handleUpload = useCallback(async (file: File) => {
//     const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
//     if (!allowedTypes.includes(file.type)) {
//       setErrorMessage('Invalid file type. Use MP4, MOV, WebM or AVI.')
//       setUploadState('error')
//       return
//     }
//     if (file.size > 200 * 1024 * 1024) {
//       setErrorMessage('File too large. Maximum is 200MB.')
//       setUploadState('error')
//       return
//     }

//     setFileName(file.name)
//     setUploadState('uploading')
//     setProgress(0)
//     setErrorMessage('')

//     const formData = new FormData()
//     formData.append('video', file)

//     const xhr = new XMLHttpRequest()
//     xhr.upload.onprogress = (e) => {
//       if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
//     }
//     xhr.onload = () => {
//       if (xhr.status === 201) {
//         const data = JSON.parse(xhr.responseText)
//         setUploadState('success')
//         router.push(`/dashboard?jobId=${data.jobId}`)
//       } else {
//         const data = JSON.parse(xhr.responseText)
//         setErrorMessage(data.error ?? 'Upload failed')
//         setUploadState('error')
//       }
//     }
//     xhr.onerror = () => {
//       setErrorMessage('Network error. Please try again.')
//       setUploadState('error')
//     }
//     xhr.open('POST', '/api/upload')
//     xhr.send(formData)
//   }, [router])

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setDragOver(false)
//     const file = e.dataTransfer.files[0]
//     if (file) handleUpload(file)
//   }, [handleUpload])

//   const reset = () => {
//     setUploadState('idle')
//     setProgress(0)
//     setErrorMessage('')
//     setFileName('')
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   const zoneBase: React.CSSProperties = {
//     width: '100%',
//     borderRadius: '20px',
//     border: '1px solid',
//     transition: 'all 0.25s ease',
//     position: 'relative',
//     overflow: 'hidden',
//   }

//   if (uploadState === 'idle') {
//     return (
//       <>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
//           onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
//           style={{ display: 'none' }}
//           id="video-input"
//         />
//         <label
//           htmlFor="video-input"
//           onDrop={handleDrop}
//           onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
//           onDragLeave={() => setDragOver(false)}
//           style={{
//             ...zoneBase,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: '20px',
//             padding: '72px 40px',
//             cursor: 'pointer',
//             borderColor: dragOver ? 'var(--accent)' : 'var(--border-strong)',
//             background: dragOver
//               ? 'var(--accent-dim)'
//               : 'var(--bg-surface)',
//           }}
//         >
//           {/* Corner accents */}
//           {[
//             { top: 0, left: 0, borderTop: '2px solid', borderLeft: '2px solid', borderRadius: '20px 0 0 0' },
//             { top: 0, right: 0, borderTop: '2px solid', borderRight: '2px solid', borderRadius: '0 20px 0 0' },
//             { bottom: 0, left: 0, borderBottom: '2px solid', borderLeft: '2px solid', borderRadius: '0 0 0 20px' },
//             { bottom: 0, right: 0, borderBottom: '2px solid', borderRight: '2px solid', borderRadius: '0 0 20px 0' },
//           ].map((s, i) => (
//             <div key={i} style={{
//               position: 'absolute',
//               width: '24px',
//               height: '24px',
//               borderColor: dragOver ? 'var(--accent)' : 'var(--border-strong)',
//               ...s,
//               transition: 'border-color 0.25s',
//             }} />
//           ))}

//           <div style={{
//             width: '64px',
//             height: '64px',
//             borderRadius: '16px',
//             background: dragOver ? 'var(--accent)' : 'var(--bg-raised)',
//             border: '1px solid var(--border-strong)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: dragOver ? 'var(--accent-text)' : 'var(--text-secondary)',
//             transition: 'all 0.25s',
//           }}>
//             <UploadIcon />
//           </div>

//           <div style={{ textAlign: 'center' }}>
//             <p style={{
//               fontFamily: 'var(--font-display)',
//               fontSize: '22px',
//               fontWeight: 700,
//               color: 'var(--text-primary)',
//               marginBottom: '6px',
//               letterSpacing: '-0.02em',
//             }}>
//               {dragOver ? 'Drop it' : 'Drop your video'}
//             </p>
//             <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300 }}>
//               or click to browse your files
//             </p>
//           </div>

//           <div style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '8px',
//             padding: '12px 28px',
//             background: 'var(--accent)',
//             color: 'var(--accent-text)',
//             borderRadius: '12px',
//             fontSize: '14px',
//             fontWeight: 700,
//             fontFamily: 'var(--font-display)',
//             letterSpacing: '-0.01em',
//           }}>
//             <VideoIcon />
//             Choose Video
//           </div>
//         </label>
//       </>
//     )
//   }

//   if (uploadState === 'uploading') {
//     return (
//       <div style={{
//         ...zoneBase,
//         borderColor: 'var(--border)',
//         background: 'var(--bg-surface)',
//         padding: '56px 40px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '28px',
//       }}>
//         <div style={{
//           fontFamily: 'var(--font-display)',
//           fontSize: '20px',
//           fontWeight: 700,
//           color: 'var(--text-primary)',
//           letterSpacing: '-0.02em',
//         }}>
//           Uploading...
//         </div>

//         <div style={{ width: '100%', maxWidth: '360px' }}>
//           {/* Track */}
//           <div style={{
//             width: '100%',
//             height: '3px',
//             background: 'var(--bg-raised)',
//             borderRadius: '99px',
//             overflow: 'hidden',
//             marginBottom: '12px',
//           }}>
//             <div style={{
//               height: '100%',
//               width: `${progress}%`,
//               background: 'var(--accent)',
//               borderRadius: '99px',
//               transition: 'width 0.3s ease',
//             }} />
//           </div>

//           <div style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}>
//             <span style={{
//               fontSize: '12px',
//               color: 'var(--text-muted)',
//               maxWidth: '240px',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               whiteSpace: 'nowrap',
//               fontWeight: 300,
//             }}>{fileName}</span>
//             <span style={{
//               fontFamily: 'var(--font-display)',
//               fontSize: '20px',
//               fontWeight: 800,
//               color: 'var(--accent)',
//             }}>{progress}%</span>
//           </div>
//         </div>

//         <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 300 }}>
//           Keep this tab open
//         </p>
//       </div>
//     )
//   }

//   if (uploadState === 'success') {
//     return (
//       <div style={{
//         ...zoneBase,
//         borderColor: 'rgba(69,255,154,0.2)',
//         background: 'rgba(69,255,154,0.04)',
//         padding: '56px 40px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '16px',
//       }}>
//         <div style={{
//           width: '48px', height: '48px',
//           borderRadius: '50%',
//           background: 'rgba(69,255,154,0.15)',
//           border: '1px solid rgba(69,255,154,0.3)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <polyline points="20 6 9 17 4 12"/>
//           </svg>
//         </div>
//         <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>
//           Upload complete
//         </p>
//         <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 300 }}>Redirecting to your dashboard...</p>
//       </div>
//     )
//   }

//   // Error
//   return (
//     <div style={{
//       ...zoneBase,
//       borderColor: 'rgba(255,69,69,0.2)',
//       background: 'rgba(255,69,69,0.04)',
//       padding: '48px 40px',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       gap: '16px',
//     }}>
//       <div style={{
//         width: '48px', height: '48px',
//         borderRadius: '50%',
//         background: 'rgba(255,69,69,0.15)',
//         border: '1px solid rgba(255,69,69,0.3)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//       }}>
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <line x1="18" y1="6" x2="6" y2="18"/>
//           <line x1="6" y1="6" x2="18" y2="18"/>
//         </svg>
//       </div>
//       <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--red)', letterSpacing: '-0.02em' }}>
//         Upload failed
//       </p>
//       <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '320px' }}>
//         {errorMessage}
//       </p>
//       <button
//         onClick={reset}
//         style={{
//           marginTop: '8px',
//           padding: '10px 24px',
//           background: 'var(--bg-raised)',
//           border: '1px solid var(--border-strong)',
//           borderRadius: '10px',
//           color: 'var(--text-primary)',
//           fontSize: '14px',
//           fontWeight: 500,
//           cursor: 'pointer',
//           fontFamily: 'var(--font-display)',
//         }}
//       >
//         Try again
//       </button>
//     </div>
//   )
// }
