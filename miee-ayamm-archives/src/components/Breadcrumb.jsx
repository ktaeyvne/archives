import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
        <Home size={14} />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={13} className="text-slate-300 dark:text-slate-600 shrink-0" />
          {item.href ? (
            <Link to={item.href} className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate max-w-[140px] sm:max-w-none">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-white font-medium truncate max-w-[140px] sm:max-w-none">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
