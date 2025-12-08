import axios from "@/lib/axios";
import { create } from "zustand";
import { AvisStore } from "./type";
import { meiliClient } from "@/lib/meilisearch";

export const useAvisStore = create<AvisStore>((set) => ({
  aviss: [],
  loading: false,
  createAvis: async (avis) => {
    try {
      const response = await axios.post("/avis-clients", {
        data: avis,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteAvis: async (documentId) => {
    try {
      const response = await axios.delete(`/avis-clients/${documentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateAvis: async ({ documentId, data }) => {
    try {
      const response = await axios.put(`/avis-clients/${documentId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchAvis: async (search, websiteId) => {
    try {
      const index = meiliClient.index(`site_${websiteId}_content`)
      const searchResult = await index.search(search, {
        filter: "indexName = 'avis-client'"
      })
      console.log("Search result:",searchResult)
      const outputData = searchResult.hits
      console.log("Output data:",outputData)
      return outputData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getAviss: async () => {
    try {
      const response = await axios.get("/avis-clients");
      set({ aviss: response.data });
    } catch (error) {
      throw error;
    }
  },
}));
