import { verifyBeforeSetPassword } from '@/server-actions/user-action'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import Link from 'next/link'
const SetPassword = dynamic(() => import('@/components/set-password'), { ssr: false })
export default async function SetPasswordPage({ searchParams }: { searchParams: { token: string } }) {
  const t = await getTranslations('setPasswordPage')
  const data = await verifyBeforeSetPassword({ token: searchParams.token })
  console.log('data xxx', data)
  if (
    data.success === false &&
    (data.error.status === 400 ||
      data.error.status === 409 ||
      data.error.status === 401 ||
      data.error.status === 403 ||
      data.error.status === 404)
  ) {
    return (
      <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center">
        <div className="text-red-600">{t('error-form.403')}</div>
        <Link className="mt-5 cursor-pointer" href="/">
          {t('form.goHome')}
        </Link>
      </div>
    )
  }
  if (data.success === false && (data.error.status === 500 || data.error.status === 501)) {
    return (
      <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center">
        <div className="text-red-600">{t('error-form.500')}</div>
        <Link className="mt-5 cursor-pointer" href="/">
          {t('form.goHome')}
        </Link>
      </div>
    )
  }
  if (data.success === true) {
    return <SetPassword verifyToken={data.data as any} />
  }
}
