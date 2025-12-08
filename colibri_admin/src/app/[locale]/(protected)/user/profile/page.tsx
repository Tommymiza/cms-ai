'use client'
import EditProfil from '@/components/edit-profile/edit-profil'
import { Heading } from '@/components/heading'
import { useTranslations } from 'next-intl'

export default function ProfilePage() {
  const t = useTranslations('registerPage')
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>{t('edit-title')}</Heading>
      </div>
      <EditProfil />
    </>
  )
}
