import { useId, ChangeEvent } from 'react'

interface ImageUploaderProps {
  value?: string
  onChange: (value: string | undefined) => void
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const id = useId()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => onChange(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-zinc-400 mb-2">
        Image centrale
      </label>
      {value ? (
        <div className="flex flex-col gap-2">
          <div className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={value} alt="Centre" className="max-h-full max-w-full object-contain" />
          </div>
          <button
            onClick={() => onChange(undefined)}
            className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-3 py-2 text-sm hover:bg-zinc-700 transition-colors"
          >
            Supprimer l&apos;image
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="w-full h-10 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-3 py-2 text-sm flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors"
        >
          Choisir une image
          <input id={id} type="file" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
      )}
    </div>
  )
}

