import { COLOR_SWATCHES } from '@/app/constants'
import React, { useState } from 'react'
import TextInputWithLabel from './ui/text-input-with-label'
import { getColorName, validateHEX, hexToBGR } from '@/lib/utils'
import { Color } from '@/lib/types'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface ColorSwatcherProps {
  currentColor: Color | null
  onColorSelect: (color: Color) => void
  disabled: boolean
}

const ColorSwatcher = ({
  currentColor,
  onColorSelect,
  disabled
}: ColorSwatcherProps) => {
  const [selectedColor, setSelectedColor] = useState<Color | null>(currentColor)
  const [isValidHex, setIsValidHex] = useState<boolean>(true)

  const handleColorPick = (color: Color) => {
    if (color.name === selectedColor?.name) {
      setSelectedColor(null)
    } else {
      setSelectedColor(color)
    }
  }

  const handleInputChange = (hex: string) => {
    if (hex === '') {
      setIsValidHex(true)
      return
    }
    if (validateHEX(hex)) {
      setIsValidHex(true)
      const { r, g, b } = hexToBGR(hex)
      handleColorPick({
        hex,
        rgb: JSON.stringify(`[${r}, ${g}, ${b}]`),
        name: getColorName(hex) ?? 'Custom'
      })
    } else {
      setIsValidHex(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedColor) {
      onColorSelect(selectedColor)
    }
  }

  return (
    <div className="flex flex-col gap-4 mx-auto">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {COLOR_SWATCHES.map(color => (
            <Tooltip key={color.name}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={color.name}
                  className="w-12 h-12 rounded border-2 border-transparent hover:border-gray-500 cursor-pointer flex items-center justify-center mx-auto mb-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorPick(color)}
                  disabled={disabled}
                />
              </TooltipTrigger>
              <TooltipContent>{color.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full gap-2"
        >
          <TextInputWithLabel
            label={
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="w-full h-5 flex items-center justify-center px-2 py-1 rounded"
                    style={
                      selectedColor?.name
                        ? { backgroundColor: selectedColor.hex }
                        : {}
                    }
                  >
                    {!selectedColor?.name && 'Custom'}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {selectedColor?.name ?? 'Custom'}
                </TooltipContent>
              </Tooltip>
            }
            value={selectedColor?.hex ?? ''}
            placeholder="#000000"
            error={isValidHex ? '' : 'Invalid HEX'}
            onChange={handleInputChange}
            disabled={disabled}
            maxLength={7}
          />
          <button
            type="submit"
            disabled={disabled || !isValidHex || !selectedColor?.hex}
            className="chat-button w-1/4"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  )
}

export default ColorSwatcher
