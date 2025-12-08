import Invitation from '@/components/invitation'
import { verifyBeforeInvitation } from '@/server-actions/user-action'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
export default async function InvitationPage({ searchParams }: { searchParams: { token: string } }) {
  const data = await verifyBeforeInvitation({ token: searchParams.token})
  console.log('data xxx', data)
  if (
    data.success === false 
  ) {
    return (
      <div className="mx-auto flex h-screen max-w-md flex-col items-center justify-center">
        <div className="text-red-600">Une erreur est survenue</div>
        <Link className="mt-5 cursor-pointer" href="/">
          Retourner à l&apos;accueil
        </Link>
      </div>
    )
  }
  if (data.success === true) {
    return <Invitation tenant={data.data.tenant}/>
  }
}
