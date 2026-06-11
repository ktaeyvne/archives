import { BookOpen, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-slate-900 dark:text-white leading-tight">Miee Ayamm Archives</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Digital Library for College Assignments</p>
            </div>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
            © {new Date().getFullYear()} Miee Ayamm Archives. Made with
            <Heart size={12} className="text-red-400 fill-red-400 mx-0.5" />
          </p>
        </div>
      </div>
    </footer>
  )
}
