import { JSX, useEffect, useState } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export type ToastType = 'success' | 'error' | 'info'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps): JSX.Element {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({
  toast,
  onRemove
}: {
  toast: Toast
  onRemove: (id: string) => void
}): JSX.Element {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let mounted = true
    // use requestAnimationFrame to avoid triggering setState synchronously in effect
    const raf = requestAnimationFrame(() => {
      if (mounted) setIsVisible(true)
    })
    const timer = setTimeout(() => {
      if (!mounted) return
      setIsVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 3000)
    return () => {
      mounted = false
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [toast.id, onRemove])

  const bgColor = {
    success: 'bg-green-800',
    error: 'bg-red-800',
    info: 'bg-zinc-700'
  }[toast.type]

  return (
    <div
      className={`px-4 py-2 rounded-xl text-white text-sm shadow-lg transition-all duration-300 ${bgColor} ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      {toast.message}
    </div>
  )
}
