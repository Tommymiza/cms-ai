'use client'

import useCountryList from '@/hooks/useCountryList'
import { Role } from '@/lib/constant'
import authStore from '@/store/auth'
import { PersonalInfoType } from '@/types/types'
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
type CompanyInfoFormType = {
  name: string
  address: string
  city: string
  zipcode: string
  country: string
}
type InfoFormType = PersonalInfoType &
  CompanyInfoFormType & {
    confirmEmail: string
  }

const schema = z
  .object({
    title: z.string().trim().min(1, { message: 'company-form-error.title' }),
    lang_pref: z.string().trim().min(1, { message: 'company-form-error.lang_pref' }),
    lang_conv: z.string().trim().min(1, { message: 'company-form-error.lang_conv' }),
    firstname: z.string().trim().min(1, { message: 'company-form-error.firstName' }),
    lastname: z.string().trim().min(1, { message: 'company-form-error.lastName' }),
    email: z.string().email({ message: 'company-form-error.email' }),
    confirmEmail: z.string().email({ message: 'company-form-error.confirmEmail' }),
    country: z.string().trim().min(1, { message: 'company-form-error.country' }),
    name: z.string().trim().min(1, { message: 'company-form-error.name' }),
    address: z.string().trim().min(1, { message: 'company-form-error.address' }),
    city: z.string().trim().min(1, { message: 'company-form-error.city' }),
    zipcode: z.string().trim().min(1, { message: 'company-form-error.zipcode' }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'company-form-error.same-email',
    path: ['confirmEmail'],
  })
export default function CompanyRegisterForm() {
  const countryList = useCountryList()
  const t = useTranslations('registerPage')
  const [confirmEmailUUID, setConfirmEmailUUID] = useState('')
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
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
      console.log('data to add user', data)
      await addUser({
        ...data,
        username: data.email,
        role_code: Role.USER,
        company_id: {
          name: data.name,
          address: data.address,
          city: data.city,
          zipcode: data.zipcode,
          country: data.country,
        },
      } as any)
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
      <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6" autoComplete="off">
        {/* personal Info */}
        <div className="mb-10">
          <section className="my-5">
            <h2 className="my-5 text-xl font-bold">{t('company-form.personal-info.section-title')}</h2>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.personal-info.title')}</Label>
                <Select {...register('title')} invalid={!!errors?.title}>
                  <option value="">{t('input-select.select-one')}</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Md">Md</option>
                </Select>
                {errors?.title && <ErrorMessage>{t(`${errors?.title?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.personal-info.lang_pref')}</Label>
                <Select {...register('lang_pref')} invalid={!!errors?.lang_pref}>
                  <option value="">{t('input-select.select-one')}</option>
                  <option value="fr">Fr</option>
                  <option value="en">En</option>
                </Select>
                {errors?.lang_pref && <ErrorMessage>{t(`${errors?.lang_pref?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.personal-info.lang_conv')}</Label>
                <Select {...register('lang_conv')} invalid={!!errors?.lang_conv}>
                  <option value="">{t('input-select.select-one')}</option>
                  <option value="fr">Fr</option>
                  <option value="en">En</option>
                </Select>
                {errors?.lang_conv && <ErrorMessage>{t(`${errors?.lang_conv?.message}`)}</ErrorMessage>}
              </Field>
            </div>

            <div className="mt-5">
              <Field>
                <Label>{t('company-form.personal-info.firstName')}</Label>
                <Input {...register('firstname')} invalid={!!errors?.firstname} />
                {errors?.firstname && <ErrorMessage>{t(`${errors?.firstname?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.personal-info.lastName')}</Label>
                <Input {...register('lastname')} invalid={!!errors?.lastname} />
                {errors?.lastname && <ErrorMessage>{t(`${errors?.lastname?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.personal-info.email')}</Label>
                <Input {...register('email')} invalid={!!errors?.email} autoComplete="email" />
                {errors?.email && <ErrorMessage>{t(`${errors?.email?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.personal-info.confirmEmail')}</Label>
                <Input
                  {...register('confirmEmail')}
                  onPaste={handlePaste}
                  invalid={!!errors?.confirmEmail}
                  autoComplete={confirmEmailUUID}
                />
                {errors?.confirmEmail && <ErrorMessage>{t(`${errors?.confirmEmail?.message}`)}</ErrorMessage>}
              </Field>
            </div>
          </section>

          {/* company Info */}
          <section className="mb-5 mt-8">
            <h2 className="my-5 text-xl font-bold">{t('company-form.company-info.section-title')}</h2>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.company-info.name')}</Label>
                <Input {...register('name')} invalid={!!errors?.name} />
                {errors?.name && <ErrorMessage>{t(`${errors?.name?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.company-info.address')}</Label>
                <Input {...register('address')} invalid={!!errors?.address} />
                {errors?.address && <ErrorMessage>{t(`${errors?.address?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.company-info.city')}</Label>
                <Input {...register('city')} invalid={!!errors?.city} />
                {errors?.city && <ErrorMessage>{t(`${errors?.city?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.company-info.zipcode')}</Label>
                <Input {...register('zipcode')} invalid={!!errors?.zipcode} />
                {errors?.zipcode && <ErrorMessage>{t(`${errors?.zipcode?.message}`)}</ErrorMessage>}
              </Field>
            </div>
            <div className="mt-5">
              <Field>
                <Label>{t('company-form.company-info.country')}</Label>
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
          </section>
        </div>
        <div className="mt-10">
          <Button className="w-full cursor-pointer" type="submit" disabled={isPending}>
            {isPending && <Loading />} {t('company-form.submit')}
          </Button>
        </div>
      </form>
    </div>
  )
}
