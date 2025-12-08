import { z } from 'zod'

export const PropsSchema = z
  .record(z.string(), z.string())
  .describe(
    'Les props du composant en format JSX, utilisez dataId pour les ID uniques dans les composants dynamiques et dataType pour le type de composant: ServiceItem, ProductItem, AvisClientItem, PartenaireItem, EtudeCasItem'
  )

/** Déclaration récursive */
export const BlockSchema: z.ZodType<any> = z.object({
  type: z.string().describe('Balise HTML'),
  content: z.string().describe('Le contenu textuel').optional(),
  props: PropsSchema.describe('Les props du composant').optional(),
  children: z
    .array(z.lazy(() => BlockSchema))
    .describe('Les blocks enfants')
    .optional(),
})

/** Type TS inferé */
export type BlockData = {
  type: string
  content?: any
  props?: any
  children?: BlockData[]
}
