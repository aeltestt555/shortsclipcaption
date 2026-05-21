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
        حوّل فيديوهاتك إلى   <br />
          <span className="text-violet-400">محتوى تيك توك ينتشر بسرعة</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
         ارفع فيديو → واحصل على كابشنات، هاشتاغات، هوكات وترجمات في ثوانٍ. يدعم
<span className="text-white font-medium"> الدارجة، الفرنسية والإنجليزية.  </span>.
        </p>
      </div>

      <UploadZone />

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { icon: '🎙️', label: 'تفريغ صوتي بالذكاء الاصطناعي', sub: 'Whisper عبر Groq' },
          { icon: '✍️', label: 'كابشنات تيك توك', sub: 'الدارجة • الفرنسية • الإنجليزية' },
          { icon: '📄', label: 'ترجمة SRT', sub: 'تحميل فوري' },
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
