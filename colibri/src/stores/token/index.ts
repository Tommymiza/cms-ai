import axios from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import type { TokenStore } from "./type";

const tokenStore = create<TokenStore>((set, get) => ({
  balance: 0,
  loading: true,
  getBalance: async (token: string, tenant: number) => {
    try {
      const response = await axios.get(`/me/tokens/summary?tenant=${tenant}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!token) {
        toast.error("Utilisateur non connécté!");
        return;
      }
      const balance = response.data.balance;
      set({ balance });
    } catch (error: any) {
      toast.error(error);
      throw error;
    }
  },
  addToken: async (
    token: number,
    model: string,
    type: string,
    tenant: number
  ) => {
    try {
      const authToken = sessionStorage.getItem("token");
      if (!authToken) {
        toast.error("Utilisateur non connécté!");
        return;
      }

      const data = {
        model: model,
        type: type,
        tweeksy_amount: 0,
        token_amount: 0,
        tenant,
      };

      if (type === "refund") {
        data.tweeksy_amount = token;
      } else {
        data.token_amount = token;
      }

      try {
        const response = await axios.post(
          "/token-histories",
          {
            data: data,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const token = sessionStorage.getItem("token");
        const tenant = sessionStorage.getItem("tenant");
        if (token) await get().getBalance(token, tenant ? parseInt(tenant) : 0);
      } catch (e) {
        console.log(e);
        toast.error("Une erreur est survenue lors de l'ajout des tokens");
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default tokenStore;
