import { CreateServiceSchema } from "@/schemas/create/data";
import { UpdateServiceSchema } from "@/schemas/update/data";
import { tool } from "ai";
import z from "zod";

export const addServiceTool = tool({
  name: "add_service",
  description: "Permet d'ajouter un nouveau service",
  inputSchema: CreateServiceSchema,
});

export const updateServiceTool = tool({
  name: "update_service",
  description: "Permet de mettre à jour un service existant",
  inputSchema: UpdateServiceSchema,
});

export const deleteServiceTool = tool({
  name: "delete_service",
  description: "Permet de supprimer un service",
  inputSchema: z.object({
    documentId: z.string().describe("Le documentId du service à supprimer"),
  }),
});
