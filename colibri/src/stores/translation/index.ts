import { create } from 'zustand'
import { TranslationStoreType } from './type'

export const useTranslationStore = create<TranslationStoreType>((set, get) => ({
  t: null,
  getTranslation: async (lang) => {
    try {
      const response = await fetch(`/api/messages?lang=${lang}`)
      const data = await response.json()
      set({ t: data })
      return data
    } catch (error) {
      throw error
    }
  },
}))
