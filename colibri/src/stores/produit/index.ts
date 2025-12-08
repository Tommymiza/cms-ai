import axios from "@/lib/axios";
import { create } from "zustand";
import { ProduitStore } from "./type";
import { meiliClient } from "@/lib/meilisearch"

export const useProduitStore = create<ProduitStore>((set) => ({
  produits: [],
  loading: false,
  createProduit: async (produit) => {
    try {
      const response = await axios.post("/produits", {
        data: produit,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteProduit: async (documentId) => {
    try {
      const response = await axios.delete(`/produits/${documentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProduit: async ({ documentId, data }) => {
    try {
      console.log("data produit", data);
      const response = await axios.put(`/produits/${documentId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchProduit: async (search, websiteId) => {
    try {
      const index = meiliClient.index(`site_${websiteId}_content`)
      const searchResult = await index.search(search, {
        filter: "indexName = 'produit'"
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
  getProduits: async () => {
    try {
      const response = await axios.get("/produits");
      set({ produits: response.data });
    } catch (error) {
      throw error;
    }
  },
}));
