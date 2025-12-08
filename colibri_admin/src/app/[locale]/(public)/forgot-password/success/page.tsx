import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
export default async function page() {
  const t = await getTranslations('forgotPasswordPage')
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight">Colibri</h1>
          </Link>
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight">{t('success-form.title')}</h2>
          <p className="mt-4 text-base text-gray-500">{t('success-form.description')}</p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="mt-10 text-center text-sm text-gray-500">
            <a href="/login" className="font-semibold leading-6 text-indigo-500 hover:text-indigo-500">
              {t('form.back-login')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
