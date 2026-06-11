import { useState } from 'react'
import { X, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { supabase, BUCKET_NAME, TABLE_NAME } from '../lib/supabase'
import { useToast } from '../hooks/useToast'

const ADMIN_PASSWORD = 'ktaeyvne'

export default function DeleteModal({ file, onClose, onSuccess }) {
  const { addToast } = useToast()
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setError('')
    if (password !== ADMIN_PASSWORD) {
      setError('Password salah.')
      addToast('Password salah.', 'error')
      setPassword('')
      return
    }

    setDeleting(true)
    try {
      // Extract storage path from URL
      const urlParts = file.file_url.split(`/${BUCKET_NAME}/`)
      if (urlParts.length > 1) {
        const storagePath = urlParts[1]
        const { error: storageErr } = await supabase.storage.from(BUCKET_NAME).remove([storagePath])
        if (storageErr) console.warn('Storage delete error:', storageErr)
      }

      const { error: dbErr } = await supabase.from(TABLE_NAME).delete().eq('id', file.id)
      if (dbErr) throw dbErr

      addToast('File berhasil dihapus.', 'success')
      onSuccess?.()
      onClose()
    } catch (e) {
      console.error(e)
      addToast(`Gagal menghapus: ${e.message}`, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="p-6">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} className="text-red-600 dark:text-red-400" />
          </div>

          <h2 className="font-display font-semibold text-lg text-slate-900 dark:text-white text-center">Hapus File?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1 mb-5">
            Tindakan ini tidak dapat dibatalkan. File <span className="font-medium text-slate-700 dark:text-slate-300">"{file.judul}"</span> akan dihapus permanen.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password Admin
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleDelete()}
                  placeholder="Masukkan password admin"
                  className={`input-base pr-10 ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <X size={12} /> {error}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button onClick={onClose} className="btn-secondary" disabled={deleting}>Batal</button>
          <button onClick={handleDelete} className="btn-danger" disabled={deleting || !password}>
            {deleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Hapus File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
