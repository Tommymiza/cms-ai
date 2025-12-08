import axios from "@/lib/axios";
import ax from "axios";
import { create } from "zustand";
import { PartenaireStore } from "./type";
import { meiliClient } from "@/lib/meilisearch"

export const usePartenaireStore = create<PartenaireStore>((set) => ({
  partenaires: [],
  loading: false,
  createPartenaire: async (partenaire) => {
    try {
      const response = await axios.post("/partenaires", {
        data: partenaire,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchLogo: async (name) => {
    try {
      const response = await ax.get(`https://api.logo.dev/search?q=${name}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOGO_SECRET_KEY}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  deletePartenaire: async (documentId) => {
    try {
      const response = await axios.delete(`/partenaires/${documentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updatePartenaire: async ({ documentId, data }) => {
    try {
      const response = await axios.put(`/partenaires/${documentId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchPartenaire: async (search, websiteId) => {
    try {
      const index = meiliClient.index(`site_${websiteId}_content`)
      const searchResult = await index.search(search, {
        filter: "indexName = 'partenaire'"
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
  getPartenaires: async () => {
    try {
      const response = await axios.get("/partenaires");
      set({ partenaires: response.data });
    } catch (error) {
      throw error;
    }
  },
}));
