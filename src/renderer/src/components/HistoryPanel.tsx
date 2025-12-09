import type { QRCodeData } from '../types'
import { JSX } from 'react'

interface HistoryPanelProps {
  history: QRCodeData[]
  onSelect: (item: QRCodeData) => void
  selectedId: string | null
}

export default function HistoryPanel({
  history,
  onSelect,
  selectedId
}: HistoryPanelProps): JSX.Element {
  return (
    <aside className="w-32 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-4">
      <h2 className="text-zinc-400 text-sm font-medium border-b border-zinc-800 pb-2">History</h2>

      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((index) => {
          const item = history[index]
          const isSelected = item && selectedId === item.id

          return (
            <button
              key={index}
              onClick={() => item && onSelect(item)}
              disabled={!item}
              className={`
                aspect-square rounded-2xl flex items-center justify-center
                transition-all text-xs font-medium
                ${
                  item
                    ? isSelected
                      ? 'ring-2 ring-emerald-500 bg-zinc-800 shadow-lg cursor-pointer'
                      : 'bg-zinc-800 hover:bg-zinc-700 shadow-md cursor-pointer'
                    : 'bg-zinc-800/50 border border-dashed border-zinc-700 cursor-not-allowed'
                }
              `}
            >
              {item ? (
                <img
                  src={item.dataUrl}
                  alt={`QR #${index + 1}`}
                  className="w-full h-full object-contain p-2 rounded-2xl"
                />
              ) : (
                <span className="text-zinc-600">#{index + 1}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-auto text-xs text-zinc-600">{history.length}/3 saved</div>
    </aside>
  )
}
