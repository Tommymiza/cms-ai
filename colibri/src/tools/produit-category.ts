import { CreateProduitCategorySchema } from "@/schemas/create/data";
import { UpdateProduitCategorySchema } from "@/schemas/update/data";
import { tool } from "ai";
import z from "zod";

export const addProduitCategoryTool = tool({
  name: "add_product_category",
  description: "Permet d'ajouter une nouvelle catégorie de produits",
  inputSchema: CreateProduitCategorySchema,
});

export const updateProduitCategoryTool = tool({
  name: "update_product_cagegory",
  description: "Permet de mettre à jour une catégorie de produits existante",
  inputSchema: UpdateProduitCategorySchema,
});

export const deleteProduitCategoryTool = tool({
  name: "delete_product_category",
  description: "Permet de supprimer une catégorie de produits",
  inputSchema: z.object({
    documentId: z
      .string()
      .describe("Le documentId de la catégorie de produits à supprimer"),
  }),
});
