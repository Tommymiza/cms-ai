'use client'

import authStore from '@/store/auth'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [token, setToken] = useState<string | undefined | null>(null)
  const { getMe } = authStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem('auth')
      setToken(localToken)
    }
  }, [token])
  useEffect(() => {
    getMe()
  }, [token, getMe])

  return
}
