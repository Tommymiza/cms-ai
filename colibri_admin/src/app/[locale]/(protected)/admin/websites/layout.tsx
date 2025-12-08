import type { Metadata } from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s - Websites list',
    default: 'Websites list',
  },
  description: '',
}

export default function AdminWebsiteRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
