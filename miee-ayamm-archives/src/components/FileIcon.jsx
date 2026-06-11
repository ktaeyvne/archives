import { FileText, Image, Archive, File, Table, Presentation } from 'lucide-react'
import { getFileIcon } from '../utils/helpers'

const configs = {
  pdf: { icon: FileText, bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'PDF' },
  doc: { icon: FileText, bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'DOC' },
  ppt: { icon: Presentation, bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', label: 'PPT' },
  xls: { icon: Table, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'XLS' },
  img: { icon: Image, bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', label: 'IMG' },
  zip: { icon: Archive, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', label: 'ZIP' },
  file: { icon: File, bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', label: 'FILE' },
}

export default function FileIcon({ fileType, fileName, size = 'md' }) {
  const key = getFileIcon(fileType || fileName)
  const config = configs[key] || configs.file
  const Icon = config.icon

  const sizes = {
    sm: { wrap: 'w-8 h-8', icon: 12 },
    md: { wrap: 'w-10 h-10', icon: 16 },
    lg: { wrap: 'w-14 h-14', icon: 22 },
  }
  const s = sizes[size] || sizes.md

  return (
    <div className={`${s.wrap} rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
      <Icon size={s.icon} className={config.text} />
    </div>
  )
}

export function FileBadge({ fileType, fileName }) {
  const key = getFileIcon(fileType || fileName)
  const config = configs[key] || configs.file
  return (
    <span className={`badge ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
