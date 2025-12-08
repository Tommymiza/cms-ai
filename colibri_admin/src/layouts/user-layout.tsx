'use client'

import Loading from '@/components/loading/loading'
import { sidebarUserRoutes } from '@/components/sidebar'
import { Role } from '@/lib/constant'
import authStore from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import SidebarRoutLayout from './sidebar-root-layout'

export function UserLayout({ children }: { children: React.ReactNode }) {
  const { auth, loading: isLoading } = authStore()
  const router = useRouter()

  useEffect(() => {
    if (auth) {
      if (auth.role_admin.code !== Role.USER) {
        router.push('/login')
      }
    }
    if (auth === null && !isLoading) {
      router.push('/login')
    }
  }, [auth, router, isLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }

  return <>{auth && <SidebarRoutLayout sidebarRoutes={sidebarUserRoutes}>{children}</SidebarRoutLayout>}</>
}
