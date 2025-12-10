import { useId } from 'react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-wide text-zinc-400 mb-2">
        {label}
      </label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer"
      />
    </div>
  )
}
