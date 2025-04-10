import { useState } from 'react'
import { Color } from '@/lib/types'
import ColorSwatcherPopover from './color-swatcher-popover'

interface ColorPickerWithLabelProps {
  label: string
  currentColor: Color
  onColorSelect: (color: Color) => void
  disabled?: boolean
}

const ColorPickerWithLabel: React.FC<ColorPickerWithLabelProps> = ({
  label,
  currentColor,
  onColorSelect,
  disabled = false
}) => {
  const [color, setColor] = useState<Color>(currentColor)

  const handleColorSelect = (color: Color) => {
    setColor(color)
    onColorSelect(color)
  }

  return (
    <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm w-full">
      <label
        htmlFor="text-input"
        className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-700 min-w-[20%]"
      >
        {label}
      </label>
      {color && (
        <div className="flex items-center gap-2 w-1/2">
          <span
            className="w-10 h-5 border border-gray-300 dark:border-gray-700"
            style={{
              backgroundColor: color.hex
            }}
          ></span>
          <span className="text-gray-700 dark:text-gray-300">{color.name}</span>
        </div>
      )}
      <ColorSwatcherPopover
        currentColor={color}
        onColorSelect={handleColorSelect}
        label={color ? 'Change Color' : 'Pick a Color'}
        disabled={disabled}
      />
    </div>
  )
}
export default ColorPickerWithLabel
