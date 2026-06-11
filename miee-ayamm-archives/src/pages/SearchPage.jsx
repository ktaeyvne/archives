import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, ChevronDown } from 'lucide-react'
import { supabase, TABLE_NAME } from '../lib/supabase'
import FileCard from '../components/FileCard'
import { SkeletonCard } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Breadcrumb from '../components/Breadcrumb'
import { SEMESTER_OPTIONS } from '../utils/helpers'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'name_az', label: 'Nama A–Z' },
]

const FILE_TYPE_OPTIONS = [
  { value: '', label: 'Semua Jenis' },
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'DOCX/DOC' },
  { value: 'ppt', label: 'PPTX/PPT' },
  { value: 'xls', label: 'XLSX/XLS' },
  { value: 'image', label: 'Gambar' },
  { value: 'zip', label: 'ZIP/RAR' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [files, setFiles] = useState([])
  const [allFiles, setAllFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [filterSem, setFilterSem] = useState('')
  const [filterType, setFilterType] = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('*').order('created_at', { ascending: false })
      if (error) throw error
      setAllFiles(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  useEffect(() => {
    const q = query.toLowerCase()
    let result = allFiles.filter(f => {
      const matchQ = !q || [f.judul, f.mata_kuliah, f.file_name, String(f.semester), f.deskripsi]
        .some(v => v?.toLowerCase().includes(q))
      const matchSem = !filterSem || f.semester === parseInt(filterSem)
      const matchType = !filterType || (() => {
        const t = (f.file_type || f.file_name || '').toLowerCase()
        if (filterType === 'pdf') return t.includes('pdf')
        if (filterType === 'doc') return t.includes('doc') || t.includes('word')
        if (filterType === 'ppt') return t.includes('ppt') || t.includes('presentation')
        if (filterType === 'xls') return t.includes('xls') || t.includes('excel') || t.includes('spreadsheet')
        if (filterType === 'image') return t.includes('image') || t.includes('jpg') || t.includes('png')
        if (filterType === 'zip') return t.includes('zip') || t.includes('rar')
        return true
      })()
      return matchQ && matchSem && matchType
    })

    if (sort === 'newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    if (sort === 'oldest') result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    if (sort === 'name_az') result.sort((a, b) => a.judul.localeCompare(b.judul))

    setFiles(result)
  }, [query, allFiles, sort, filterSem, filterType])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) setSearchParams({ q: query.trim() })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <Breadcrumb items={[{ label: 'Pencarian' }]} />
      </div>

      <h1 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-5">Pencarian</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari tugas, mata kuliah, semester, nama file..."
            className="input-base pl-11 h-11"
            autoFocus
          />
        </div>
      </form>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <div className="relative">
          <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="input-base h-8 text-xs appearance-none pr-7 py-0 w-36">
            <option value="">Semua Semester</option>
            {SEMESTER_OPTIONS.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-base h-8 text-xs appearance-none pr-7 py-0 w-36">
            {FILE_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-base h-8 text-xs appearance-none pr-7 py-0 w-32">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        {(query || filterSem || filterType) && (
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
            {files.length} hasil
          </span>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : files.length === 0 ? (
        <EmptyState type="search" />
      ) : (
        <div className="space-y-3">
          {files.map(file => (
            <FileCard key={file.id} file={file} onRefresh={fetchAll} />
          ))}
        </div>
      )}
    </div>
  )
}
