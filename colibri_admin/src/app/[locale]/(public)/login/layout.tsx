import { AuthLayout } from '@/layouts/auth-layout'
import React from 'react'
export default async function RootLoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
