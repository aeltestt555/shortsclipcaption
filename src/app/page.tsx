// import UploadZone from "../components/UploadZone"

// UploadZone
// export default function Home() {
//   return (
//     <div className="space-y-10">
//       <div className="text-center space-y-4 pt-4">
//         <div className="inline-block px-3 py-1 bg-violet-900/50 text-violet-300 rounded-full text-xs font-medium tracking-wide">
//           MVP v0.1 — Free Stack
//         </div>
//         <h1 className="text-4xl font-bold leading-tight">
//         حوّل فيديوهاتك إلى   <br />
//           <span className="text-violet-400">محتوى تيك توك ينتشر بسرعة</span>
//         </h1>
//         <p className="text-gray-400 text-lg max-w-xl mx-auto">
//          ارفع فيديو → واحصل على كابشنات، هاشتاغات، هوكات وترجمات في ثوانٍ. يدعم
// <span className="text-white font-medium"> الدارجة، الفرنسية والإنجليزية.  </span>.
//         </p>
//       </div>

//       <UploadZone />

//       <div className="grid grid-cols-3 gap-4 text-center">
//         {[
//           { icon: '🎙️', label: 'تفريغ صوتي بالذكاء الاصطناعي', sub: 'Whisper عبر Groq' },
//           { icon: '✍️', label: 'كابشنات تيك توك', sub: 'الدارجة • الفرنسية • الإنجليزية' },
//           { icon: '📄', label: 'ترجمة SRT', sub: 'تحميل فوري' },
//         ].map(({ icon, label, sub }) => (
//           <div key={label} className="bg-gray-900 rounded-2xl p-5 space-y-1">
//             <div className="text-3xl">{icon}</div>
//             <div className="text-sm font-semibold text-white">{label}</div>
//             <div className="text-xs text-gray-500">{sub}</div>
//           </div>
//         ))}
//       </div>

//       <p className="text-center text-xs text-gray-600">
//         Supports MP4 • MOV • WebM • AVI — up to 200MB
//       </p>
//     </div>
//   )
// }

'use client'
import UploadZone from '../components/UploadZone'

const features = [
  {
    label: 'Speech to text',
    sub: 'Whisper Large v3 via Groq',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="8" y1="22" x2="16" y2="22"/>
      </svg>
    ),
  },
  {
    label: 'TikTok captions',
    sub: 'Darija · French · English',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: 'SRT subtitles',
    sub: 'Timestamped, ready to import',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="animate-fade-up" style={{ marginBottom: '56px', paddingTop: '16px' }}>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '24px',
          border: '1px solid var(--border)',
          borderRadius: '99px',
          padding: '4px 12px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          Free — No credit card
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(42px, 7vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.0,
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          حوّل فيديوهاتك
          <br />
          <span style={{ color: 'var(--accent)' }}>لمحتوى ينتشر</span>
        </h1>

        <p style={{
          fontFamily: 'var(--font-arabic)',
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '480px',
          lineHeight: 1.7,
          direction: 'rtl',
          textAlign: 'right',
          marginBottom: '12px',
        }}>
          ارفع فيديو واحصل على كابشنات تيك توك، هاشتاغات، هوكات وترجمات في ثوانٍ.
        </p>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-muted)',
          fontWeight: 300,
        }}>
          Darija · Français · English — all detected automatically
        </p>
      </div>

      {/* Upload */}
      <div className="animate-fade-up animate-fade-up-1" style={{ marginBottom: '48px' }}>
        <UploadZone />
      </div>

      {/* Feature pills */}
      <div className="animate-fade-up animate-fade-up-2" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '48px',
      }}>
        {features.map(({ label, sub, icon }) => (
          <div key={label} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s, background 0.2s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)'
              ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-raised)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
              ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'
            }}
          >
            <div style={{
              color: 'var(--accent)',
              marginBottom: '12px',
              display: 'flex',
            }}>
              {icon}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}>{label}</div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontWeight: 300,
            }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Formats */}
      <div className="animate-fade-up animate-fade-up-3" style={{
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
        letterSpacing: '0.06em',
      }}>
        MP4 · MOV · WEBM · AVI &nbsp;·&nbsp; Max 200MB
      </div>
    </div>
  )
}
