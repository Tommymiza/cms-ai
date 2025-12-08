import axios from "@/lib/axios";
import { create } from "zustand";
import { ServiceStore } from "./type";
import { meiliClient } from "@/lib/meilisearch";

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  loading: false,
  createService: async (service) => {
    try {
      const response = await axios.post("/services", {
        data: service,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  deleteService: async (documentId) => {
    try {
      const response = await axios.delete(`/services/${documentId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  updateService: async ({ documentId, data }) => {
    try {
      const response = await axios.put(`/services/${documentId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getServices: async () => {
    try {
      const response = await axios.get("/services");
      set({ services: response.data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  searchService: async (search, websiteId) => {
    try {      
      const index = meiliClient.index(`site_${websiteId}_content`)
      const searchResult = await index.search(search, {
        filter: "indexName = 'service'",
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
}));
