import axios from '@/lib/axios'
import { create } from 'zustand'
import { HistoryStore } from './type'

export const useHistoryStore = create<HistoryStore>((set) => ({
  historys: [],
  loading: false,
  createHistory: async (history) => {
    try {
      const token =
        typeof window !== 'undefined' ? sessionStorage.getItem('token') : null
      const response = await axios.post(
        '/histories',
        {
          data: history,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      throw error
    }
  },
  deleteHistory: async (documentId) => {
    try {
      const token =
        typeof window !== 'undefined' ? sessionStorage.getItem('token') : null
      const response = await axios.delete(`/histories/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  updateHistory: async ({ documentId, data }) => {
    try {
      const token =
        typeof window !== 'undefined' ? sessionStorage.getItem('token') : null
      const response = await axios.put(
        `/histories/${documentId}`,
        {
          data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      throw error
    }
  },
  getHistorys: async (qs: any) => {
    try {
      const token =
        typeof window !== 'undefined' ? sessionStorage.getItem('token') : null
      const response = await axios.get('/histories', {
        params: qs,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      set({ historys: response.data.data })
      return response.data.data
    } catch (error) {
      throw error
    }
  },
}))
