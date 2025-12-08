import z from "zod";
import { PropsSchema } from "../block";

const allowedTags = [
  "Image",
  "Link",
  "nav",
  "section",
  "article",
  "aside",
  "footer",
  "div",
  "form",
  "input",
  "textarea",
  "label",
  "select",
  "option",
  "button",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "hr",
  "br",
] as const;

const ComponentSchema: z.ZodType<any> = z.object({
  type: z.enum(allowedTags).describe("La balise à utiliser"),
  field: z
    .enum(["nom", "description", "prix", "avis", "resume", "image"])
    .describe("Les champs à remplacer dynamiquement")
    .optional(),
  props: PropsSchema.describe("Les props du composant").optional(),
  children: z
    .array(z.any())
    .describe("Les blocks children du parent")
    .optional(),
});

export const CreateDynamicComponentSchema = z.object({
  nom: z
    .enum([
      "ServiceItem",
      "ProductItem",
      "AvisClientItem",
      "PartenaireItem",
      "EtudeCasItem",
    ])
    .describe("Le type d'item à utiliser pour générer le composant"),
  block: ComponentSchema.describe("Le composant à générer dynamiquement"),
  website: z.number().describe("L'ID du site web associé au composant"),
});
