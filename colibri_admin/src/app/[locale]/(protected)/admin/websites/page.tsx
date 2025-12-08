'use client'
import AdminWebsiteList from '@/components/admin-website-list'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import chatStore from '@/store/chat-dialog'
import { useTranslations } from 'next-intl'

export default function AdminWebsitePage() {
  const { toggle } = chatStore()
  const handleAddWebsite = () => {
    toggle(true)
  }
  const t = useTranslations('website')
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>{t('header')}</Heading>
        <Button onClick={handleAddWebsite} className="cursor-pointer">
          {t('addbtn')}
        </Button>
      </div>
      <AdminWebsiteList />
    </>
  )
}
