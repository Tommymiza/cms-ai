'use client'

import { useTranslations } from 'next-intl'
import { Button } from './button'
import { TenantMemberShip } from '@/store/tenant/type'
import axios from '@/lib/axios'

export default function Invitation({tenant}: {tenant: TenantMemberShip}) {
  const t = useTranslations('setPasswordPage')
  const onSubmit = async () => {
    console.log("SUBMIT INVITATION",tenant)
    const token = localStorage.getItem('auth')
    if (!token) {
      return
    }
    const response = await axios.post('/users-permissions/invitation-accept', 
      {
        tenantId: tenant.id
      },
      {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if (response.status !== 200) {
      throw new Error('Failed to accept invitation')
    }
    const data = await response.data
    console.log("data:",data)
    window.location.href = '/'
  }

  const onRefuse = async () => {
    
  }
  return (
    <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center">
      <>
          <h1 className="text-2xl font-bold">Invitation:</h1>
          <p>
            Voulez-vous accepter l&apos;invitation pour le tenant {tenant.tenant.name} ?
          </p>
            <div className="mt-10">
              <Button className="w-full cursor-pointer" onClick={onSubmit}>
                Accepter l&apos;invitation
              </Button>
            </div>
            <div className="mt-10">
              <Button className="w-full cursor-pointer" outline onClick={onRefuse}>
                Refuser l&apos;invitation
              </Button>
            </div>
        </>
    </div>
  )
}
