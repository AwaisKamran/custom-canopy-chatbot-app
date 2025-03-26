import { Image } from '@/lib/types'
import { IconExpand } from './ui/icons'
import { Button } from './ui/button'

interface GuidanceImageViewProps {
  images: Image[]
  setIsCarouselOpen: (isOpen: boolean) => void
}

export function GuidanceImageView({
  images,
  setIsCarouselOpen
}: GuidanceImageViewProps) {
  if (!images) {
    return
  }

  return (
    <>
      {images.map(image => {
        return (
          <div key={image.filename} className="mb-6">
            <p className="text-sm mb-4">{image.filename}</p>
            <div className="relative border border-border rounded-md overflow-hidden">
              <Button
                onClick={() => setIsCarouselOpen(true)}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-background text-foreground shadow-md hover:bg-accent hover:text-accent-foreground transition w-6 h-6"
              >
                <IconExpand className="w-3 h-3" />
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
