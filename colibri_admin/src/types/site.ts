import { z } from 'zod'

export const SiteSchema = z.object({
  default_visitor_culture: z.string().describe('Le code de la langue par défaut du site web'),
  display_name: z.string().describe("Quel est le nom du site web ? Il est préférable de le préciser à l'écrit."),
  description: z
    .string()
    .describe(
      "La description de l'activité de l'entreprise, par exemple une explication des produits ou services que vous proposez."
    ),
  logo: z
    .string()
    .describe(
      'Pour le site "xxxx", Veuillez fournir le logo de votre entreprise ? (Afficher le bouton upload pour télécharger le logo)'
    ),
  slogan: z
    .string()
    .describe(
      'Suggérez automatiquement un slogan basé sur les informations fournies avec la langue choisie pour le site.'
    ),
  data: z.object({
    images: z
      .array(
        z.object({
          description: z.string().describe('Description de l’image à utiliser'),
          url: z.string().describe("L'URL de l’image générée"),
        })
      )
      .describe('Liste des images générées pour le site web, au moins 10 images'),
  }),
  version: z.enum(['premium', 'basic']).describe("Le type d'abonnement du site web"),
  additionnal_prompt: z
    .string()
    .optional()
    .describe("Instructions supplémentaires venant de l'utilisateur pour la génération du site web, si nécessaire."),
})
