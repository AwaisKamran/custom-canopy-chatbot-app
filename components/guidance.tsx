import * as React from 'react'
import { GuidanceImageView } from './guidance-image-view'
import { ThemeToggle } from './theme-toggle'
import { Image } from '@/lib/types'

interface GuidanceProps {
  images: Image[]
  setIsCarouselOpen: (isOpen: boolean) => void
}

export function Guidance({ images, setIsCarouselOpen }: GuidanceProps) {
  return (
    <div className="flex flex-col h-full p-2 mt-2 overflow-auto pb-20">
      <div className="p-2">
        <p className="text-xs text-foreground mb-5">
          To get you started, please refer to this diagram in order to
          understand the anatomy of our canopy:
        </p>
        <p className="text-xs text-foreground mb-5">
          A 10’x10’ Custom canopy has 11 print locations; 4 peaks, 4 valences,
          and 3 side panels.
        </p>
        <p className="text-[10px] text-muted-foreground mb-5">
          Peak = the upmost part of the canopy
          <br />
          Valence = the portion which connects with the peak
        </p>

        <GuidanceImageView
          images={images}
          setIsCarouselOpen={setIsCarouselOpen}
        />

        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
