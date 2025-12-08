import type { Metadata } from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s - Users list',
    default: 'Users list',
  },
  description: '',
}

export default function AdminUserRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
