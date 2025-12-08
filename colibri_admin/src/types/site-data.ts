import z from 'zod'

// Schéma de base pour tous les items avec ID unique
export const BaseItemSchema = z.object({
  id: z.string().describe('Identifiant unique de l\'item (ex: "item_1234567890")'),
})

// Types de champs supportés dans un schéma
export const FieldTypeEnum = z.enum(['string', 'number', 'boolean', 'date', 'url', 'email', 'text', 'array', 'object'])

// Définition d'un champ dans le schéma
export const SchemaFieldSchema = z.object({
  key: z.string().describe('Clé du champ'),
  type: FieldTypeEnum.describe('Type de données du champ'),
  required: z.boolean().default(false).describe('Si le champ est obligatoire'),
  label: z.string().optional().describe('Label affiché pour le champ'),
  description: z.string().optional().describe('Description du champ'),
  default: z.any().optional().describe('Valeur par défaut'),
})

// Définition complète d'un schéma
export const SchemaDefinitionSchema = z.object({
  fields: z.array(SchemaFieldSchema).describe('Liste des champs du schéma'),
  version: z.number().default(1).describe('Version du schéma'),
  description: z.string().optional().describe('Description du schéma'),
})

// Structure d'une liste dynamique générée par l'IA
export const AIListSchema = z.object({
  list_key: z.string().describe('Identifiant unique de la liste (ex: "home_testimonials")'),
  item_category: z.string().describe("Catégorie fonctionnelle des items, définie dynamiquement par l'IA"),
  schema: SchemaDefinitionSchema.describe('Définition du schéma des items de cette liste'),
  items: z
    .array(z.intersection(BaseItemSchema, z.record(z.string(), z.any())))
    .describe('Liste des items, chacun avec un ID unique et respectant le schéma défini'),
  breaking: z.boolean().default(false).describe('Indique si cette version du schéma est cassante'),
  user_notice: z.string().optional().describe('Message explicatif en cas de changement cassant'),
})

// Schéma principal des données du site
export const SiteDataSchema = z.object({
  lists: z.array(AIListSchema).optional().describe("Listes dynamiques de données générées par l'IA"),
})

// Types TypeScript exportés
export type FieldType = z.infer<typeof FieldTypeEnum>
export type SchemaField = z.infer<typeof SchemaFieldSchema>
export type SchemaDefinition = z.infer<typeof SchemaDefinitionSchema>
export type AIList = z.infer<typeof AIListSchema>
export type SiteData = z.infer<typeof SiteDataSchema>

// Fonction helper pour valider un item contre son schéma
export function validateItemAgainstSchema(
  item: Record<string, any>,
  schema: SchemaDefinition
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Vérifier les champs requis
  schema.fields
    .filter((field) => field.required)
    .forEach((field) => {
      if (!(field.key in item)) {
        errors.push(`Champ requis manquant: ${field.key}`)
      }
    })

  // Vérifier les types (validation basique)
  schema.fields.forEach((field) => {
    if (field.key in item) {
      const value = item[field.key]
      const expectedType = field.type

      // Validation basique des types
      if (expectedType === 'string' && typeof value !== 'string') {
        errors.push(`${field.key}: type attendu string, reçu ${typeof value}`)
      } else if (expectedType === 'number' && typeof value !== 'number') {
        errors.push(`${field.key}: type attendu number, reçu ${typeof value}`)
      } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${field.key}: type attendu boolean, reçu ${typeof value}`)
      } else if (expectedType === 'array' && !Array.isArray(value)) {
        errors.push(`${field.key}: type attendu array, reçu ${typeof value}`)
      } else if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value) || value === null)) {
        errors.push(`${field.key}: type attendu object, reçu ${typeof value}`)
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
