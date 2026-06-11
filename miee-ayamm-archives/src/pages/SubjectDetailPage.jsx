import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, SlidersHorizontal, ChevronDown, BookOpen, Files } from 'lucide-react'
import { supabase, TABLE_NAME } from '../lib/supabase'
import FileCard from '../components/FileCard'
import { SkeletonCard } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import Breadcrumb from '../components/Breadcrumb'
import UploadModal from '../components/UploadModal'
import { formatFileSize } from '../utils/helpers'

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

export default function SubjectDetailPage() {
  const { semester, subject } = useParams()
  const navigate = useNavigate()
  const decodedSubject = decodeURIComponent(subject)

  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [sort, setSort] = useState('newest')
  const [fileType, setFileType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('semester', parseInt(semester))
        .eq('mata_kuliah', decodedSubject)
      if (error) throw error
      setFiles(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [semester, decodedSubject])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  // Sort & filter
  let displayed = [...files]

  if (fileType) {
    displayed = displayed.filter(f => {
      const t = (f.file_type || f.file_name || '').toLowerCase()
      if (fileType === 'pdf') return t.includes('pdf')
      if (fileType === 'doc') return t.includes('doc') || t.includes('word')
      if (fileType === 'ppt') return t.includes('ppt') || t.includes('presentation')
      if (fileType === 'xls') return t.includes('xls') || t.includes('excel') || t.includes('spreadsheet')
      if (fileType === 'image') return t.includes('image') || t.includes('jpg') || t.includes('png')
      if (fileType === 'zip') return t.includes('zip') || t.includes('rar') || t.includes('archive')
      return true
    })
  }

  if (sort === 'newest') displayed.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  if (sort === 'oldest') displayed.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  if (sort === 'name_az') displayed.sort((a, b) => a.judul.localeCompare(b.judul))

  const totalSize = files.reduce((acc, f) => acc + (f.file_size || 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
        <Breadcrumb items={[
          { label: `Semester ${semester}`, href: '/' },
          { label: decodedSubject },
        ]} />
      </div>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-slate-900 dark:text-white leading-tight">
                {decodedSubject}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Semester {semester}</p>
              {!loading && (
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Files size={13} className="text-slate-400" />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{files.length} file</span>
                  </div>
                  {totalSize > 0 && (
                    <span className="text-xs text-slate-400">{formatFileSize(totalSize)} total</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setShowUpload(true)} className="btn-primary shrink-0">
            <Upload size={14} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {displayed.length} file{displayed.length !== 1 ? 's' : ''} ditemukan
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={fileType}
              onChange={e => setFileType(e.target.value)}
              className="input-base h-8 text-xs appearance-none pr-7 py-0 w-36"
            >
              {FILE_TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-base h-8 text-xs appearance-none pr-7 py-0 w-28"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Files */}
      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState
          type={fileType ? 'search' : 'files'}
          onUpload={fileType ? undefined : () => setShowUpload(true)}
        />
      ) : (
        <div className="space-y-3">
          {displayed.map(file => (
            <FileCard key={file.id} file={file} onRefresh={fetchFiles} />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={fetchFiles}
        />
      )}
    </div>
  )
}
