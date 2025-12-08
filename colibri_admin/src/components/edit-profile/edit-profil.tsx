'use client'
import authStore from '@/store/auth'
import Loading from '../loading/loading'
import CompanyEditProfileForm from './company-edit-profile-form'
import PersonalEditProfileForm from './personal-edit-profile-form'
export default function EditProfil() {
  const { auth: user, loading: isLoading } = authStore()
  if (isLoading) {
    return (
      <div className="flex h-[150px] flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }
  return (
    <div className="w-[70%]">
      <>
        {user && user.company_id && (
          <div>
            <CompanyEditProfileForm data={user} />
          </div>
        )}
      </>
      <>
        {user && !user.company_id && (
          <div>
            <PersonalEditProfileForm data={user} />
          </div>
        )}
      </>
    </div>
  )
}
