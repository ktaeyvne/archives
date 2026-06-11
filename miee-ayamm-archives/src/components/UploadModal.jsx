import { useState, useRef, useCallback } from 'react'
import { X, Upload, File, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'
import { supabase, BUCKET_NAME, TABLE_NAME } from '../lib/supabase'
import { useToast } from '../hooks/useToast'
import { formatFileSize, SEMESTER_OPTIONS, ACCEPT_STRING, getFileTypeFromName } from '../utils/helpers'

export default function UploadModal({ onClose, onSuccess }) {
  const { addToast } = useToast()
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [form, setForm] = useState({
    judul: '',
    semester: '',
    mata_kuliah: '',
    deskripsi: '',
  })

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    if (!form.judul) {
      setForm(prev => ({ ...prev, judul: f.name.replace(/\.[^/.]+$/, '') }))
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const validate = () => {
    if (!file) return 'Pilih file terlebih dahulu.'
    if (!form.judul.trim()) return 'Judul tugas wajib diisi.'
    if (!form.semester) return 'Semester wajib dipilih.'
    if (!form.mata_kuliah.trim()) return 'Mata kuliah wajib diisi.'
    return null
  }

  const handleUpload = async () => {
    const err = validate()
    if (err) { addToast(err, 'error'); return }

    setUploading(true)
    setProgress(10)

    try {
      const ext = file.name.split('.').pop()
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const path = `semester-${form.semester}/${form.mata_kuliah.replace(/\s+/g, '_')}/${safeName}`

      setProgress(30)

      const { data: storageData, error: storageErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (storageErr) throw storageErr

      setProgress(70)

      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)

      const { error: dbErr } = await supabase.from(TABLE_NAME).insert({
        judul: form.judul.trim(),
        semester: parseInt(form.semester),
        mata_kuliah: form.mata_kuliah.trim(),
        deskripsi: form.deskripsi.trim() || null,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: file.type || getFileTypeFromName(file.name),
        file_size: file.size,
        view_count: 0,
        download_count: 0,
      })

      if (dbErr) throw dbErr

      setProgress(100)
      addToast('File berhasil diupload! 🎉', 'success')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 800)
    } catch (e) {
      console.error(e)
      addToast(`Upload gagal: ${e.message}`, 'error')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Upload Tugas</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Tambahkan file ke arsip</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
              ${dragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
            `}
          >
            <input ref={fileInputRef} type="file" accept={ACCEPT_STRING} className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <div className="flex items-center gap-3 justify-center">
                <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="ml-auto p-1 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {dragging ? 'Lepaskan file di sini' : 'Klik atau seret file ke sini'}
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PPTX, XLSX, JPG, PNG, ZIP, RAR</p>
              </>
            )}
          </div>

          {/* Progress */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Mengupload...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Judul Tugas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.judul}
                onChange={e => handleChange('judul', e.target.value)}
                placeholder="cth. UTS Kimia Dasar 2024"
                className="input-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Semester <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.semester}
                    onChange={e => handleChange('semester', e.target.value)}
                    className="input-base appearance-none pr-8"
                  >
                    <option value="">Pilih</option>
                    {SEMESTER_OPTIONS.map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Mata Kuliah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.mata_kuliah}
                  onChange={e => handleChange('mata_kuliah', e.target.value)}
                  placeholder="cth. Kimia Dasar"
                  className="input-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi</label>
              <textarea
                value={form.deskripsi}
                onChange={e => handleChange('deskripsi', e.target.value)}
                placeholder="Deskripsi singkat tentang tugas ini..."
                rows={3}
                className="input-base resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)]">
          <button onClick={onClose} className="btn-secondary" disabled={uploading}>Batal</button>
          <button onClick={handleUpload} className="btn-primary" disabled={uploading || !file}>
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload size={14} />
                Upload File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
