'use client'

import { useUserSetPassword } from '@/hooks/useUser'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './button'
import { ErrorMessage, Field, Label } from './fieldset'
import { Input } from './input'
import Loading from './loading/loading'

type FormType = {
  password: string
  confirmPassword: string
}

const schema = z
  .object({
    password: z
      .string()
      .trim()
      .min(6, { message: 'error-form.password' })
      .regex(/[A-Z]/, { message: 'error-form.password-uppercase' }),

    confirmPassword: z
      .string()
      .trim()
      .min(6, { message: 'error-form.confirmPassword' })
      .regex(/[A-Z]/, { message: 'error-form.password-uppercase' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'error-form.password-not-match',
    path: ['confirmPassword'],
  })

export default function SetPassword({ verifyToken }: { verifyToken: { id: string; admin_user_id: number } }) {
  const t = useTranslations('setPasswordPage')
  //const [autoCompletePassUUID, setAutoCompletePassUUID] = useState('')
  const [autoCompletePassConfirmUUID, setAutoCompletePassConfirmUUID] = useState('')
  console.log(verifyToken)
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const { mutate, isPending: isSetPassword } = useUserSetPassword()

  useEffect(() => {
    //setAutoCompletePassUUID(crypto.randomUUID())
    setAutoCompletePassConfirmUUID(crypto.randomUUID())
  }, [])

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    if (verifyToken.id && verifyToken.admin_user_id) {
      mutate({
        id: verifyToken.id,
        admin_user_id: verifyToken.admin_user_id,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
    }
  }
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }
  return (
    <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center">
      {verifyToken && (
        <>
          {errors.root?.message && <span className="text-sm text-red-500">{t('error-form.500')}</span>}
          <form onSubmit={handleSubmit(onSubmit)} method="POST" className="w-full space-y-4" autoComplete="off">
            <div className="mb-10">
              <section className="my-5">
                <h1 className="text-4xl font-bold tracking-tight">Colibri</h1>
                <h2 className="my-5 text-xl font-bold">{t('form.title')}</h2>
                <div className="mt-5">
                  <Field>
                    <Label>{t('form.password')}</Label>
                    <Input
                      {...register('password')}
                      invalid={!!errors?.password}
                      type="password"
                      autoComplete="new-password"
                      onPaste={handlePaste}
                    />
                    {errors?.password && <ErrorMessage>{t(`${errors?.password?.message}`)}</ErrorMessage>}
                  </Field>
                </div>

                <div className="mt-5">
                  <Field>
                    <Label>{t('form.confirmPassword')}</Label>
                    <Input
                      {...register('confirmPassword')}
                      invalid={!!errors?.confirmPassword}
                      type="password"
                      autoComplete={autoCompletePassConfirmUUID}
                      onPaste={handlePaste}
                    />
                    {errors?.confirmPassword && <ErrorMessage>{t(`${errors?.confirmPassword?.message}`)}</ErrorMessage>}
                  </Field>
                </div>
              </section>
            </div>
            <div className="mt-10">
              <Button className="w-full cursor-pointer" type="submit" disabled={isSetPassword}>
                {isSetPassword && <Loading />} {t('form.submit')}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
