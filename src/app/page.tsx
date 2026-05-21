import UploadZone from "../components/UploadZone"

UploadZone
export default function Home() {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-4 pt-4">
        <div className="inline-block px-3 py-1 bg-violet-900/50 text-violet-300 rounded-full text-xs font-medium tracking-wide">
          MVP v0.1 — Free Stack
        </div>
        <h1 className="text-4xl font-bold leading-tight">
          Turn your videos into<br />
          <span className="text-violet-400">viral TikTok content</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Upload a video → get captions, hashtags, hooks & subtitles in seconds.
          Works with <span className="text-white font-medium">Darija, French & English</span>.
        </p>
      </div>

      <UploadZone />

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { icon: '🎙️', label: 'AI Transcription', sub: 'Whisper via Groq' },
          { icon: '✍️', label: 'TikTok Captions', sub: 'Darija • French • EN' },
          { icon: '📄', label: 'SRT Subtitles', sub: 'Download instantly' },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="bg-gray-900 rounded-2xl p-5 space-y-1">
            <div className="text-3xl">{icon}</div>
            <div className="text-sm font-semibold text-white">{label}</div>
            <div className="text-xs text-gray-500">{sub}</div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-600">
        Supports MP4 • MOV • WebM • AVI — up to 200MB
      </p>
    </div>
  )
}
