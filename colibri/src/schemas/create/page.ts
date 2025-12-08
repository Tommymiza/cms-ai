import z from "zod";
import { BlockSchema } from "../block";

const schema = z.object({
  title: z.string().describe("Le titre de la page"),
  path: z
    .string()
    .describe('Le chemin de la page, par exemple /about pour la page "About"'),
  order: z.number().describe("L'ordre d'affichage de la page dans le menu"),
  keywords: z.string().describe("Les mots-clés de la page pour le SEO"),
  parent: z.number().describe("L'ID de la page parente").nullable(),
  website: z.number().describe("L'ID du site web associé à la page"),
  description: z
    .string()
    .describe("La description de la page pour le SEO")
    .optional(),
  published: z
    .boolean()
    .default(true)
    .describe("Indique si la page est publiée ou non"),
  show_menu: z
    .boolean()
    .default(true)
    .describe("Indique si la page doit être affichée dans le menu ou non"),
  type: z
    .enum(["standard", "service", "produit"])
    .default("standard")
    .describe("Le type de la page"),
  style: z
    .string()
    .describe("Le style CSS en format brut de la page")
    .optional(),
  blocks: z
    .array(BlockSchema)
    .describe("La liste des blocks de contenu de la page"),
});

export const CreatePageSchema = schema;
