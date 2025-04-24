import * as React from 'react'
import { GuidanceImageView } from './guidance-image-view'
import { ThemeToggle } from './theme-toggle'
import { Image } from '@/lib/types'

interface GuidanceProps {
  images: { [key: string]: Image[] }
  setIsCarouselOpen: (isOpen: boolean) => void
  setInitialIndex: (keyIndex: number, index: number) => void
}

export function Guidance({
  images,
  setIsCarouselOpen,
  setInitialIndex
}: GuidanceProps) {
  return (
    <div className="flex flex-col h-full p-2 mt-2 overflow-auto pb-20">
      <div className="p-2">
        <p className="text-xs text-foreground mb-5">
          To get you started, please refer to this diagram in order to
          understand the anatomy of our canopy:
        </p>
        {Object.entries(images).map(([key, values], keyIndex) => {
          return (
            <div className="flex flex-col gap-2 my-2" key={key}>
              <span className="flex justify-center capitalize chat-button border-0 border-b-0.5 w-full rounded-none rounded-t-md">
                {key}
              </span>
              {key === 'canopy' && (
                <div className="flex flex-col justify-center gap-3 text-foreground text-xs py-2">
                  <span>
                    A 10’x10’ Custom Canopy has 8 print locations; 4 peaks and 4
                    valences.
                  </span>
                  <span>
                    It can also be accessorized with full walls and half walls.
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Peak = the upmost part of the canopy
                    <br />
                    Valence = the portion which connects with the peak
                  </span>
                </div>
              )}
              <GuidanceImageView
                key={`${key}-${keyIndex}`}
                images={values}
                setIsCarouselOpen={setIsCarouselOpen}
                setInitialIndex={index => setInitialIndex(keyIndex, index)}
              />
            </div>
          )
        })}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
