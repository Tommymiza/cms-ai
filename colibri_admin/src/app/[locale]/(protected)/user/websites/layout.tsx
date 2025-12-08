import type { Metadata } from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s - Users websites',
    default: 'Users websites',
  },
  description: '',
}

export default function UserWebsiteRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
