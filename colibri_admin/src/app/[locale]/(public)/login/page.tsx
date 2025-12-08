'use client'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import FacebookSiginBtn from '@/components/facebook-sigin-btn'
import { ErrorMessage, Field, Label } from '@/components/fieldset'
import GoogleSiginBtn from '@/components/google-sigin-btn'
import { Input } from '@/components/input'
import Loading from '@/components/loading/loading'
import authStore from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
const schema = z.object({
  identifier: z.string().email({ message: 'error-form.email' }),
  password: z.string().trim(),
})
type User = z.infer<typeof schema>
export default function Login() {
  const t = useTranslations('loginPage')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  })
  const { login, getMe, auth, loading } = authStore()

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      await login(data)
      await getMe()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (token) {
      localStorage.setItem('auth', token)
    }
  }, [token])

  if (loading || auth) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight">Colibri</h1>
          </Link>
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight">{t('title')}</h2>
          <p className="text-sm text-gray-500">{t('form.sub-title')}</p>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mb-6 mt-4 flex flex-row items-center justify-center gap-3">
            <GoogleSiginBtn />
            <FacebookSiginBtn />
          </div>

          <div className="flex flex-row items-center justify-center gap-3">
            <Divider /> <span className="text-sm text-gray-500">{t('form.or')}</span> <Divider />
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {errors.root && <span className="text-[12px] text-red-500">{t(`${errors.root.message}`)}</span>}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
            <div>
              <div className="mt-2">
                <Field>
                  <Label htmlFor="email">{t('form.email')}</Label>
                  <Input id="email" {...register('identifier')} invalid={!!errors?.identifier} />
                  {errors?.identifier && <ErrorMessage>{t(`${errors?.identifier?.message}`)}</ErrorMessage>}
                </Field>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between"></div>
              <div className="mt-2">
                <Field>
                  <Label htmlFor="password">{t('form.password')}</Label>
                  <Input id="password" type="password" {...register('password')} invalid={!!errors?.password} />
                  {errors?.password && <ErrorMessage>{t(`${errors?.password?.message}`)}</ErrorMessage>}
                </Field>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                <a href="/forgot-password" className="text-[12px] font-semibold text-indigo-500 hover:text-indigo-500">
                  {t('form.forgotPassword')}
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Button className="w-full cursor-pointer" type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loading />} {t('form.login')}
              </Button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            {t('form.noAcount')}{' '}
            <a href="/register" className="font-semibold leading-6 text-indigo-500 hover:text-indigo-500">
              {t('form.createAccount')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
