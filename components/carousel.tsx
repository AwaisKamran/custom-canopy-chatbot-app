'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { IconPicture } from './ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import PreviewCarousel from './preview-carousel'
import { Image, MockupResponse } from '@/lib/types'

export const Carousal = ({
  mockups,
  open = false
}: {
  open?: boolean
  mockups: MockupResponse
}) => {
  const [isOpen, setIsOpen] = useState(open)
  const [images, setImages] = useState<Image[]>([])

  useEffect(() => {
    const images: Image[] = Object.entries(mockups).map(([key, value]) => ({
      url: value.url,
      filename: key
    }))
    setImages(images)
  }, [mockups])

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
          images={images}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
