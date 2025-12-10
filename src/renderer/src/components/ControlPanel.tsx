import type { QRSettings, CornersStyle, DotStyle, ECC } from '@renderer/types'
import {
  CORNERS_STYLES,
  CORNERS_STYLE_LABELS,
  DOT_STYLES,
  DOT_STYLE_LABELS,
  ECC_LEVELS
} from '@renderer/types'
import CanvasExport from '@renderer/components/CanvasExport'
import SelectField from '@renderer/components/SelectField'
import ColorPicker from '@renderer/components/ColorPicker'
import ImageUploader from '@renderer/components/ImageUploader'

// Labels pour ECC (identiques aux valeurs)
const ECC_LABELS: Record<ECC, string> = { L: 'L', M: 'M', Q: 'Q', H: 'H' }

interface ControlPanelProps {
  settings: QRSettings
  onSettingChange: <K extends keyof QRSettings>(key: K, value: QRSettings[K]) => void
}

export default function ControlPanel({
  settings,
  onSettingChange
}: ControlPanelProps): JSX.Element {
  return (
    <section className="w-80 h-full bg-black border-l border-zinc-800 p-4 flex flex-col gap-6">
      <SelectField<CornersStyle>
        label="Coins"
        value={settings.cornersStyle}
        options={CORNERS_STYLES}
        labels={CORNERS_STYLE_LABELS}
        onChange={(v) => onSettingChange('cornersStyle', v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField<ECC>
          label="ECC"
          value={settings.ecc}
          options={ECC_LEVELS}
          labels={ECC_LABELS}
          onChange={(v) => onSettingChange('ecc', v)}
        />
        <SelectField<DotStyle>
          label="Style"
          value={settings.dotStyle}
          options={DOT_STYLES}
          labels={DOT_STYLE_LABELS}
          onChange={(v) => onSettingChange('dotStyle', v)}
        />
      </div>

      <ImageUploader
        value={settings.centerImagePath}
        onChange={(v) => onSettingChange('centerImagePath', v)}
      />

      <div className="grid grid-cols-2 gap-4">
        <ColorPicker
          label="Couleur"
          value={settings.foregroundColor}
          onChange={(v) => onSettingChange('foregroundColor', v)}
        />
        <ColorPicker
          label="Fond"
          value={settings.backgroundColor}
          onChange={(v) => onSettingChange('backgroundColor', v)}
        />
      </div>

      <CanvasExport
        backgroundColor={settings.backgroundColor}
        cornersStyle={settings.cornersStyle}
      />
    </section>
  )
}
