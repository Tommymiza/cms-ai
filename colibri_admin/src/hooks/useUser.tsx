'use client'

import {
  addPersonalInfo,
  addPersonalInfoWithCompany,
  editPersonalInfo,
  editPersonalInfoWithCompany,
  handleVerifyPasswordBeforeChange,
  setPassword,
  verifyBeforeSetPassword,
} from '@/server-actions/user-action'
import service from '@/services/Service'
import userStore from '@/store/user'
import { InfoFormType, PersonalInfoFormType } from '@/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'

type EditPassworFormType = {
  password: string
}
export const useUserWithTypePersonal = (setError: UseFormSetError<PersonalInfoFormType>) => {
  const { mutate, isPending } = useMutation({
    mutationFn: addPersonalInfo,
    onSuccess: (data) => {
      console.log('data :', data)
      //   router.push('/register/success')
      if (data.success === false && data.error.status === 409) {
        setError('email', { type: 'submit', message: 'personal-form-error.alerady-email' })
        return
      }
      if (data.success === false) {
        setError('root', { type: 'submit', message: data.error.message })
        return
      }
      window.location.href = '/register/success'
    },
    onError: (error) => {
      console.log('error with add personal :', error)
      if (error.message.includes('409')) {
        setError('email', { type: 'submit', message: 'personal-form-error.alerady-email' })
        return
      }
      setError('root', { type: 'submit', message: 'personal-form-error.500' })
    },
  })

  return {
    mutate,
    isPending,
  }
}

export const useUserWithTypeCompany = (setError: UseFormSetError<InfoFormType>) => {
  const { mutate, isPending } = useMutation({
    mutationFn: addPersonalInfoWithCompany,
    onSuccess: (data) => {
      //   console.log('data dede :', data)
      if (data.success === false && data.error.status === 409) {
        setError('email', { type: 'submit', message: 'company-form-error.alerady-email' })
        return
      }
      if (data.success === false) {
        setError('root', { type: 'submit', message: data.error.message })
        return
      }
      window.location.href = '/register/success'
    },
    onError: (error) => {
      if (error.message.includes('409')) {
        setError('email', { type: 'submit', message: 'company-form-error.alerady-email' })
        return
      }
      setError('root', { type: 'submit', message: 'company-form-error.500' })
    },
  })

  return {
    mutate,
    isPending,
  }
}
export const useEditUserWithTypeCompany = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ userId, companyId, data }: { userId: number; companyId: number; data: any }) =>
      editPersonalInfoWithCompany(userId, companyId, { ...data, userId: userId, companyId: companyId }),
    onSuccess: (data) => {
      console.log('Data updated successfully:', data)
      if (data.success) {
        toast.success('Profile updated successfully')
      }
      // Rediriger si nécessaire
      // window.location.href = '/register/success'
    },
    onError: (error) => {
      console.error('Error updating user with company:', error)
    },
  })

  return {
    mutate,
    isPending,
  }
}

export const useEditUser = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: any }) => editPersonalInfo(userId, { ...data, id: userId }),
    onSuccess: (data) => {
      console.log('Data updated successfully:', data)
      if (data.success) {
        toast.success('Profile updated successfully')
      }
      // Rediriger si nécessaire
      // window.location.href = '/register/success'
    },
    onError: (error) => {
      console.error('Error updating user with company:', error)
    },
  })

  return {
    mutate,
    isPending,
  }
}

export const useUserSetPassword = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: setPassword,
    onSuccess: (data) => {
      if (data) {
        toast.success('Password updated successfully')
      }
      window.location.href = '/login'
    },
    onError: (error) => {
      console.log('error with set password :', error)
      window.location.href = '/login'
    },
  })

  return {
    mutate,
    isPending,
  }
}
export const useVerifyBeforeSetPassword = (params: any) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['verifyBeforeSetPassword', params],
    queryFn: async () => await verifyBeforeSetPassword(params),
  })
  return {
    data,
    isLoading,
    error,
  }
}

export const useGetUserList = () => {
  const { getUsers } = userStore()
  const { data, isLoading, error } = useQuery({
    queryKey: ['getUserList'],
    queryFn: async () => {
      const res = await getUsers()
      return res ?? []
    },
  })
  return {
    data,
    isLoading,
    error,
  }
}

export const useGetOneUser = (userId: number | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['get one user', userId],
    queryFn: async () => {
      if (!userId) return null
      const res = await service.users.getOne(userId)
      return res
    },
    enabled: !!userId,
  })
  return {
    data,
    isLoading,
    error,
  }
}

export const useVerifyPasswordBeforeChange = (setError: UseFormSetError<EditPassworFormType>) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: handleVerifyPasswordBeforeChange,
    retry: false,
    onSuccess(data) {
      console.log('data :', data)
      if (data.success === false && data.error.status === 400) {
        setError('password', { type: 'submit', message: 'password incorrect' })
        return
      }
      if (data.success === false) {
        setError('root', { type: 'submit', message: data.error.message })
        return
      }
      setIsSuccess(true)
    },
    onError: (error) => {
      console.log('error edit password :', error)
      if (error.message.includes('400')) {
        setError('password', { type: 'submit', message: 'password error' })
        return
      }
      setError('root', { type: 'submit', message: 'form-error.500' })
    },
  })

  console.log('is success', isSuccess)
  return {
    mutate,
    isPending,
    isSuccess,
  }
}
