'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { IconPicture } from './ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import PreviewCarousel from './preview-carousel'
import { MockupResponse } from '@/lib/types'

export const Carousal = ({ mockups }: { mockups: MockupResponse }) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 w-full p-2"
            onClick={() => setIsOpen(true)}
          >
            <IconPicture />
            <span>View Mockups</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>View Mockups</TooltipContent>
      </Tooltip>
      {isOpen && (
        <PreviewCarousel
          mockups={mockups}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
