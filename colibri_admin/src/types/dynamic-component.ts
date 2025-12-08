import z from 'zod'

export const ComponentSchema: z.ZodType<any> = z
  .object({
    type: z.string().describe('HTML tag'),
    field: z.string().describe('Champ dynamique à afficher'),
    props: z.record(z.string(), z.string()).describe('Les attributs en format JSX du bloc HTML').optional(),
    children: z
      .array(z.lazy(() => ComponentSchema))
      .describe('')
      .optional(),
    content: z.string().describe('Contenu static pour afficher des icons ou autres').optional(),
  })
  .describe("Design d'un composant dynamique réutilisable")
