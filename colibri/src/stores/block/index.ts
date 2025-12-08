import axios from "@/lib/axios";
import { create } from "zustand";
import { BlockStoreItem } from "./type";

export const useBlockStore = create<BlockStoreItem>((set, get) => ({
  block: null,
  loading: false,
  setBlock: (block) => set({ block }),
  getBlock: async (documentId) => {
    try {
      set({ loading: true });
      const token = window.sessionStorage.getItem("token");
      const response = await axios.get(`/blocks/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ block: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  createBlock: async (block) => {
    try {
      set({ loading: true });
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `/blocks`,
        { data: block },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ block: response.data });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateBlock: async (documentId, block) => {
    try {
      set({ loading: true });
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `/blocks/${documentId}`,
        { data: block },
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
  deleteBlock: async (documentId) => {
    try {
      set({ loading: true });
      const token = sessionStorage.getItem("token");
      await axios.delete(`/blocks/${documentId}`, {
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
