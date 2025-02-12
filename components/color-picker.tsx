import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from '@/components/ui/button'
import { getColorName } from '@/lib/utils'
import { IconColorPicker } from './ui/icons'
import { COLORS } from '@/app/constants'

interface ColorPickerPopoverProps {
  onColorSelect: (color: string, colorName: string, fontColor: string) => void
  disabled: boolean
}

export default function ColorPickerPopover({
  onColorSelect,
  disabled
}: ColorPickerPopoverProps) {
  const [color, setColor] = useState('#000000')
  const [isPickerOpen, setPickerOpen] = useState(false)

  const hexToBGR = (hex: string): any => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return { r, g, b }
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  const getContrastColor = (b: number, g: number, r: number): string => {
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

    if (luminance > 128) {
      return COLORS.BLACK_COLOR
    } else {
      return COLORS.WHITE_COLOR
    }
  }

  const handleConfirm = () => {
    const { r, g, b } = hexToBGR(color)
    const contrastFontColor = getContrastColor(b, g, r)
    const colorName = getColorName(color) || color
    const rgbColor = `[${r}, ${g}, ${b}]`
    onColorSelect(rgbColor, colorName, contrastFontColor)
    setPickerOpen(false)
  }

  return (
    <Popover open={isPickerOpen && !disabled} onOpenChange={setPickerOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center gap-2 w-full p-2"
          onClick={() => setPickerOpen(false)}
        >
          <IconColorPicker />
          <span>Pick a Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" side="top">
        <div className="flex flex-col items-center gap-4 mt-2">
          <HexColorPicker color={color} onChange={handleColorChange} />
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPickerOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleConfirm}
              disabled={disabled}
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
