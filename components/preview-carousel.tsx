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
        className="relative w-full max-w-xl xl:max-w-6xl lg:max-w-6xl md:max-w-3xl sm:max-w-xl xs:max-w-xl bg-carousal rounded-none shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full pl-4 bg-action-button text-action-button-foreground font-normal">
          <div className="flex-1">{images[activeIndex || 0]?.filename}</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={cn(
                  'chat-button',
                  'my-0 rounded-none bg-active-button border-none hover:bg-active-button text-active-button-foreground border-none'
                )}
              >
                <IconClose className="w-4 h-4 fill-active-button-foreground" />
                <span className="sr-only">Close Carousel</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close Carousel</TooltipContent>
          </Tooltip>
        </div>
        <Carousel className="w-full p-8 pb-6" setApi={setApi}>
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
                      className="w-auto h-[500px] sm:rounded-md"
                    />
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <div className="flex items-center justify-center gap-4 pt-4">
            <CarouselPrevious className="relative" variant="ghost" />
            <div className="flex items-center justify-center gap-2 overflow-x-auto p-2">
              {images.map((image, index) => (
                <button
                  key={`thumbnail-${index}`}
                  onClick={() => api?.scrollTo(index)}
                  className={`transition-transform duration-300 flex-shrink-0 cursor-pointer bg-white dark:bg-active-button shadow-md ${
                    index === activeIndex
                      ? 'p-2 w-[110px] h-[80px]'
                      : 'p-1 w-[92px] h-[67px]'
                  } rounded-lg overflow-hidden`}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
            <CarouselNext className="relative" variant="ghost" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
