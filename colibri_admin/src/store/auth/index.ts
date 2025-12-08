import axios from '@/lib/axios'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { AuthStore } from './type'

const authStore = create<AuthStore>((set) => ({
  auth: null,
  loading: true,
  login: async (data) => {
    try {
      const response = await axios.post(`/auth/local`, data)
      const token = response.data.jwt
      localStorage.setItem('auth', token)
      toast.success('Utilisateur connécté!')
    } catch (error: any) {
      toast.error(error.response.data.error.message)
      throw error
    }
  },
  getMe: async () => {
    try {
      const token = localStorage.getItem('auth') ?? (window.Cookies && window.Cookies.get('jwt'))
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.get(`/users/me`)
        const user = response.data
        set({ auth: user })
      }
    } catch (error) {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('auth')
      console.log('error get me', error)
    } finally {
      set({ loading: false })
    }
  },
  register: async (data) => {
    try {
      set({ loading: true })
      const response = await axios.post(`/users`, data)
      console.log(response.data)
      toast.success('Veuillez verifier votre email.')
      window.location.href = '/register/success'
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.error.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  updatePassword: async (data) => {
    try {
      await axios.post(`/auth/reset`, data)
      toast.success('Password changed successfully!')
    } catch (error: any) {
      console.log(error.response.data.error)
      throw error
    }
  },
  logout: async () => {
    try {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('auth')
      localStorage.removeItem('tenantId')
      set({ auth: null })
    } catch (error: any) {
      toast.error(error.response.data.error)
      throw error
    }
  },
}))

export default authStore
