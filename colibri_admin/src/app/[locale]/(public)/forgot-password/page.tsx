'use client'
import { Button } from '@/components/button'
import { ErrorMessage, Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import Loading from '@/components/loading/loading'
import userStore from '@/store/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
const schema = z.object({
  email: z.string().email({ message: 'error-form.email' }),
})
type User = z.infer<typeof schema>

const errorList = [400, 401, 403, 404, 405, 406, 408, 410, 422]
const serverErrorList = [500]

const isErrorInList = (number: number) => errorList.includes(number)
const isServerErrorInList = (number: number) => serverErrorList.includes(number)

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPasswordPage')
  const router = useRouter()
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const { recoveryPassword, loading } = userStore()

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const res = await recoveryPassword(data.email)
      if (res.status === 200 || res.status === 201) {
        router.push('/forgot-password/success')
      }
      if (isErrorInList(res?.status)) {
        setError('root', { message: 'error-form.credential-error' })
      }
      if (isServerErrorInList(res?.status)) {
        setError('root', { message: 'error-form.server-error' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight">Colibri</h1>
          </Link>
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight">{t('title')}</h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {errors.root && <span className="text-[12px] text-red-500">{t(`${errors.root.message}`)}</span>}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
            <div>
              <div className="mt-2">
                <Field>
                  <Label htmlFor="email">{t('form.email')}</Label>
                  <Input id="email" {...register('email')} invalid={!!errors?.email} />
                  {errors?.email && <ErrorMessage>{t(`${errors?.email?.message}`)}</ErrorMessage>}
                </Field>
              </div>
            </div>

            <div className="mt-12">
              <Button className="w-full cursor-pointer" type="submit" disabled={isSubmitting}>
                {isSubmitting && loading && <Loading />} {t('form.submit')}
              </Button>
            </div>
          </form>
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
