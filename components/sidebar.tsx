'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Guidance } from './guidance'
import PreviewCarousel from './preview-carousel'
import { Image } from '@/lib/types'
import { useTheme } from 'next-themes'
import { GUIDANCE_IMAGE_URLS } from '@/app/constants'

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
            ? GUIDANCE_IMAGE_URLS['front-light']
            : GUIDANCE_IMAGE_URLS['front-dark']
      },
      {
        filename: 'Side View',
        url:
          theme === 'light'
            ? GUIDANCE_IMAGE_URLS['half-wall-light']
            : GUIDANCE_IMAGE_URLS['half-wall-dark']
      },
      {
        filename: 'Top View',
        url:
          theme === 'light'
            ? GUIDANCE_IMAGE_URLS['top-view-light']
            : GUIDANCE_IMAGE_URLS['top-view-dark']
      },
      {
        filename: 'No Walls View',
        url:
          theme === 'light'
            ? GUIDANCE_IMAGE_URLS['no-walls-light']
            : GUIDANCE_IMAGE_URLS['no-walls-dark']
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
        <TabsList className="grid w-auto grid-cols-2 mb-2 bg-transparent border-none p-0">
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
