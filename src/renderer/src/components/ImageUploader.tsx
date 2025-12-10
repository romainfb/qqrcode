import { useId, ChangeEvent, useState, useEffect, JSX } from 'react'

interface ImageUploaderProps {
  value?: string
  onChange: (value: string | undefined) => void
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps): JSX.Element {
  const id = useId()
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>()

  useEffect(() => {
    let mounted = true
    if (value) {
      window.api.asset
        .load(value)
        .then((d) => {
          if (mounted) setImageDataUrl(d)
        })
        .catch(console.error)
    } else {
      // décaler pour éviter setState synchrones dans l'effet
      setTimeout(() => {
        if (mounted) setImageDataUrl(undefined)
      }, 0)
    }
    return () => {
      mounted = false
    }
  }, [value])

  const handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        try {
          const path = await window.api.asset.saveCenterImage(dataUrl)
          onChange(path)
        } catch (error) {
          console.error('Failed to save image:', error)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (value) {
      try {
        await window.api.asset.delete(value)
      } catch (error) {
        console.error('Failed to delete image:', error)
      }
    }
    onChange(undefined)
  }

  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-zinc-400 mb-2">
        Image centrale
      </label>
      {imageDataUrl ? (
        <div className="flex flex-col gap-2">
          <div className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center overflow-hidden">
            <img src={imageDataUrl} alt="Centre" className="max-h-full max-w-full object-contain" />
          </div>
          <button
            onClick={handleDelete}
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
