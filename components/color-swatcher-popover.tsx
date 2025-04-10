import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from '@/components/ui/button'
import { IconColorPicker } from './ui/icons'
import { Color } from '@/lib/types'
import ColorSwatcher from './color-swatcher'

interface ColorSwatcherPopoverProps {
  currentColor: Color | null
  onColorSelect: (color: Color) => void
  disabled: boolean
  label?: string
}

export default function ColorSwatcherPopover({
  currentColor,
  onColorSelect,
  disabled,
  label = 'Pick a color'
}: Readonly<ColorSwatcherPopoverProps>) {
  const [isPickerOpen, setPickerOpen] = useState(false)

  const handleColorSelect = (color: Color) => {
    onColorSelect(color)
    setPickerOpen(false)
  }

  return (
    <Popover open={isPickerOpen && !disabled} onOpenChange={setPickerOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center gap-2 w-full p-2 disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={() => setPickerOpen(false)}
        >
          <IconColorPicker />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" side="top" className="w-full">
        <ColorSwatcher
          currentColor={currentColor}
          disabled={disabled}
          onColorSelect={handleColorSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
