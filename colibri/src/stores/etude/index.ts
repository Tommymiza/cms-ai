import axios from "@/lib/axios";
import { create } from "zustand";
import { EtudeStore } from "./type";
import { meiliClient } from "@/lib/meilisearch";

export const useEtudeStore = create<EtudeStore>((set) => ({
  etudes: [],
  loading: false,
  createEtude: async (etude) => {
    try {
      const response = await axios.post("/etude-cass", {
        data: etude,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteEtude: async (documentId) => {
    try {
      const response = await axios.delete(`/etude-cass/${documentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateEtude: async ({ documentId, data }) => {
    try {
      const response = await axios.put(`/etude-cass/${documentId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchEtude: async (search, websiteId) => {
    try {
      const index = meiliClient.index(`site_${websiteId}_content`)
      const searchResult = await index.search(search, {
        filter: "indexName = 'etude-cas'"
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
  getEtudes: async () => {
    try {
      const response = await axios.get("/etude-cass");
      set({ etudes: response.data });
    } catch (error) {
      throw error;
    }
  },
}));
