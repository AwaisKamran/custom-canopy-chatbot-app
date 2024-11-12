import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from '@/components/ui/button'
import { getColorName } from '@/lib/utils'
import { IconColorPicker } from './ui/icons'

interface ColorPickerPopoverProps {
  onColorSelect: (color: string, colorName: string) => void
}

export default function ColorPickerPopover({
  onColorSelect
}: ColorPickerPopoverProps) {
  const [color, setColor] = useState('#000000')
  const [isPickerOpen, setPickerOpen] = useState(false)

  function hexToBGR(hex: string): string {
    // Convert hex to RGB
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    // Return as BGR string
    return `[${b}, ${g}, ${r}]`
  }

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
  }

  const handleConfirm = () => {
    const bgrColor = hexToBGR(color)
    const colorName = getColorName(color) || color
    onColorSelect(bgrColor, colorName)
    setPickerOpen(false)
  }

  return (
    <Popover open={isPickerOpen} onOpenChange={setPickerOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-8 sm:rounded-full bg-background p-0 sm:left-4"
          onClick={() => setPickerOpen(false)}
        >
          <IconColorPicker />
          <span className="sr-only">Pick Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top">
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
            <Button variant="ghost" size="sm" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
