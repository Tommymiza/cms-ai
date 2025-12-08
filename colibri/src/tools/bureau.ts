import { tool } from "ai";
import z from "zod";

// Note: Les schémas pour bureau n'existent pas encore dans les fichiers schemas
// Ils devront être créés dans le futur si nécessaire

export const addBureauTool = tool({
  name: "add_bureau",
  description: "Permet d'ajouter un nouveau bureau/agence",
  inputSchema: z.object({
    nom: z.string().describe("Le nom du bureau"),
    adresse: z.string().describe("L'adresse du bureau"),
    telephone: z.string().describe("Le numéro de téléphone du bureau"),
    email: z.string().describe("L'email du bureau"),
    website: z.number().describe("L'ID du site web associé au bureau"),
  }),
});

export const updateBureauTool = tool({
  name: "update_bureau",
  description: "Permet de mettre à jour un bureau existant",
  inputSchema: z.object({
    documentId: z.string().describe("Le documentId du bureau"),
    nom: z.string().describe("Le nom du bureau").optional(),
    adresse: z.string().describe("L'adresse du bureau").optional(),
    telephone: z
      .string()
      .describe("Le numéro de téléphone du bureau")
      .optional(),
    email: z.string().describe("L'email du bureau").optional(),
  }),
});

export const deleteBureauTool = tool({
  name: "delete_bureau",
  description: "Permet de supprimer un bureau",
  inputSchema: z.object({
    documentId: z.string().describe("Le documentId du bureau à supprimer"),
  }),
});
