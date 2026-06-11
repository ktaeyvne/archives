import { useState, useEffect, useCallback } from 'react'
import { Search, BookOpen, FileText, Layers, Upload, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { supabase, TABLE_NAME } from '../lib/supabase'
import SubjectCard from '../components/SubjectCard'
import { SkeletonSubjectCard, SkeletonStat } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import UploadModal from '../components/UploadModal'
import { SEMESTER_OPTIONS } from '../utils/helpers'

export default function HomePage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState('')
  const [filterSemester, setFilterSemester] = useState('')
  const [expandedSemesters, setExpandedSemesters] = useState({})

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setFiles(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  // Computed stats
  const totalFiles = files.length
  const totalSubjects = new Set(files.map(f => f.mata_kuliah)).size
  const totalSemesters = new Set(files.map(f => f.semester)).size

  // Filter files by search
  const filteredFiles = files.filter(f => {
    const q = search.toLowerCase()
    const matchSearch = !q || [f.judul, f.mata_kuliah, f.file_name, String(f.semester)]
      .some(v => v?.toLowerCase().includes(q))
    const matchSem = !filterSemester || f.semester === parseInt(filterSemester)
    return matchSearch && matchSem
  })

  // Group by semester → mata kuliah
  const grouped = filteredFiles.reduce((acc, file) => {
    const sem = file.semester
    if (!acc[sem]) acc[sem] = {}
    if (!acc[sem][file.mata_kuliah]) acc[sem][file.mata_kuliah] = []
    acc[sem][file.mata_kuliah].push(file)
    return acc
  }, {})

  const sortedSemesters = Object.keys(grouped).sort((a, b) => Number(a) - Number(b))

  const toggleSemester = (sem) => {
    setExpandedSemesters(prev => ({ ...prev, [sem]: !prev[sem] }))
  }

  // Auto-expand semesters on first load
  useEffect(() => {
    if (!loading && sortedSemesters.length > 0) {
      const initial = {}
      sortedSemesters.forEach(s => { initial[s] = true })
      setExpandedSemesters(initial)
    }
  }, [loading])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-full text-xs font-medium text-brand-700 dark:text-brand-400 mb-5">
          <BookOpen size={12} />
          Digital Archive
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white leading-tight tracking-tight mb-3">
          Miee Ayamm<br />
          <span className="text-brand-600 dark:text-brand-400">Archives</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-md mx-auto">
          Digital Library for College Assignments
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setShowUpload(true)}
            className="btn-primary h-10 px-5"
          >
            <Upload size={15} />
            Upload Tugas
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {loading ? (
          Array(3).fill(0).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          [
            { label: 'Total File', value: totalFiles, icon: FileText, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-50 dark:bg-brand-900/20' },
            { label: 'Mata Kuliah', value: totalSubjects, icon: BookOpen, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
            { label: 'Semester', value: totalSemesters, icon: Layers, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          ].map(stat => (
            <div key={stat.label} className="card p-4 sm:p-5 text-center">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              <p className={`font-display font-bold text-xl sm:text-2xl ${stat.color}`}>{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari tugas, mata kuliah, semester..."
            className="input-base pl-10"
          />
        </div>
        <div className="relative sm:w-44">
          <select
            value={filterSemester}
            onChange={e => setFilterSemester(e.target.value)}
            className="input-base appearance-none pr-8"
          >
            <option value="">Semua Semester</option>
            {SEMESTER_OPTIONS.map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Archive Tree */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="space-y-3">
              <div className="skeleton h-8 w-36 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array(4).fill(0).map((_, j) => <SkeletonSubjectCard key={j} />)}
              </div>
            </div>
          ))}
        </div>
      ) : sortedSemesters.length === 0 ? (
        <EmptyState type={search || filterSemester ? 'search' : 'files'} onUpload={() => setShowUpload(true)} />
      ) : (
        <div className="space-y-6">
          {sortedSemesters.map(sem => {
            const subjects = grouped[sem]
            const subjectList = Object.keys(subjects).sort()
            const isExpanded = expandedSemesters[sem] !== false

            return (
              <div key={sem} className="animate-slide-up">
                {/* Semester header */}
                <button
                  onClick={() => toggleSemester(sem)}
                  className="flex items-center gap-3 mb-4 group w-full text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-600 dark:bg-brand-700 flex items-center justify-center">
                      <span className="text-white font-display font-bold text-xs">{sem}</span>
                    </div>
                    <h2 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                      Semester {sem}
                    </h2>
                    <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {subjectList.length} matkul
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ml-auto ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                  />
                </button>

                {isExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-slide-down">
                    {subjectList.map(subject => (
                      <SubjectCard
                        key={subject}
                        subject={subject}
                        semester={sem}
                        fileCount={subjects[subject].length}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
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
