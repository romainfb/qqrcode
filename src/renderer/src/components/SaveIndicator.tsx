import { JSX } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved'

interface SaveIndicatorProps {
  status: SaveStatus
}

function SaveIndicator({ status }: SaveIndicatorProps): JSX.Element | null {
  if (status === 'idle') return null

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-zinc-700 text-zinc-200 text-sm flex items-center gap-2 shadow-lg">
      {status === 'saving' ? (
        <>
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Sauvegarde...
        </>
      ) : (
        <>
          <span className="w-2 h-2 bg-white rounded-full" />
          Sauvegardé
        </>
      )}
    </div>
  )
}

export default SaveIndicator

