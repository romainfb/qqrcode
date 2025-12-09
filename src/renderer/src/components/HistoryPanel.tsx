import { useEffect, useState } from 'react'
import type { QRCodeData } from '../types'

interface HistoryPanelProps {
  history: QRCodeData[]
  onSelect: (item: QRCodeData) => void
  selectedId: string | null
  onClear: () => void
}

interface HistoryItemProps {
  item: QRCodeData | undefined
  index: number
  isSelected: boolean
  onSelect: (item: QRCodeData) => void
}

function HistoryItem({ item, index, isSelected, onSelect }: HistoryItemProps) {
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>()

  useEffect(() => {
    if (item?.imagePath) {
      window.api.asset.load(item.imagePath).then(setImageDataUrl).catch(console.error)
    } else {
      setImageDataUrl(undefined)
    }
  }, [item?.imagePath])

  return (
    <button
      onClick={() => item && onSelect(item)}
      disabled={!item}
      style={item ? { backgroundColor: item.settings.backgroundColor } : undefined}
      className={`
        aspect-square rounded-2xl flex items-center justify-center
        transition-all text-xs font-medium
        ${item
          ? isSelected
            ? 'ring-2 ring-white shadow-lg cursor-pointer'
            : 'hover:opacity-80 shadow-md cursor-pointer'
          : 'bg-zinc-800/50 border border-dashed border-zinc-700 cursor-not-allowed'
        }
      `}
    >
      {item && imageDataUrl ? (
        <img src={imageDataUrl} alt={`QR #${index + 1}`} className="w-full h-full object-contain p-2 rounded-2xl" />
      ) : (
        <span className="text-zinc-600">#{index + 1}</span>
      )}
    </button>
  )
}

export default function HistoryPanel({ history, onSelect, selectedId, onClear }: HistoryPanelProps) {
  return (
    <aside className="w-32 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-4">
      <h2 className="text-zinc-400 text-sm font-medium border-b border-zinc-800 pb-2">Historique</h2>

      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((index) => {
          const item = history[index]
          const isSelected = item && selectedId === item.id

          return (
            <HistoryItem
              key={index}
              item={item}
              index={index}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          )
        })}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-zinc-600">{history.length}/3</span>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-zinc-600 hover:text-red-400 transition-colors p-1"
            title="Effacer l'historique"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        )}
      </div>
    </aside>
  )
}
