import type { ControlPanelProps } from '@renderer/types'

function ControlPanel({
  cornersStyle,
  onCornersStyleChange,
  dotStyle,
  onDotStyleChange,
  ecc,
  onEccChange,
  foregroundColor,
  onForegroundColorChange,
  backgroundColor,
  onBackgroundColorChange
}: ControlPanelProps): React.JSX.Element {
  return (
    <section className={'w-80 h-full bg-zinc-900 border-l border-zinc-800 p-4 flex flex-col gap-6'}>
      <div>
        <label
          htmlFor="cornersStyle"
          className="block text-xs uppercase tracking-wide text-zinc-400 mb-2"
        >
          Coins
        </label>
        <select
          id="cornersStyle"
          value={cornersStyle}
          onChange={(e) => onCornersStyleChange(e.target.value as 'square' | 'rounded')}
          className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
        >
          <option value="square">Carré</option>
          <option value="rounded">Arrondi</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ecc" className="block text-xs uppercase tracking-wide text-zinc-400 mb-2">
            ECC
          </label>
          <select
            id="ecc"
            value={ecc}
            onChange={(e) => onEccChange(e.target.value as 'L' | 'M' | 'Q' | 'H')}
            className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
          >
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="Q">Q</option>
            <option value="H">H</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="dotStyle"
            className="block text-xs uppercase tracking-wide text-zinc-400 mb-2"
          >
            Style
          </label>
          <select
            id="dotStyle"
            value={dotStyle}
            onChange={(e) => onDotStyleChange(e.target.value as 'dots' | 'square')}
            className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-3 py-2 text-sm"
          >
            <option value="square">Carré</option>
            <option value="dots">Points</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fg" className="block text-xs uppercase tracking-wide text-zinc-400 mb-2">
            Couleur
          </label>
          <input
            id="fg"
            type="color"
            value={foregroundColor}
            onChange={(e) => onForegroundColorChange(e.target.value)}
            className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-xl"
          />
        </div>
        <div>
          <label htmlFor="bg" className="block text-xs uppercase tracking-wide text-zinc-400 mb-2">
            Fond
          </label>
          <input
            id="bg"
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="w-full h-10 bg-zinc-800 border border-zinc-700 rounded-xl"
          />
        </div>
      </div>
    </section>
  )
}

export default ControlPanel
