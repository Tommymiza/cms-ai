import { CreateAvisSchema } from "@/schemas/create/data";
import { UpdateAvisSchema } from "@/schemas/update/data";
import { tool } from "ai";
import z from "zod";

export const addAvisTool = tool({
  name: "add_avis",
  description: "Permet d'ajouter un nouvel avis client",
  inputSchema: CreateAvisSchema,
});

export const updateAvisTool = tool({
  name: "update_avis",
  description: "Permet de mettre à jour un avis client existant",
  inputSchema: UpdateAvisSchema,
});

export const deleteAvisTool = tool({
  name: "delete_avis",
  description: "Permet de supprimer un avis client",
  inputSchema: z.object({
    documentId: z.string().describe("Le documentId de l'avis à supprimer"),
  }),
});
