import axios from "@/lib/axios";
import { create } from "zustand";
import { BureauStore } from "./type";
import { meiliClient } from "@/lib/meilisearch";

export const useBureauStore = create<BureauStore>((set) => ({
  bureaus: [],
  loading: false,
  createBureau: async (bureau) => {
    try {
      const response = await axios.post("/bureaus", {
        data: bureau,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteBureau: async (documentId) => {
    try {
      const response = await axios.delete(`/bureaus/${documentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateBureau: async ({ documentId, data }) => {
    try {
      const response = await axios.put(`/bureaus/${documentId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchBureau: async (search, websiteId) => {
    try {
      const index = meiliClient.index(`site_${websiteId}_content`)
      const searchResult = await index.search(search, {
        filter: "indexName = 'bureau'"
      })
      console.log("Search result:",searchResult)
      const outputData = searchResult.hits
      console.log("Output data:",outputData)
      return outputData
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getBureaus: async () => {
    try {
      const response = await axios.get("/bureaus");
      set({ bureaus: response.data });
    } catch (error) {
      throw error;
    }
  },
}));
