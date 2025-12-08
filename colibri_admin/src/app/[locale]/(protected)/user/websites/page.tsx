'use client'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import WebsiteList from '@/components/user-website-list'
import chatStore from '@/store/chat-dialog'
import tenantStore from '@/store/tenant'
import { CogIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl'

export default function WebsitePage() {
  const { toggle } = chatStore()
  const { toggle:toggleTenantAddingDialog } = tenantStore()
  const handleAddWebsite = () => {
    toggle(true)
  }
  const handleAddTenant = () => {
    toggleTenantAddingDialog(true)
  }
  const t = useTranslations('website')
  const { tenantId,tenants, getTenantOfUser, toggleTenant} = tenantStore()
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        {tenantId?.role === 'owner' && <Heading>{t('header')}</Heading>}
        {tenantId?.role !== 'owner' && <Heading>Site de {tenantId?.tenant.name}</Heading>}
        <div className="flex flex-row items-center gap-4">
        {tenantId?.role === 'editor' && <Button onClick={handleAddWebsite} className="cursor-pointer">
          Modifier un site
        </Button>}
        {tenantId?.role !== 'editor' && <Button onClick={handleAddWebsite} className="cursor-pointer">
          {t('addbtn')}
        </Button>}
        {tenantId?.role === 'owner' && <CogIcon className="size-8 cursor-pointer" onClick={handleAddTenant}/>}
        </div>
      </div>
      <WebsiteList />
    </>
  )
}
