'use client'
import authStore from '@/store/auth'
import userStore from '@/store/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from './button'
import { ErrorMessage, Field, Label } from './fieldset'
import { Input } from './input'
import Loading from './loading/loading'

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
  const { auth } = authStore()
  const router = useRouter()
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email: auth?.email },
  })
  const { recoveryPassword, loading } = userStore()
  const [isSent, setIsSent] = useState(false)

  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      const res = await recoveryPassword(data.email)
      if (res.status === 200 || res.status === 201) {
        setIsSent(true)
      }
      if (isErrorInList(res?.status)) {
        setError('root', { message: 'error-form.credential-error' })
      }
      if (isServerErrorInList(res?.status)) {
        setError('root', { message: 'error-form.server-error' })
      }
    } catch (error) {
      console.log(error)
      toast.error(t('error-form.500'))
    }
  }

  return (
    <>
      {!isSent ? (
        <div className="mt-5">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {errors.root && <span className="text-[12px] text-red-500">{t(`${errors.root.message}`)}</span>}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
            <div>
              <div className="mt-2">
                <Field>
                  <Label htmlFor="email">{t('form.email')}</Label>
                  <Input id="email" {...register('email')} invalid={!!errors?.email} disabled />
                  {errors?.email && <ErrorMessage>{t(`${errors?.email?.message}`)}</ErrorMessage>}
                </Field>
              </div>
            </div>

            <div className="mt-12">
              <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
                {isSubmitting && loading && <Loading />} {t('form.submit')}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <p className="mt-4 text-base text-gray-500">{t('success-form.description')}</p>
      )}
    </>
  )
}
