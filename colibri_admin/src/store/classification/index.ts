import axios from '@/lib/axios'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { ClassificationStore } from './type'

const classificationStore = create<ClassificationStore>((set) => ({
  classification: null,
  loading: false,
  classificationList: [],
  isEditing: false,
  createClassification: async (classification) => {
    try {
      set({ loading: true })
      const response = await axios.post(`/site-classifications`, classification)
      toast.success('Classification créé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  updateClassification: async ({ id, classification }) => {
    try {
      set({ loading: true })
      const response = await axios.put(`/site-classifications/${id}`, classification)
      set({ classification: null })
      toast.success('Classification modifié avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  deleteClassification: async (id) => {
    try {
      const response = await axios.delete(`/site-classifications/${id}`)
      toast.success('Classification supprimé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    }
  },
  getClassification: async (id) => {
    try {
      set({ loading: true })
      const response = await axios.get(`/site-classifications/${id}`)
      set({ classification: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  getClassifications: async () => {
    try {
      set({ loading: true })
      const response = await axios.get(`/site-classifications`)
      set({ classificationList: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  editClassification: async (id) => {
    try {
      const response = await axios.get(`/site-classifications/${id}`)
      set({ classification: response.data, isEditing: true })
      return response.data
    } catch (error) {
      throw error
    }
  },
  cancelEdit: () => set({ classification: null, isEditing: false }),
}))

export default classificationStore
