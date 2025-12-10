import type { InputAreaProps } from '@renderer/types'
import { JSX } from 'react'

export default function InputArea({
  value,
  onChange,
  onGenerate,
  disabled
}: InputAreaProps): JSX.Element {
  return (
    <section className="w-full bg-black border-b border-zinc-800">
      <div className="flex gap-4 p-4">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Entrez une URL ou un texte..."
          className="flex-1 h-14 px-4 bg-zinc-800 text-zinc-100 text-lg
            placeholder:text-zinc-500 rounded-2xl border border-zinc-700
            focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent
            transition-all"
        />
        <button
          onClick={onGenerate}
          disabled={disabled}
          className="w-36 h-14 bg-zinc-800 text-white text-sm font-medium rounded-2xl
            hover:bg-zinc-700 transition-colors shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed
            active:scale-[0.98]"
        >
          Générer
        </button>
      </div>
    </section>
  )
}
