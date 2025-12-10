import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { QRCodeData, SaveStatus } from '@renderer/types'

export function useHistoryState(): {
  history: QRCodeData[]
  setHistory: Dispatch<SetStateAction<QRCodeData[]>>
  selectedId: string | null
  setSelectedId: Dispatch<SetStateAction<string | null>>
  saveStatus: SaveStatus
  setSaveStatus: Dispatch<SetStateAction<SaveStatus>>
} {
  const [history, setHistory] = useState<QRCodeData[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  return { history, setHistory, selectedId, setSelectedId, saveStatus, setSaveStatus }
}
