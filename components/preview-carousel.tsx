import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Button } from './ui/button'
import { IconClose } from './ui/icons'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'

export interface PreviewCarousel {
  mockups: any
  isOpen: boolean
  onClose: () => void
}

export default function PreviewCarousel({
  mockups,
  isOpen,
  onClose
}: PreviewCarousel) {
  if (!isOpen) return null

  return (
    <div className="flex flex-row items-center justify-center bg-opacity-80">
      <div className="relative w-full max-w-2xl p-4 bg-muted-50 rounded-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-0 right-0 sm:rounded-full sm:border bg-background w-8 h-8 z-10 transform -translate-y-1/2 translate-x-1/2"
            >
              <IconClose className="w-4 h-4" />
              <span className="sr-only">Close Carousel</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close Carousel</TooltipContent>
        </Tooltip>
        <Carousel className="w-full">
          <CarouselContent>
            {mockups.map(
              (image: { filename: string; data: string }, index: number) => (
                <CarouselItem key={index}>
                  <div
                    key={index}
                    className="flex justify-center items-center sm:rounded-md"
                  >
                    <img
                      src={image.data}
                      alt={`Mockup ${index} (${image.filename})`}
                      className="w-[600px] h-[600px] overflow-hidden sm:rounded-md"
                    />
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}
