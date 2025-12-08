import axios from "@/lib/axios";
import { create } from "zustand";
import { ProduitCategoryStore } from "./type";
import { meiliClient } from "@/lib/meilisearch"

export const useProduitCategoryStore = create<ProduitCategoryStore>((set) => ({
  produitCategorys: [],
  loading: false,
  createProduitCategory: async (produitCategory) => {
    try {
      const response = await axios.post("/produit-categories", {
        data: produitCategory,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteProduitCategory: async (documentId) => {
    try {
      const response = await axios.delete(`/produit-categories/${documentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProduitCategory: async ({ documentId, data }) => {
    try {
      console.log("data produitCategory", data);
      const response = await axios.put(`/produit-categories/${documentId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  searchProduitCategory: async (search, websiteId) => {
    try {
      const index = meiliClient.index(`site_${websiteId}_content`)
      const searchResult = await index.search(search, {
        filter: "indexName = 'produit-category'"
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
  getProduitCategorys: async () => {
    try {
      const response = await axios.get("/produit-categories");
      set({ produitCategorys: response.data });
    } catch (error) {
      throw error;
    }
  },
}));
