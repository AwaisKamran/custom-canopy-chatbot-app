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
import { DOWNLOAD_ZIP_NAME, MOCKUP_TYPES } from '@/app/constants'
import { PinBottomIcon } from '@radix-ui/react-icons'
import { downloadImages } from '@/lib/redux/apis/files'

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
      contentType: value.contentType,
      filename:
        key in MOCKUP_TYPES
          ? MOCKUP_TYPES[key as keyof typeof MOCKUP_TYPES]
          : key
    }))
    setImages(images)
  }, [mockups])

  const handleDownload = async () => {
    try {
      const blob = await downloadImages(images)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = DOWNLOAD_ZIP_NAME
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert(`Failed to download images ${error}`)
    }
  }

  return (
    <>
      <div className="flex">
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 w-full p-2 button"
              onClick={handleDownload}
            >
              <PinBottomIcon />
              <span>Download Zip</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download Zip</TooltipContent>
        </Tooltip>
      </div>
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
