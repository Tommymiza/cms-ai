import { CreateEtudeSchema } from "@/schemas/create/data";
import { UpdateEtudeSchema } from "@/schemas/update/data";
import { tool } from "ai";
import z from "zod";

export const addEtudeTool = tool({
  name: "add_etude",
  description: "Permet d'ajouter une nouvelle étude de cas",
  inputSchema: CreateEtudeSchema,
});

export const updateEtudeTool = tool({
  name: "update_etude",
  description: "Permet de mettre à jour une étude de cas existante",
  inputSchema: UpdateEtudeSchema,
});

export const deleteEtudeTool = tool({
  name: "delete_etude",
  description: "Permet de supprimer une étude de cas",
  inputSchema: z.object({
    documentId: z
      .string()
      .describe("Le documentId de l'étude de cas à supprimer"),
  }),
});
