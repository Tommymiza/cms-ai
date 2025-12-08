import { AuthLayout } from '@/layouts/auth-layout'
import { UserLayout } from '@/layouts/user-layout'

import React from 'react'
export default function RootUserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <UserLayout>{children}</UserLayout>
    </AuthLayout>
  )
}
