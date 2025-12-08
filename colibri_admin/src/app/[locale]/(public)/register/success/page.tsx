import { useTranslations } from 'next-intl'

export default function RegisterSuccess() {
  const t = useTranslations('registerSuccessPage')
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-10 text-center text-sm text-gray-500">{t('description')}</p>
    </div>
  )
}
