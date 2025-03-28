import * as React from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Button } from './ui/button'
import { IconClose } from './ui/icons'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { Image } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface PreviewCarousel {
  images: Image[]
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export default function PreviewCarousel({
  images,
  isOpen,
  onClose,
  initialIndex
}: PreviewCarousel) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = React.useState(initialIndex)

  React.useEffect(() => {
    if (!api) return
    setActiveIndex(api.selectedScrollSnap())
    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap())
    })

    if (typeof initialIndex === 'number') {
      api.scrollTo(initialIndex)
    }
  }, [api])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[70vw] max-w-4xl bg-background rounded-none shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full pl-4 bg-indigo-100 text-neutral-900 font-normal">
          <div className="flex-1">{images[activeIndex || 0]?.filename}</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={cn(
                  'chat-button',
                  'my-0 rounded-none bg-action-button border-none hover:bg-action-button text-action-button-foreground border-none'
                )}
              >
                <IconClose className="w-4 h-4 fill-action-button-foreground" />
                <span className="sr-only">Close Carousel</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close Carousel</TooltipContent>
          </Tooltip>
        </div>
        <Carousel className="w-full p-8" setApi={setApi}>
          <CarouselContent>
            {images.map(
              (image: { filename: string; url: string }, index: number) => (
                <CarouselItem key={index}>
                  <div
                    key={index}
                    className="flex justify-center items-center sm:rounded-md p-6"
                  >
                    <img
                      src={image.url}
                      alt={`Image ${index} (${image.filename})`}
                      className="w-auto h-[400px] sm:rounded-md"
                    />
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 pt-6">
            <CarouselPrevious className="relative" variant="ghost" />
            <div className="flex gap-2 overflow-x-auto">
              {images.map(
                (image: { filename: string; url: string }, index: number) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Thumbnail ${index}`}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      'w-20 h-20 object-contain rounded-md cursor-pointer border-2 transition bg-background p-1',
                      activeIndex === index
                        ? 'border-primary'
                        : 'border-accent opacity-60 hover:opacity-100'
                    )}
                  />
                )
              )}
            </div>
            <CarouselNext className="relative" variant="ghost" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
