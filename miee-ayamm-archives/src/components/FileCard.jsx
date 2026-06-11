import { useState } from 'react'
import { Eye, Download, Link, Share2, Trash2, QrCode, MoreHorizontal, ChevronDown } from 'lucide-react'
import { formatFileSize, formatDate } from '../utils/helpers'
import FileIcon, { FileBadge } from './FileIcon'
import DeleteModal from './DeleteModal'
import PreviewModal from './PreviewModal'
import QRModal from './QRModal'
import { useToast } from '../hooks/useToast'
import { supabase, TABLE_NAME } from '../lib/supabase'

export default function FileCard({ file, onRefresh, compact = false }) {
  const { addToast } = useToast()
  const [showDelete, setShowDelete] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(file.file_url)
      addToast('Link berhasil disalin!', 'success')
    } catch {
      addToast('Gagal menyalin link', 'error')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: file.judul, text: `${file.judul} - ${file.mata_kuliah}`, url: file.file_url })
      } catch {}
    } else {
      handleCopyLink()
    }
  }

  const handleDownload = async () => {
    await supabase.from(TABLE_NAME).update({ download_count: (file.download_count || 0) + 1 }).eq('id', file.id)
    const link = document.createElement('a')
    link.href = file.file_url
    link.download = file.file_name || file.judul
    link.target = '_blank'
    link.click()
  }

  const handlePreview = async () => {
    await supabase.from(TABLE_NAME).update({ view_count: (file.view_count || 0) + 1 }).eq('id', file.id)
    setShowPreview(true)
  }

  return (
    <>
      <div className="card p-4 sm:p-5 hover:shadow-md transition-all duration-200 animate-fade-in group">
        <div className="flex items-start gap-3 sm:gap-4">
          <FileIcon fileType={file.file_type} fileName={file.file_name} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm text-slate-900 dark:text-white leading-tight truncate pr-2">
                  {file.judul}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{file.mata_kuliah}</span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Sem. {file.semester}</span>
                </div>
              </div>
              <FileBadge fileType={file.file_type} fileName={file.file_name} />
            </div>

            {file.deskripsi && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {file.deskripsi}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-slate-400">{formatFileSize(file.file_size)}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-400">{formatDate(file.created_at)}</span>
              {file.view_count > 0 && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-xs text-slate-400">{file.view_count} dilihat</span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <button
                onClick={handlePreview}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 rounded-lg text-xs font-medium transition-colors"
              >
                <Eye size={12} />
                Preview
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-medium transition-colors"
              >
                <Download size={12} />
                Unduh
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium transition-colors"
              >
                <Link size={12} />
                Salin
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium transition-colors"
              >
                <Share2 size={12} />
                Bagikan
              </button>

              {/* More menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMore(p => !p)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium transition-colors"
                >
                  <MoreHorizontal size={14} />
                </button>
                {showMore && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMore(false)} />
                    <div className="absolute right-0 bottom-full mb-1 z-20 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl py-1 min-w-[140px] animate-slide-down">
                      <button
                        onClick={() => { setShowQR(true); setShowMore(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <QrCode size={13} />
                        QR Code
                      </button>
                      <div className="border-t border-[var(--border)] my-1" />
                      <button
                        onClick={() => { setShowDelete(true); setShowMore(false) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={13} />
                        Hapus
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDelete && <DeleteModal file={file} onClose={() => setShowDelete(false)} onSuccess={onRefresh} />}
      {showPreview && <PreviewModal file={file} onClose={() => setShowPreview(false)} />}
      {showQR && <QRModal file={file} onClose={() => setShowQR(false)} />}
    </>
  )
}
