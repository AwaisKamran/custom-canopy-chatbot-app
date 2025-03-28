import { Image } from '@/lib/types'
import { IconExpand } from './ui/icons'
import { Button } from './ui/button'

interface GuidanceImageViewProps {
  images: Image[]
  setIsCarouselOpen: (isOpen: boolean) => void
  setInitialIndex: (index: number) => void
}

export function GuidanceImageView({
  images,
  setIsCarouselOpen,
  setInitialIndex
}: GuidanceImageViewProps) {
  if (!images) {
    return
  }

  return (
    <>
      {images.map((image, index) => {
        return (
          <div key={image.filename} className="mb-6">
            <p className="text-sm mb-4">{image.filename}</p>
            <div className="relative border-0.5 border-card rounded-md rounded-tr-none p-1 overflow-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setInitialIndex(index)
                  setIsCarouselOpen(true)
                }}
                className="absolute top-0 right-0 z-10 p-1 rounded-none overflow-auto bg-card hover:bg-card shadow-md w-6 h-6"
              >
                <IconExpand className="w-4 h-4 fill-card-foreground" />
                <span className="sr-only">Expand Image</span>
              </Button>

              <img
                src={image.url}
                alt={image.filename}
                className="w-[300px] h-[200px] object-contain rounded"
              />
            </div>
          </div>
        )
      })}
    </>
  )
}
