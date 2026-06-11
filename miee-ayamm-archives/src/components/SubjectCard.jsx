import { useNavigate } from 'react-router-dom'
import { BookOpen, FileText, ChevronRight } from 'lucide-react'

export default function SubjectCard({ subject, semester, fileCount }) {
  const navigate = useNavigate()

  const colors = [
    { bg: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    { bg: 'bg-violet-500', light: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400' },
    { bg: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    { bg: 'bg-orange-500', light: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
    { bg: 'bg-pink-500', light: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
    { bg: 'bg-teal-500', light: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
    { bg: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    { bg: 'bg-rose-500', light: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400' },
  ]

  const colorIdx = subject.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
  const color = colors[colorIdx]

  const initials = subject.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <button
      onClick={() => navigate(`/semester/${semester}/mata-kuliah/${encodeURIComponent(subject)}`)}
      className="card p-5 text-left w-full group hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color.light} flex items-center justify-center`}>
          <span className={`font-display font-bold text-sm ${color.text}`}>{initials}</span>
        </div>
        <span className={`badge ${color.light} ${color.text}`}>
          {fileCount} file{fileCount !== 1 ? 's' : ''}
        </span>
      </div>

      <h3 className="font-medium text-sm text-slate-900 dark:text-white leading-tight line-clamp-2 mb-1">
        {subject}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">Semester {semester}</p>

      <div className="flex items-center gap-1 mt-3 text-xs text-slate-400 dark:text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        <span>Lihat arsip</span>
        <ChevronRight size={12} />
      </div>
    </button>
  )
}
