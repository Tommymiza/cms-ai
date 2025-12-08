import axios from '@/lib/axios'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { TemplateStore } from './type'

const templateStore = create<TemplateStore>((set) => ({
  template: null,
  loading: false,
  templateList: [],
  isEditing: false,
  createTemplate: async (template) => {
    try {
      set({ loading: true })
      const response = await axios.post(`/templates`, template)
      toast.success('Template créé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  updateTemplate: async ({ id, template }) => {
    try {
      set({ loading: true })
      const response = await axios.put(`/templates/${id}`, template)
      set({ template: null })
      toast.success('Template modifié avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  deleteTemplate: async (id) => {
    try {
      const response = await axios.delete(`/templates/${id}`)
      toast.success('Template supprimé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    }
  },
  getTemplate: async (id) => {
    try {
      set({ loading: true })
      const response = await axios.get(`/templates/${id}`)
      set({ template: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  getTemplates: async () => {
    try {
      set({ loading: true })
      const response = await axios.get(`/templates`)
      set({ templateList: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  editTemplate: async (id) => {
    try {
      const response = await axios.get(`/templates/${id}`)
      set({ template: response.data, isEditing: true })
      return response.data
    } catch (error) {
      throw error
    }
  },
  cancelEdit: () => set({ template: null, isEditing: false }),
}))

export default templateStore
