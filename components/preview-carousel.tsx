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
}

export default function PreviewCarousel({
  images,
  isOpen,
  onClose
}: PreviewCarousel) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setActiveIndex(api.selectedScrollSnap())
    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap())
    })
  }, [api])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl p-4 bg-muted-50 rounded-lg"
        onClick={e => e.stopPropagation()}
      >
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
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {images.map((image: Image, index: number) => (
              <CarouselItem key={index}>
                <div
                  key={index}
                  className="flex justify-center items-center sm:rounded-md"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index} (${image.filename})`}
                    className="w-[400px] h-[400px] overflow-hidden sm:rounded-md"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="mt-8 flex justify-center gap-2 overflow-x-auto">
          {images.map((image: Image, index: number) => (
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
          ))}
        </div>
      </div>
    </div>
  )
}
