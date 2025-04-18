'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Provider } from 'react-redux'
import { store } from '../lib/redux/store'

export function Providers({
  children,
  ...props
}: Readonly<ThemeProviderProps>) {
  return (
    <SessionProvider>
      <NextThemesProvider {...props}>
        <SidebarProvider>
          <TooltipProvider>
            <Provider store={store}>{children}</Provider>
          </TooltipProvider>
        </SidebarProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}
