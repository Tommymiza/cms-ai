// import { AdminLayout } from '@/layouts/admin-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

export const metadata: Metadata = {
  title: {
    template: 'Colibri Admin - %s',
    default: ' Admin',
  },
  description: '',
}
const AdminLayout = dynamic(() => import('@/layouts/admin-layout'), { ssr: false })
export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <AdminLayout>{children}</AdminLayout>
    </AuthLayout>
  )
}
