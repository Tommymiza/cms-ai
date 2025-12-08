import { CreatePageSchema } from "@/schemas/create/page";
import { DeletePageSchema, UpdatePageSchema } from "@/schemas/update/page";
import { tool } from "ai";

export const createPageTool = tool({
  name: "add_new_page",
  description:
    "Permet de créer une nouvelle page sur le site web avec son contenu, ses blocs et ses métadonnées SEO",
  inputSchema: CreatePageSchema,
});

export const updatePageTool = tool({
  name: "update_page",
  description:
    "Permet de mettre à jour une page existante (titre, chemin, métadonnées SEO, etc.)",
  inputSchema: UpdatePageSchema,
});

export const deletePageTool = tool({
  name: "delete_page",
  description: "Permet de supprimer une page existante",
  inputSchema: DeletePageSchema,
});
