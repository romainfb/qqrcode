import { useState } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export type ToastType = 'success' | 'error' | 'info'

export function useToast(): {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
} {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = 'info'): void => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
