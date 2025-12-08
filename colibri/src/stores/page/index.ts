import axios from "@/lib/axios";
import { create } from "zustand";
import { PageStoreItem } from "./type";

export const usePageStore = create<PageStoreItem>((set, get) => ({
  page: null,
  loading: false,
  setPage: (page) => set({ page }),
  getPage: async (documentId) => {
    try {
      set({ loading: true });
      const token = window.sessionStorage.getItem("token");
      const response = await axios.get(`/pages/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  createPage: async (page) => {
    try {
      set({ loading: true });
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `/pages`,
        { data: page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updatePage: async (documentId, page) => {
    try {
      set({ loading: true });
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `/pages/${documentId}`,
        { data: page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deletePage: async (documentId) => {
    try {
      set({ loading: true });
      const token = sessionStorage.getItem("token");
      await axios.delete(`/pages/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
