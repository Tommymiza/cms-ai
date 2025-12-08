import axios from '@/lib/axios'
import { toast } from 'sonner'
import { create } from 'zustand'
import tenantStore from '../tenant'
import type { SiteStore } from './type'

const siteStore = create<SiteStore>((set) => ({
  site: null,
  loading: false,
  siteList: [],
  isEditing: false,
  createSite: async (site) => {
    try {
      set({ loading: true })

      // Attach tenant to site
      const currentTenantId = tenantStore.getState().tenantId

      if (!currentTenantId) {
        throw new Error('Tenant ID not found')
      }
      if (currentTenantId.role !== 'owner') {
        throw new Error('You are not authorized to create a site')
      }

      const response = await axios.post(`/sites`, {
        ...site,
        tenant: currentTenantId.tenant.id,
      })
      toast.success('Site créé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  updateSite: async ({ id, site }) => {
    try {
      set({ loading: true })
      const response = await axios.put(`/sites/${id}`, site)
      set({ site: null })
      toast.success('Site modifié avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    } finally {
      set({ loading: false })
    }
  },
  deleteSite: async (id) => {
    try {
      const response = await axios.delete(`/sites/${id}`)
      toast.success('Site supprimé avec succès')
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message)
      throw error
    }
  },
  getSite: async (id) => {
    try {
      set({ loading: true })
      const response = await axios.get(`/sites/${id}`)
      set({ site: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  getSites: async () => {
    try {
      console.log('Get sites', tenantStore.getState().tenantId)
      set({ loading: true })
      const tenantId = tenantStore.getState().tenantId
      console.log('Tenant ID', tenantId)
      if (!tenantId) return []
      const response = await axios.get(`/sites?tenant=${tenantId?.tenant.id}`, {
        params: {
          filters: {
            tenant: {
              $eq: tenantId?.tenant.id,
            },
          },
        },
      })
      set({ siteList: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    } finally {
      set({ loading: false })
    }
  },
  editSite: async (id) => {
    try {
      const response = await axios.get(`/sites/${id}`)
      set({ site: response.data, isEditing: true })
      return response.data
    } catch (error) {
      throw error
    }
  },
  cancelEdit: () => set({ site: null, isEditing: false }),
}))

export default siteStore
