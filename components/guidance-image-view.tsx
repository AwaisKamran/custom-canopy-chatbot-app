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
}: Readonly<GuidanceImageViewProps>) {
  if (!images) {
    return
  }

  const singleImage = images.length === 1
  return (
    <div
      className={`flex flex-col gap-2 justify-center items-center ${singleImage ? 'my-2' : 'mb-2'}`}
    >
      {images.map((image, index) => {
        return (
          <div
            key={image.filename}
            className={`flex flex-col gap-2 justify-center`}
          >
            {!singleImage && (
              <span className="text-xs text-muted-foreground">
                {image.filename}
              </span>
            )}
            <div className="relative border-0.5 !border-action-button dark:!border-active-button rounded-md rounded-tr-none overflow-auto p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setInitialIndex(index)
                  setIsCarouselOpen(true)
                }}
                className="absolute top-0 right-0 z-10 p-1 rounded-none overflow-auto bg-action-button hover:bg-action-button shadow-md w-6 h-6"
              >
                <IconExpand className="w-4 h-4 fill-action-button-foreground" />
                <span className="sr-only">Expand Image</span>
              </Button>

              <img
                src={image.url}
                alt={image.filename}
                className="w-[250px] h-[214px] object-contain rounded"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
