import { useEffect, useRef } from 'react'
import { X, Download } from 'lucide-react'
import QRCode from 'qrcode'

export default function QRModal({ file, onClose }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && file.file_url) {
      QRCode.toCanvas(canvasRef.current, file.file_url, {
        width: 256,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      })
    }
  }, [file])

  const downloadQR = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `qr-${file.judul}.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="font-display font-semibold text-base text-slate-900 dark:text-white">QR Code</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 text-center space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 truncate font-medium">{file.judul}</p>
          <div className="flex justify-center">
            <div className="p-3 bg-white rounded-xl shadow-inner border border-slate-100">
              <canvas ref={canvasRef} />
            </div>
          </div>
          <p className="text-xs text-slate-400">Scan untuk membuka file</p>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-5">
          <button onClick={onClose} className="btn-secondary">Tutup</button>
          <button onClick={downloadQR} className="btn-primary">
            <Download size={14} />
            Simpan QR
          </button>
        </div>
      </div>
    </div>
  )
}
