import axios from '@/lib/axios'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { CultureStore } from './type'

const cultureStore = create<CultureStore>((set) => ({
  culture: null,
  loading: false,
  cultureList: [],
  isEditing: false,
  createCulture: async (culture) => {
    try {
      set({ loading: true })
      const response = await axios.post(`/cultures`, culture)
      toast.success('Culture créé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  updateCulture: async ({ id, culture }) => {
    try {
      set({ loading: true })
      const response = await axios.put(`/cultures/${id}`, culture)
      set({ culture: null })
      toast.success('Culture modifié avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  deleteCulture: async (id) => {
    try {
      const response = await axios.delete(`/cultures/${id}`)
      toast.success('Culture supprimé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    }
  },
  getCulture: async (id) => {
    try {
      set({ loading: true })
      const response = await axios.get(`/cultures/${id}`)
      set({ culture: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  getCultures: async () => {
    try {
      set({ loading: true })
      const response = await axios.get(`/cultures`)
      set({ cultureList: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  editCulture: async (id) => {
    try {
      const response = await axios.get(`/cultures/${id}`)
      set({ culture: response.data, isEditing: true })
      return response.data
    } catch (error) {
      throw error
    }
  },
  cancelEdit: () => set({ culture: null, isEditing: false }),
}))

export default cultureStore
