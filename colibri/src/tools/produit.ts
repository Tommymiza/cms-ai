import { CreateProduitSchema } from "@/schemas/create/data";
import { UpdateProduitSchema } from "@/schemas/update/data";
import { tool } from "ai";
import z from "zod";

export const addProduitTool = tool({
  name: "add_product",
  description: "Permet d'ajouter un nouveau produit au catalogue",
  inputSchema: CreateProduitSchema,
});

export const updateProduitTool = tool({
  name: "update_product",
  description: "Permet de mettre à jour un produit existant",
  inputSchema: UpdateProduitSchema,
});

export const deleteProduitTool = tool({
  name: "delete_product",
  description: "Permet de supprimer un produit du catalogue",
  inputSchema: z.object({
    documentId: z.string().describe("Le documentId du produit à supprimer"),
  }),
});
