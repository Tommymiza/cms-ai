'use client'

import useCountryList from '@/hooks/useCountryList'
import { ACCEPTED_IMAGE_PROFILE_TYPES, MAX_SIZE_IMAGE_PROFILE } from '@/lib/constant'
import { uploadSingleFile } from '@/lib/upload/upload'
import { setUrlPhoto } from '@/lib/util'
import authStore from '@/store/auth'
import userStore from '@/store/user'
import { UserItem } from '@/store/user/type'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../button'
import { ErrorMessage, Field, Label } from '../fieldset'
import { Input } from '../input'
import Loading from '../loading/loading'
import ProfileForm from '../ProfileForm'
import { Select } from '../select'

type CompanyEditProfileFormProps = {
  data: UserItem
}

const schema = z.object({
  title: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  lang_pref: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  lang_conv: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  firstname: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  lastname: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  email: z.string().email({ message: 'Veuillez entrer une valeur' }),
  country: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  name: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  address: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  city: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
  zipcode: z.string().trim().min(1, { message: 'Veuillez entrer une valeur' }),
})

export default function CompanyEditProfileForm({ data }: CompanyEditProfileFormProps) {
  const { getMe } = authStore()
  const { updateUser, loading: isPending } = userStore()
  const countryList = useCountryList()
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title,
      lang_pref: data.lang_pref ?? 'fr',
      lang_conv: data.lang_conv ?? 'fr',
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      country: data?.country.toString(),
      name: data.company_id?.name,
      address: data.company_id?.address,
      city: data.company_id?.city,
      zipcode: data.company_id?.zipcode,
    },
    mode: 'onChange',
  })
  const t = useTranslations('registerPage')
  useEffect(() => {
    if (data.photo) {
      setPreviewImageUrl(setUrlPhoto(data.photo.url))
    }
  }, [data.photo])

  useEffect(() => {
    console.log('data error', errors)
  }, [errors])

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!ACCEPTED_IMAGE_PROFILE_TYPES.includes(file.type)) {
        toast.error('Only image file is allowed')
        return
      }
      if (file.size > MAX_SIZE_IMAGE_PROFILE) {
        toast.error('Max size is 5MB')
        return
      }
      const objectUrl = URL.createObjectURL(file)
      setPreviewImageUrl(objectUrl)
      setFile(file)
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (dataSubmited) => {
    try {
      let profilePhoto = data?.photo
      if (file) {
        profilePhoto = await uploadSingleFile(file, data.photo)
        // console.log('photo', JSON.stringify(profilePhoto))
      }
      if (
        data?.company_id?.id &&
        data?.company_id?.name &&
        data?.company_id?.zipcode &&
        data?.company_id?.address &&
        data?.company_id?.city &&
        data?.company_id?.country
      ) {
        const newData = {
          ...dataSubmited,
          photo: profilePhoto,
          company_id: {
            id: Number(data.company_id?.id!),
            name: data.company_id?.name!,
            zipcode: data.company_id?.zipcode!,
            address: data.company_id?.address!,
            city: data.company_id?.city!,
            country: data.company_id?.country!,
          },
        }
        await updateUser({ id: data.id, user: newData as any })
        await getMe()
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-6">
      {/* personal Info */}
      <div className="mb-10">
        <section className="my-5">
          <h2 className="my-5 text-xl font-bold">{t('company-form.personal-info.section-title')}</h2>
          <div className="mt-2">
            <ProfileForm preview={previewImageUrl} onChange={handleProfileChange} />
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.personal-info.title')}</Label>
              <Select {...register('title')} invalid={!!errors?.title}>
                <option value="">Select one</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Md">Md</option>
              </Select>
              {errors?.title && <ErrorMessage>{errors?.title?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.personal-info.lang_pref')}</Label>
              <Select {...register('lang_pref')} invalid={!!errors?.lang_pref}>
                <option value="">Select one</option>
                <option value="fr">Fr</option>
                <option value="en">En</option>
              </Select>
              {errors?.lang_pref && <ErrorMessage>{errors?.lang_pref?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.personal-info.lang_conv')}</Label>
              <Select {...register('lang_conv')} invalid={!!errors?.lang_conv}>
                <option value="">Select one</option>
                <option value="fr">Fr</option>
                <option value="en">En</option>
              </Select>
              {errors?.lang_conv && <ErrorMessage>{errors?.lang_conv?.message}</ErrorMessage>}
            </Field>
          </div>

          <div className="mt-5">
            <Field>
              <Label>{t('company-form.personal-info.firstName')}</Label>
              <Input {...register('firstname')} invalid={!!errors?.firstname} />
              {errors?.firstname && <ErrorMessage>{errors?.firstname?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.personal-info.lastName')}</Label>
              <Input {...register('lastname')} invalid={!!errors?.lastname} />
              {errors?.lastname && <ErrorMessage>{errors?.lastname?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.personal-info.email')}</Label>
              <Input {...register('email')} invalid={!!errors?.email} disabled />
              {errors?.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
            </Field>
          </div>
        </section>

        {/* company Info */}
        <section className="my-5">
          <h2 className="my-5 text-xl font-bold">{t('company-form.company-info.section-title')}</h2>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.company-info.name')}</Label>
              <Input {...register('name')} invalid={!!errors?.name} />
              {errors?.name && <ErrorMessage>{errors?.name?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.company-info.address')}</Label>
              <Input {...register('address')} invalid={!!errors?.address} />
              {errors?.address && <ErrorMessage>{errors?.address?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.company-info.city')}</Label>
              <Input {...register('city')} invalid={!!errors?.city} />
              {errors?.city && <ErrorMessage>{errors?.city?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.company-info.zipcode')}</Label>
              <Input {...register('zipcode')} invalid={!!errors?.zipcode} />
              {errors?.zipcode && <ErrorMessage>{errors?.zipcode?.message}</ErrorMessage>}
            </Field>
          </div>
          <div className="mt-5">
            <Field>
              <Label>{t('company-form.company-info.country')}</Label>
              <Select {...register('country')} invalid={!!errors?.country}>
                <option value="">Select one</option>
                {countryList.map((country) => (
                  <option key={country.id} value={country.id.toString()}>
                    {country.name}
                  </option>
                ))}
              </Select>
              {errors?.country && <ErrorMessage>{errors?.country?.message}</ErrorMessage>}
            </Field>
          </div>
        </section>
      </div>
      <div className="mt-10">
        <Button className="cursor-pointer" type="submit" disabled={isPending || isSubmitting}>
          {(isPending || isSubmitting) && <Loading />}
          {t('company-form.edit-submit')}
        </Button>
      </div>
    </form>
  )
}
