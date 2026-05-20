import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClipCaption — AI Captions for TikTok',
  description: 'Upload a video, get TikTok captions, hashtags, hooks, and subtitles in seconds. Works with Darija, French & English.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <nav className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-lg tracking-tight hover:text-violet-400 transition-colors">
            🎬 ClipCaption
          </a>
          <span className="text-xs text-gray-600 font-mono">MVP v0.1</span>
        </nav>
        <main className="max-w-3xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  )
}
