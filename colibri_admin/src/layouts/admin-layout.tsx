'use client'

import Loading from '@/components/loading/loading'
import { sidebarAdminRoutes } from '@/components/sidebar'
import { Role } from '@/lib/constant'
import authStore from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import SidebarRoutLayout from './sidebar-root-layout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { auth, loading: isLoading } = authStore()

  useEffect(() => {
    if (auth) {
      if (auth.role_admin.code !== Role.ADMIN) {
        router.push('/login')
      }
    }
    if (auth === null && !isLoading) {
      router.push('/login')
    }
    // console.log('auth yy', auth)
  }, [auth, router, isLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
        loading
      </div>
    )
  }

  return <>{auth && <SidebarRoutLayout sidebarRoutes={sidebarAdminRoutes}>{children}</SidebarRoutLayout>}</>
}
