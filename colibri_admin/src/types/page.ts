import z from 'zod'

export const PageSchema = z.object({
  id: z.string().describe("Identifiant unique de la page en format timestamp (ex: '1733404800001', '1733404800002')"),
  parent_id: z.string().optional().describe('ID timestamp de la page parente pour les pages de détail'),
  title: z.string().describe('Le titre de la page'),
  path: z.string().describe('Le chemin de la page, par exemple /about pour la page "About"'),
  order: z.number().describe("L'ordre d'affichage de la page dans le menu, (integer)").optional(),
  keywords: z.string().describe('Les mots-clés de la page pour le SEO').optional(),
  description: z.string().describe('La description de la page pour le SEO').optional(),
  published: z.boolean().default(true).describe('Indique si la page est publiée ou non'),
  show_menu: z.boolean().default(true).describe('Indique si la page doit être affichée dans le menu ou non'),
  type: z
    .string()
    .default('standard')
    .describe(
      "Le type de la page : 'standard' pour les pages normales, ou le list_key (ex: 'blog_articles', 'portfolio_projects') pour les pages de détail"
    ),
  html: z.string().describe('Le contenu HTML brut de la page'),
  style: z.string().describe('Le style CSS des composants spécifiques à cette page'),
  placeholders: z
    .array(z.string())
    .optional()
    .describe('Les champs dynamiques utilisés dans le HTML (pour les pages de détail)'),
})
