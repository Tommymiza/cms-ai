'use client'

import { Button } from '@/components/button'
import { useTranslations } from 'next-intl'

export default function BtnLogin() {
  const t = useTranslations('homePage')
  return <Button>{t('login')}</Button>
}
