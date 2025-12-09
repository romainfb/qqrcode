import type { SaveStatus } from '@renderer/types'
import { SAVE_STATUS_LABELS } from '@renderer/types'

interface SaveIndicatorProps {
  status: SaveStatus
}

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') return null

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-zinc-700 text-zinc-200 text-sm flex items-center gap-2 shadow-lg">
      <span className={`w-2 h-2 bg-white rounded-full ${status === 'saving' ? 'animate-pulse' : ''}`} />
      {SAVE_STATUS_LABELS[status]}
    </div>
  )
}
