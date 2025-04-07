'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview, sendClientIdToServer } from '@/lib/utils/gtag'

export function AnalyticsWrapper() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`
      pageview(url)
    }
    sendClientIdToServer()
  }, [pathname, searchParams])

  return null
}
