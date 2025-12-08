import axios from '@/lib/axios'
import ax, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { create } from 'zustand'
import tenantStore from '../tenant'
import { UserItem, UserStore } from '../user/type'

const userStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  userList: [],
  isEditing: false,
  getCurrentUser: async () => {
    try {
      set({ loading: true })
      await tenantStore.getState().initTenant()
      console.log('Init tenant called => ', tenantStore.getState().tenantId)
      const tenantId = tenantStore.getState().tenantId?.tenant.id
      if (!tenantId) {
        throw new Error('Aucun tenant trouvé!')
      }
      const token = localStorage.getItem('auth')
      if (!token) throw new Error('Token not found')
      const response = await axios.get(`/me/tokens/summary?tenant=${tenantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Current user:', response.data)
      set({ user: response.data })
      return response.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  setPlan: async (planId, userId) => {
    try {
      const updatedUser = { ...get().user }
      updatedUser.plan = planId
      const response = await axios.put(`/users/${userId}`, updatedUser)
      set({ user: response.data, isEditing: true })
      return response.data
    } catch (error) {
      throw error
    }
  },
  createUser: async (user) => {
    try {
      set({ loading: true })
      const response = await axios.post(`/users`, user)
      toast.success('Utilisateur créé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateUser: async ({ id, user }) => {
    try {
      set({ loading: true })
      const response = await axios.put(`/users/${id}`, user)
      set({ user: null })
      toast.success('Utilisateur modifié avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`/users/${id}`)
      toast.success('Utilisateur supprimé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    }
  },
  getUser: async (id) => {
    try {
      set({ loading: true })
      const response = await axios.get(`/users/${id}`)
      set({ user: response.data })
      return response.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },

  getUsersByQuery: async (query?: string) => {
    try {
      set({ loading: true })
      if (!query) {
        console.log('empty')
        set({ loading: false })
        return
      }
      if (query.replaceAll(' ', '') === '') {
        console.log('empty')
        set({ userList: [] })
        return
      }
      const response: { data: UserItem[] } = await axios.get(`/users`)
      const filteredResponse = response.data.filter((user: UserItem) => {
        return user.email.toLowerCase().includes(query?.toLowerCase())
      })
      set({ userList: filteredResponse })
    } catch (error) {
      console.log('error get users', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  getUsers: async () => {
    try {
      set({ loading: true })
      const response = await axios.get(`/users`)
      set({ userList: response.data })
      return response.data
    } catch (error) {
      console.log('error get users', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  editUser: async (id) => {
    try {
      const response = await axios.get(`/users/${id}`)
      set({ user: response.data, isEditing: true })
      return response.data
    } catch (error) {
      throw error
    }
  },
  cancelEdit: () => set({ user: null, isEditing: false }),
  verifyPassBeforeSetNew: async ({ id, email, password }) => {
    try {
      set({ loading: true })
      const response = await axios.post('/users-permissions/user/verify-password', { id, email, password })
      return response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('error xc')
        return error.response?.data.error
      } else {
        return error
      }
    } finally {
      set({ loading: false })
    }
  },
  recoveryPassword: async (email: string) => {
    try {
      set({ loading: true })
      const response = await ax.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users-permissions/user/recovery-password`,
        { email }
      )
      if (response.status === 200 || response.status === 201) {
        return response.data
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data.error
      } else {
        return error
      }
    } finally {
      set({ loading: false })
    }
  },
}))

export default userStore
