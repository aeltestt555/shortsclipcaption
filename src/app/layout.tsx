// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'ClipCaption — AI Captions for TikTok',
//   description: 'Upload a video, get TikTok captions, hashtags, hooks, and subtitles in seconds. Works with Darija, French & English.',
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
//         <nav className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between">
//           <a href="/" className="font-bold text-lg tracking-tight hover:text-violet-400 transition-colors">
//             🎬 ClipCaption
//           </a>
//           <span className="text-xs text-gray-600 font-mono">MVP v0.1</span>
//         </nav>
//         <main className="max-w-3xl mx-auto px-6 py-10">
//           {children}
//         </main>
//       </body>
//     </html>
//   )
// }


import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClipCaption — AI Content for TikTok Creators',
  description: 'Upload a video. Get viral TikTok captions, hashtags, hooks & subtitles instantly. Built for Darija, French & English creators.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body style={{ position: 'relative', zIndex: 1 }}>
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8,8,8,0.85)',
          backdropFilter: 'blur(20px)',
          padding: '0 32px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <a href="/" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              background: 'var(--accent)',
              borderRadius: '6px',
            }} />
            ClipCaption
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              color: 'var(--accent)',
              background: 'var(--accent-dim)',
              border: '1px solid rgba(232,255,71,0.2)',
              borderRadius: '99px',
              padding: '3px 10px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Beta
            </span>
          </div>
        </nav>

        <main style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
