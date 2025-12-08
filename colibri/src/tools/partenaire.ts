import { CreatePartenaireSchema } from "@/schemas/create/data";
import { UpdatePartenaireSchema } from "@/schemas/update/data";
import { tool } from "ai";
import z from "zod";

export const addPartenaireTool = tool({
  name: "add_partner",
  description: "Permet d'ajouter un nouveau partenaire",
  inputSchema: CreatePartenaireSchema,
});

export const updatePartenaireTool = tool({
  name: "update_partner",
  description: "Permet de mettre à jour un partenaire existant",
  inputSchema: UpdatePartenaireSchema,
});

export const deletePartenaireTool = tool({
  name: "delete_partner",
  description: "Permet de supprimer un partenaire",
  inputSchema: z.object({
    documentId: z.string().describe("Le documentId du partenaire à supprimer"),
  }),
});

export const searchPartenaireLogoTool = tool({
  name: "search_logo_partner",
  description:
    "Permet de rechercher le logo d'un partenaire à partir de son nom ou URL",
  inputSchema: z.object({
    query: z.string().describe("Le nom du partenaire ou l'URL de son site web"),
  }),
});
