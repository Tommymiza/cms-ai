import axios from '@/lib/axios'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { TokenStore } from './type'
import { Axios } from 'axios'
import tenantStore from '../tenant'

const tokenStore = create<TokenStore>((set, get) => ({
  balance: 0,
  loading: true,
  getBalance: async () => {
    try {
      const token = localStorage.getItem('auth') ?? (window.Cookies && window.Cookies.get('jwt'))
      const tenantId = tenantStore.getState().tenantId?.tenant.id

      if (!tenantId) {
        // toast.error('Aucun tenant trouvé!')
        return
      }
      console.log("Tenant id",tenantId)
      const response = await axios.get(`/me/tokens/summary?tenant=${tenantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      })

      console.log(response)
      const balance = response.data.balance
      console.log(response.data.balance)
      set({ balance })
    } catch (error: any) {
      toast.error(error)
      throw error
    }
  },
  addToken: async (token: number, model: string, type: string) => {
    try {
      const authToken = localStorage.getItem('auth') ?? (window.Cookies && window.Cookies.get('jwt'))
      if (!authToken) {
        toast.error('Utilisateur non connécté!')
        return
      }
      await tenantStore.getState().initTenant()
      console.log("Init tenant called => ", tenantStore.getState().tenantId)
      const tenantId = tenantStore.getState().tenantId?.tenant.id

      if (!tenantId) {
        toast.error('Aucun tenant trouvé!')
        return
      }

      const data = {
        model: model,
        type: type,
        tweeksy_amount: 0,
        token_amount: 0,
        tenant: tenantId
      }

      if (type === 'refund') {
        data.tweeksy_amount = token
      } else {
        data.token_amount = token
      }

      try {
        const response = await axios.post(
          '/token-histories',
          {
            data: data,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        await get().getBalance()
        // toast.success('Token ajouté avec succès')
      } catch (e) {
        console.log(e)
        toast.error("Une erreur est survenue lors de l'ajout des tokens")
      }
    } catch (error: any) {
      toast.error(error)
    } finally {
      set({ loading: false })
    }
  },
}))

export default tokenStore
