'use client'
import useCountryList from '@/hooks/useCountryList'
import authStore from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../button'
import { ErrorMessage, Field, Label } from '../fieldset'
import { Input } from '../input'
import Loading from '../loading/loading'
import { Select } from '../select'

const schema = z
  .object({
    title: z.string().trim().min(1, { message: 'personal-form-error.title' }),
    lang_pref: z.string().trim().min(1, { message: 'personal-form-error.lang_pref' }),
    lang_conv: z.string().trim().min(1, { message: 'personal-form-error.lang_conv' }),
    firstname: z.string().trim().min(1, { message: 'personal-form-error.firstName' }),
    lastname: z.string().trim().min(1, { message: 'personal-form-error.lastName' }),
    email: z.string().email({ message: 'personal-form-error.email' }),
    confirmEmail: z.string().email({ message: 'personal-form-error.confirmEmail' }),
    country: z.string().trim().min(1, { message: 'personal-form-error.country' })
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'personal-form-error.same-email',
    path: ['confirmEmail'],
  })

export default function PersonalRegisterForm() {
  const countryList = useCountryList()
  const t = useTranslations('registerPage')
  const [confirmEmailUUID, setConfirmEmailUUID] = useState('')
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const [isPending, setPending] = useState<boolean>(false)
  const { register: addUser } = authStore()

  useEffect(() => {
    setConfirmEmailUUID(crypto.randomUUID())
  }, [])

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      setPending(true)
      await addUser({ ...data, role_code: 'strapi-author' } as any)
    } catch (error) {
      console.log(error)
    } finally {
      setPending(false)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
  }
  return (
    <div>
      <span className="text-center text-sm text-red-500">{errors.root?.message && errors.root.message}</span>
      <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-4" autoComplete="off">
        <div className="mb-10 space-y-4">
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.title')}</Label>
              <Select {...register('title')} invalid={!!errors?.title}>
                <option value="">{t('input-select.select-one')}</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Md">Md</option>
              </Select>
              {errors?.title && <ErrorMessage>{t(`${errors?.title?.message}`)}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.lang_pref')}</Label>
              <Select {...register('lang_pref')} invalid={!!errors?.title}>
                <option value="">{t('input-select.select-one')}</option>
                <option value="fr">Fr</option>
                <option value="en">En</option>
              </Select>
              {errors?.title && <ErrorMessage>{t(`${errors?.title?.message}`)}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.lang_conv')}</Label>
              <Select {...register('lang_conv')} invalid={!!errors?.title}>
                <option value="">{t('input-select.select-one')}</option>
                <option value="fr">Fr</option>
                <option value="en">En</option>
              </Select>
              {errors?.title && <ErrorMessage>{t(`${errors?.title?.message}`)}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.firstName')}</Label>
              <Input {...register('firstname')} invalid={!!errors?.firstname} />
              {errors?.firstname && <ErrorMessage>{t(`${errors?.firstname?.message}`)}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.lastName')}</Label>
              <Input {...register('lastname')} invalid={!!errors?.lastname} />
              {errors?.lastname && <ErrorMessage>{t(`${errors?.lastname?.message}`)}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.email')}</Label>
              <Input {...register('email')} invalid={!!errors?.email} autoComplete="email" />
              {errors?.email && <ErrorMessage>{t(`${errors?.email?.message}`)}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.confirmEmail')}</Label>
              <Input
                onPaste={handlePaste}
                {...register('confirmEmail')}
                invalid={!!errors?.confirmEmail}
                autoComplete={confirmEmailUUID}
              />
              {errors?.confirmEmail && <ErrorMessage>{t(`${errors?.confirmEmail?.message}`)}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-2">
            <Field>
              <Label>{t('personal-form.country')}</Label>
              <Select {...register('country')} invalid={!!errors?.country}>
                <option value="">{t('input-select.select-one')}</option>
                {countryList.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </Select>
              {errors?.country && <ErrorMessage>{t(`${errors?.country?.message}`)}</ErrorMessage>}
            </Field>
          </div>
        </div>
        <div className="">
          <Button className="w-full cursor-pointer" type="submit" disabled={isPending}>
            {isPending && <Loading />}
            {t('personal-form.submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}
