'use client'

import * as React from 'react'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Guidance } from './guidance'
import PreviewCarousel from './preview-carousel'
import { Image } from '@/lib/types'
import { useTheme } from 'next-themes'
import { GUIDANCE_IMAGE_URLS } from '@/app/constants'
import { calculateIndex, cn } from '@/lib/utils'

export interface SidebarProps extends React.ComponentProps<'div'> {}

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()
  const [images, setImages] = React.useState<{ [key: string]: Image[] }>({})
  const [isCarouselOpen, setIsCarouselOpen] = React.useState(false)
  const [initialIndex, setInitialIndex] = React.useState(0)
  const { theme } = useTheme()

  const getSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    return mediaQuery.matches ? 'dark' : 'light'
  }

  React.useEffect(() => {
    if (theme === 'system') {
      const systemTheme = getSystemTheme()
      setImages(GUIDANCE_IMAGE_URLS[systemTheme])
    } else {
      setImages(
        theme
          ? GUIDANCE_IMAGE_URLS[theme as 'dark' | 'light']
          : GUIDANCE_IMAGE_URLS.light
      )
    }
  }, [theme])

  const handleSetInitialIndex = (keyIndex: number, index: number) => {
    const idx = calculateIndex(keyIndex, index, images)
    setInitialIndex(idx)
  }

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
            setInitialIndex={handleSetInitialIndex}
          />
        </TabsContent>
      </Tabs>

      <PreviewCarousel
        images={Object.values(images).flat()}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        initialIndex={initialIndex}
      />
    </>
  )
}
