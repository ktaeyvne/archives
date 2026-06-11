export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getFileIcon(fileType) {
  if (!fileType) return 'file'
  const type = fileType.toLowerCase()
  if (type.includes('pdf')) return 'pdf'
  if (type.includes('word') || type.includes('docx') || type.includes('doc')) return 'doc'
  if (type.includes('powerpoint') || type.includes('pptx') || type.includes('ppt')) return 'ppt'
  if (type.includes('excel') || type.includes('xlsx') || type.includes('xls') || type.includes('spreadsheet')) return 'xls'
  if (type.includes('image') || type.includes('jpg') || type.includes('jpeg') || type.includes('png') || type.includes('gif') || type.includes('webp')) return 'img'
  if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('archive')) return 'zip'
  return 'file'
}

export function getFileExtension(fileName) {
  if (!fileName) return ''
  return fileName.split('.').pop()?.toUpperCase() || ''
}

export function getFileTypeFromName(fileName) {
  if (!fileName) return 'unknown'
  const ext = fileName.split('.').pop()?.toLowerCase()
  const map = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
  }
  return map[ext] || 'application/octet-stream'
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function isPreviewable(fileType) {
  if (!fileType) return false
  return fileType.includes('pdf') || fileType.includes('image') || fileType.startsWith('image/')
}

export const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8]

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/vnd.rar': ['.rar'],
}

export const ACCEPT_STRING = Object.values(ACCEPTED_FILE_TYPES).flat().join(',')
