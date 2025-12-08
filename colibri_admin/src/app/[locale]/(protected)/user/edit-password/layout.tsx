import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s - Change password',
    default: 'Change password',
  },
  description: '',
}
export default function EditPasswordRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
