import type { Metadata } from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s - Users list',
    default: 'Users profile',
  },
  description: '',
}

export default function ProfileUserRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
