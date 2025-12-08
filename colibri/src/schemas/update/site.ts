import z from "zod";
import { BlockSchema } from "../block";

const schema = z.object({
  documentId: z.string().describe("L'ID du site web actuel"),
  description: z
    .string()
    .describe(
      "La description de l'activité de l'entreprise, par exemple une explication des produits ou services que vous proposez."
    )
    .optional(),
  logo: z
    .string()
    .describe(
      'Pour le site "xxxx", Veuillez fournir le logo de votre entreprise ? (Afficher le bouton upload pour télécharger le logo)'
    )
    .optional(),
  fiche_entreprise: z
    .object({
      coordonnees: z
        .string()
        .describe(
          "Pourriez-vous indiquer l’adresse postale que vous souhaitez afficher sur le site ? Il est préférable de le préciser à l'écrit."
        ),
      phone: z
        .string()
        .describe(
          "Quel est le numéro de téléphone que vous souhaitez rendre visible sur le site pour les contacts clients ? Il est préférable de le préciser à l'écrit."
        ),
      contact_email: z
        .string()
        .describe(
          "Quel est l’email que vous souhaitez rendre visible sur le site pour les contacts clients ? Il est préférable de le préciser à l'écrit."
        ),
    })
    .optional(),
  slogan: z
    .string()
    .describe(
      "Suggérez automatiquement un slogan basé sur les informations fournies avec la langue choisie pour le site."
    )
    .optional(),
  style: z
    .string()
    .describe("Le style CSS en format brut du site au complet")
    .optional(),
  header: BlockSchema.describe(
    "Header du site, utilise le composant Logo pour le logo"
  ).optional(),
  footer: BlockSchema.describe("Le footer du site").optional(),
});

export const UpdateSiteSchema = schema;
