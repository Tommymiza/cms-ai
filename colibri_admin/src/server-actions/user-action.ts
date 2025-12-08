'use server'

import { createServerAction, ServerActionError } from '@/lib/action-utils'
import axios from '@/lib/axios'
import service from '@/services/Service'
import { PersonalInfoType, UserType } from '@/types/types'
export const addPersonalInfo = createServerAction(async (data: PersonalInfoType) => {
  try {
    const res = await service.users.createWithPersonalType(data)
    return res
  } catch (error) {
    throw new ServerActionError(JSON.stringify(error))
  }
})

export const addPersonalInfoWithCompany = createServerAction(async (data: PersonalInfoType) => {
  try {
    const res = await service.users.createWithCompanyType(data)
    return res
  } catch (error) {
    throw new ServerActionError(JSON.stringify(error))
  }
})

export const setPassword = createServerAction(async (data: any) => {
  try {
    const res = await axios.post(`/users-permissions/auth/init-password`, data)
    return res
  } catch (error) {
    console.log('erreur serveur', error)
    throw new ServerActionError(JSON.stringify(error))
  }
})

export const verifyBeforeSetPassword = createServerAction(async (data: any) => {
  try {
    const res = await axios.get(`/users-permissions/auth/registration-check?token=${data.token}`)
    return res.data.data
  } catch (error) {
    throw new ServerActionError(JSON.stringify(error))
  }
})

export const verifyBeforeInvitation = createServerAction(async (data: any) => {
  try {
    const res = await axios.get(`/users-permissions/invitation-check?token=${data.token}`, {
      headers: {
        Authorization: `Bearer ${data.auth}`,
      },
    })
    return res.data.data
  } catch (error) {
    throw new ServerActionError(JSON.stringify(error))
  }
})

export const login = createServerAction(async (data: any) => {
  try {
    const res = await service.users.login(data)
    return res
  } catch (error) {
    console.log('error on login action:', error)
    throw new ServerActionError(JSON.stringify(error))
  }
})

export const editPersonalInfoWithCompany = createServerAction(
  async (userId: number, companyId: number, data: PersonalInfoType) => {
    try {
      const res = await service.users.editProfileUserWithCompany(userId, companyId, data)
      return res
    } catch (error) {
      throw new ServerActionError(JSON.stringify(error))
    }
  }
)

export const editPersonalInfo = createServerAction(async (userId: number, data: UserType) => {
  try {
    const res = await service.users.editProfileUser(userId, data)
    return res
  } catch (error) {
    throw new ServerActionError(JSON.stringify(error))
  }
})

export const handleVerifyPasswordBeforeChange = createServerAction(async (data: any) => {
  try {
    const res = await axios.post('/users-permissions/user/verify-password', data)
    return res
  } catch (error) {
    throw new ServerActionError(JSON.stringify(error))
  }
})
