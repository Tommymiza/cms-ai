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

type PersonalEditProfileFormProps = {
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
})

export default function PersonalEditProfileForm({ data }: PersonalEditProfileFormProps) {
  const { updateUser, loading: isPending } = userStore()
  const { auth, getMe } = authStore()
  const countryList = useCountryList()
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: data.title,
      lang_pref: data.lang_pref ?? 'fr',
      lang_conv: data.lang_conv ?? 'fr',
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      country: String(data.country),
    },
  })

  useEffect(() => {
    if (data.photo) {
      setPreviewImageUrl(setUrlPhoto(data.photo.url))
    }
  }, [data.photo])

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
      if (auth) {
        let profile = data?.photo
        if (file) {
          profile = await uploadSingleFile(file, data.photo)
          // console.log('photo', profile)
        }
        console.log('profile', profile)
        console.log('dataSubmited', dataSubmited)
        await updateUser({
          id: auth.id,
          user: { ...dataSubmited, photo: profile } as any,
        })
        await getMe()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const t = useTranslations('registerPage')
  return (
    <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-4">
      <div className="mb-10 space-y-4">
        <div className="mt-2">
          <ProfileForm preview={previewImageUrl} onChange={handleProfileChange} />
        </div>
        <div className="mt-2">
          <Field>
            <Label>{t('personal-form.title')}</Label>
            <Select {...register('title')} invalid={!!errors?.title}>
              <option value="">Select one</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Md">Md</option>
            </Select>
            {errors?.title && <ErrorMessage>{errors?.title?.message}</ErrorMessage>}
          </Field>
        </div>
        <div className="mt-2">
          <Field>
            <Label>{t('personal-form.lang_pref')}</Label>
            <Select {...register('lang_pref')} invalid={!!errors?.lang_pref}>
              <option value="">Select one</option>
              <option value="fr">Fr</option>
              <option value="en">En</option>
            </Select>
            {errors?.lang_pref && <ErrorMessage>{errors?.lang_pref?.message}</ErrorMessage>}
          </Field>
        </div>

        <div className="mt-2">
          <Field>
            <Label>{t('personal-form.lang_conv')}</Label>
            <Select {...register('lang_conv')} invalid={!!errors?.lang_conv}>
              <option value="">Select one</option>
              <option value="fr">Fr</option>
              <option value="en">En</option>
            </Select>
            {errors?.lang_conv && <ErrorMessage>{errors?.lang_conv?.message}</ErrorMessage>}
          </Field>
        </div>

        <div className="mt-2">
          <Field>
            <Label>{t('personal-form.firstName')}</Label>
            <Input {...register('firstname')} invalid={!!errors?.firstname} />
            {errors?.firstname && <ErrorMessage>{errors?.firstname?.message}</ErrorMessage>}
          </Field>
        </div>
        <div className="mt-2">
          <Field>
            <Label>{t('personal-form.lastName')}</Label>
            <Input {...register('lastname')} invalid={!!errors?.lastname} />
            {errors?.lastname && <ErrorMessage>{errors?.lastname?.message}</ErrorMessage>}
          </Field>
        </div>
        <div className="mt-2">
          <Field>
            <Label>{t('personal-form.email')}</Label>
            <Input {...register('email')} invalid={!!errors?.email} disabled />
            {errors?.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
          </Field>
        </div>
        <div className="mt-2">
          <Field>
            <Label>{t('personal-form.country')}</Label>
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
      </div>
      <div className="w-full">
        <Button className="cursor-pointer" type="submit" disabled={isPending || isSubmitting}>
          {(isPending || isSubmitting) && <Loading />}
          {t('personal-form.edit-submit')}
        </Button>
      </div>
    </form>
  )
}
