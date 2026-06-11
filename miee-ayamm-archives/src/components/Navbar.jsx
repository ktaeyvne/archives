import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, Search, BookOpen, Upload } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useState } from 'react'
import UploadModal from './UploadModal'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const [showUpload, setShowUpload] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-display font-700 text-base text-slate-900 dark:text-white hidden sm:block">
                Miee Ayamm
              </span>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Cari tugas, mata kuliah, semester..."
                  className="input-base pl-10 h-9 text-sm"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link to="/search" className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                <Search size={18} />
              </Link>
              <button
                onClick={() => setShowUpload(true)}
                className="btn-primary h-9 text-xs sm:text-sm"
              >
                <Upload size={14} />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  )
}
