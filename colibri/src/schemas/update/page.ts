import z from "zod";

const schema = z.object({
  documentId: z.string().describe("Le documentId de la page à mettre à jour"),
  title: z.string().describe("Le titre de la page").optional(),
  path: z
    .string()
    .describe('Le chemin de la page, par exemple /about pour la page "About"')
    .optional(),
  order: z
    .number()
    .describe("L'ordre d'affichage de la page dans le menu")
    .optional(),
  keywords: z
    .string()
    .describe("Les mots-clés de la page pour le SEO")
    .optional(),
  parent: z.number().describe("L'ID de la page parente").nullable().optional(),
  description: z
    .string()
    .describe("La description de la page pour le SEO")
    .optional(),
  published: z
    .boolean()
    .default(true)
    .describe("Indique si la page est publiée ou non")
    .optional(),
  show_menu: z
    .boolean()
    .default(true)
    .describe("Indique si la page doit être affichée dans le menu ou non")
    .optional(),
  type: z
    .enum(["standard", "service", "produit"])
    .default("standard")
    .describe("Le type de la page")
    .optional(),
  style: z
    .string()
    .describe("Le style CSS en format brut de la page")
    .optional(),
});

export const UpdatePageSchema = schema;

export const DeletePageSchema = z.object({
  documentId: z.string().describe("Le documentId de la page à supprimer"),
});
