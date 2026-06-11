import { FolderOpen, Upload, Search } from 'lucide-react'

export default function EmptyState({ type = 'files', onUpload }) {
  const configs = {
    files: {
      icon: FolderOpen,
      title: 'Belum ada file',
      desc: 'Jadilah yang pertama mengupload tugas ke mata kuliah ini.',
      action: onUpload ? { label: 'Upload File', onClick: onUpload } : null,
    },
    search: {
      icon: Search,
      title: 'Tidak ditemukan',
      desc: 'Coba kata kunci lain atau ubah filter pencarian.',
      action: null,
    },
    semester: {
      icon: FolderOpen,
      title: 'Semester ini kosong',
      desc: 'Belum ada tugas yang diupload untuk semester ini.',
      action: onUpload ? { label: 'Upload Sekarang', onClick: onUpload } : null,
    },
  }

  const cfg = configs[type] || configs.files
  const Icon = cfg.icon

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="font-display font-semibold text-base text-slate-700 dark:text-slate-300 mb-1">{cfg.title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs">{cfg.desc}</p>
      {cfg.action && (
        <button onClick={cfg.action.onClick} className="btn-primary mt-5">
          <Upload size={14} />
          {cfg.action.label}
        </button>
      )}
    </div>
  )
}
