'use client'

import authStore from '@/store/auth'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { DropdownItem, DropdownLabel } from './dropdown'

export default function SignoutBtn() {
  const router = useRouter()
  const { logout } = authStore()
  const t = useTranslations('signout')
  const handleLogout = async () => {
    logout()
    window.location.reload()
  }
  return (
    <DropdownItem onClick={() => handleLogout()} className="cursor-pointer">
      <ArrowRightStartOnRectangleIcon />
      <DropdownLabel>{t('title')}</DropdownLabel>
    </DropdownItem>
  )
}
