import { useId } from 'react'

interface SelectFieldProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  labels: Record<T, string>
  onChange: (value: T) => void
}

export default function SelectField<T extends string>({
  label,
  value,
  options,
  labels,
  onChange
}: SelectFieldProps<T>) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="block text-xs uppercase tracking-wide text-zinc-400 mb-2">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </div>
  )
}
