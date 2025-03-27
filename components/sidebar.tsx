'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Guidance } from './guidance'
import PreviewCarousel from './preview-carousel'
import { Image } from '@/lib/types'
import { useTheme } from 'next-themes'

export interface SidebarProps extends React.ComponentProps<'div'> {}

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()
  const [images, setImages] = React.useState<Image[]>([])
  const [isCarouselOpen, setIsCarouselOpen] = React.useState(false)
  const [initialIndex, setInitialIndex] = React.useState(0)
  const { theme } = useTheme()

  React.useEffect(() => {
    const images: Image[] = [
      {
        filename: 'Front View',
        url:
          theme === 'light'
            ? process.env.NEXT_PUBLIC_FRONT_GUIDANCE_IMAGE_URL || ''
            : process.env.NEXT_PUBLIC_FRONT_GUIDANCE_IMAGE_URL_DARK || ''
      },
      {
        filename: 'Side View',
        url:
          theme === 'light'
            ? process.env.NEXT_PUBLIC_SIDE_GUIDANCE_IMAGE_URL || ''
            : process.env.NEXT_PUBLIC_SIDE_GUIDANCE_IMAGE_URL_DARK || ''
      },
      {
        filename: 'Top View',
        url:
          theme === 'light'
            ? process.env.NEXT_PUBLIC_TOP_GUIDANCE_IMAGE_URL || ''
            : process.env.NEXT_PUBLIC_TOP_GUIDANCE_IMAGE_URL_DARK || ''
      },
      {
        filename: 'No Walls View',
        url:
          theme === 'light'
            ? process.env.NEXT_PUBLIC_NO_WALLS_GUIDANCE_IMAGE_URL || ''
            : process.env.NEXT_PUBLIC_NO_WALLS_GUIDANCE_IMAGE_URL_DARK || ''
      }
    ]

    setImages(images)
  }, [theme])

  return (
    <>
      <Tabs
        defaultValue="guidance"
        data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
        className={cn(className, 'h-full flex-col p-2')}
      >
        <TabsList className="grid w-auto grid-cols-2 mb-2">
          <TabsTrigger value="guidance">Guidance</TabsTrigger>
          <TabsTrigger value="chat-history">Chat History</TabsTrigger>
        </TabsList>
        <TabsContent value="chat-history" className="h-full">
          {children}
        </TabsContent>
        <TabsContent value="guidance" className="h-full">
          <Guidance
            images={images}
            setIsCarouselOpen={setIsCarouselOpen}
            setInitialIndex={setInitialIndex}
          />
        </TabsContent>
      </Tabs>

      <PreviewCarousel
        images={images}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        initialIndex={initialIndex}
      />
    </>
  )
}
