import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const toastId = ++id
    setToasts(prev => [...prev, { id: toastId, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId))
    }, duration)
  }, [])

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-up"
          onClick={() => removeToast(toast.id)}
        >
          <div className={`
            flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg cursor-pointer
            border text-sm font-medium max-w-sm
            ${toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : ''}
            ${toast.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300' : ''}
            ${toast.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300' : ''}
            ${toast.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300' : ''}
          `}>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
