// import { useRouter } from 'next/navigation'

// import { useTranslations } from 'next-intl'
import NavbarHome from '@/components/navbar-home'
import { Pricing } from '@/components/pricing'
import { Fragment } from 'react'

export default async function Home() {
  return (
    <Fragment>
      <NavbarHome />
      <Pricing />
    </Fragment>
  )
}
