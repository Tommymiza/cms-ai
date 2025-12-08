import axios from "@/lib/axios";
import { create } from "zustand";
import { ComponentStore } from "./type";

export const useComponentStore = create<ComponentStore>((set) => ({
  components: [],
  loading: false,
  createComponent: async (component) => {
    try {
      const token =
        typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
      const response = await axios.post(
        "/components",
        {
          data: component,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteComponent: async (documentId) => {
    try {
      const token =
        typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
      const response = await axios.delete(`/components/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateComponent: async ({ documentId, data }) => {
    try {
      const token =
        typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
      const response = await axios.put(
        `/components/${documentId}`,
        {
          data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getComponents: async (qs: any) => {
    try {
      const token =
        typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
      const response = await axios.get("/components", {
        params: qs,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ components: response.data.data });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
}));
