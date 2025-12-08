'use client'
import { usePathname, useRouter } from '@/i18n/routing'
import { Role } from '@/lib/constant'
import authStore from '@/store/auth'
import { useEffect } from 'react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { auth, getMe } = authStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function getConnectedUser() {
      try {
        if (!auth) {
          await getMe()
          return
        }
        if (pathname === '/') return
        if (auth.role_admin.code === Role.ADMIN) {
          router.push('/admin/websites', { locale: auth.lang_conv ?? 'fr' })
        }
        if (auth.role_admin.code === Role.USER) {
          router.push('/user/websites', { locale: auth.lang_conv ?? 'fr' })
        }
        if (pathname !== '/login') {
          router.push(pathname, { locale: auth.lang_conv ?? 'fr' })
        } else {
          router.push('/user/websites', { locale: auth.lang_conv ?? 'fr' })
        }
      } catch (error) {
        if (pathname !== '/login') {
          router.push('/login')
        }
      }
    }
    getConnectedUser()
  }, [auth])
  return children
}
