import { X, Download, FileText, Image, Archive, File } from 'lucide-react'
import { getFileIcon } from '../utils/helpers'

function getPreviewType(file) {
  const type = (file.file_type || '').toLowerCase()
  const name = (file.file_name || '').toLowerCase()

  if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf'
  if (type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/.test(name)) return 'image'
  if (
    type.includes('word') || type.includes('docx') || type.includes('doc') ||
    type.includes('powerpoint') || type.includes('pptx') || type.includes('ppt') ||
    type.includes('excel') || type.includes('xlsx') || type.includes('xls') ||
    type.includes('spreadsheet') || type.includes('presentation') ||
    /\.(docx|doc|pptx|ppt|xlsx|xls)$/.test(name)
  ) return 'office'
  return 'none'
}

export default function PreviewModal({ file, onClose }) {
  const previewType = getPreviewType(file)

  // Google Docs Viewer untuk office files
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(file.file_url)}&embedded=true`

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
          <div className="min-w-0 mr-4">
            <h2 className="font-medium text-sm text-slate-900 dark:text-white truncate">{file.judul}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{file.mata_kuliah} · Semester {file.semester}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={file.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs h-8 px-3"
              onClick={e => e.stopPropagation()}
            >
              <Download size={13} />
              Unduh
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden rounded-b-2xl">

          {/* PDF */}
          {previewType === 'pdf' && (
            <iframe
              src={file.file_url}
              className="w-full h-full"
              style={{ minHeight: '70vh' }}
              title={file.judul}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          )}

          {/* Image */}
          {previewType === 'image' && (
            <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900" style={{ minHeight: '70vh' }}>
              <img
                src={file.file_url}
                alt={file.judul}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Office files via Google Docs Viewer */}
          {previewType === 'office' && (
            <div className="flex flex-col" style={{ minHeight: '70vh' }}>
              <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800 px-4 py-2 flex items-center gap-2">
                <span className="text-xs text-amber-700 dark:text-amber-400">
                  Preview via Google Docs Viewer — butuh koneksi internet
                </span>
              </div>
              <iframe
                src={googleViewerUrl}
                className="w-full flex-1"
                style={{ minHeight: '65vh' }}
                title={file.judul}
                frameBorder="0"
              />
            </div>
          )}

          {/* Tidak bisa preview */}
          {previewType === 'none' && (
            <div className="flex flex-col items-center justify-center p-12 text-center" style={{ minHeight: '40vh' }}>
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <File size={24} className="text-slate-400" />
              </div>
              <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                Preview tidak tersedia
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Tipe file <span className="font-mono font-medium">{file.file_type || 'ini'}</span> tidak bisa ditampilkan di browser.
              </p>
              <a
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Download size={14} />
                Unduh File
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}