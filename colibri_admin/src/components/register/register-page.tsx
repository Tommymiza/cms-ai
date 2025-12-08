'use client'
import { Fieldset, Label } from '@/components/fieldset'
import Loading from '@/components/loading/loading'
import { Radio, RadioField, RadioGroup } from '@/components/radio'
import CompanyRegisterForm from '@/components/register/company-register-form'
import PersonalRegisterFrom from '@/components/register/personal-register-form'
import { useTranslations } from 'next-intl'
import { default as Link, default as NextLink } from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function Register() {
  const t = useTranslations('registerPage')
  const [selectedType, setSelectedType] = useState('personal')
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const query = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search)
    }
  }, [])
  useEffect(() => {
    if (query) {
      if (!query.has('type')) {
        query.set('type', selectedType)
        router.replace(`${window.location.pathname}?${query.toString()}`)
        console.log('query', query.toString())
      } else {
        setSelectedType(query.get('type') as string)
      }
      setIsLoading(false)
    }
  }, [router, selectedType, query])

  const handleSetSelectedType = (value: string) => {
    console.log('value', value)
    setSelectedType(value)
    if (query) {
      query.set('type', value)
      router.replace(`${window.location.pathname}?${query.toString()}`)
    }
  }
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }
  return (
    <div className="my-10 flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/">
            <h1 className="text-4xl font-bold tracking-tight">Colibri</h1>
          </Link>
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight">{t('title')}</h2>
        </div>

        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mb-10">
            <Fieldset>
              <RadioGroup
                name="resale"
                defaultValue={selectedType}
                className="flex flex-row items-center gap-4"
                onChange={(value) => handleSetSelectedType(value)}
              >
                <RadioField>
                  <Radio value="company" />
                  <Label>{t('choice-form.company')}</Label>
                </RadioField>
                <RadioField>
                  <Radio value="personal" />
                  <Label>{t('choice-form.personal')}</Label>
                </RadioField>
              </RadioGroup>
            </Fieldset>
          </div>
          {selectedType === 'personal' && <PersonalRegisterFrom />}
          {selectedType === 'company' && <CompanyRegisterForm />}

          <p className="mt-10 text-center text-sm text-gray-500">
            {t('already-account')}{' '}
            <NextLink href="/login" className="font-semibold leading-6 text-indigo-500">
              {t('already-account-link')}
            </NextLink>
          </p>
        </div>
      </div>
    </div>
  )
}
