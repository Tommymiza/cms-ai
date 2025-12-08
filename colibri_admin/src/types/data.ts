import z from 'zod'

export const ProduitSchema = z.object({
  id: z.number().describe("L'ID du produit, à générer automatiquement"),
  nom: z.string().describe('Le nom du produit'),
  description: z.string().describe('La description du produit'),
  prix: z.number().describe('Le prix du produit'),
  image: z.string().describe("L'URL de l'image du produit"),
  produit_category: z.number().describe("L'ID de la catégorie du produit"),
})

export const ProduitCategorySchema = z.object({
  id: z.number().describe("L'ID de la catégorie de produit, à générer automatiquement"),
  nom: z.string().describe('Le nom de la catégorie de produit'),
  description: z.string().describe('La description de la catégorie de produit'),
})

export const ServiceSchema = z.object({
  id: z.number().describe("L'ID du service, à générer automatiquement"),
  nom: z.string().describe('Le nom du service'),
  description: z.string().describe('La description du service'),
  image: z.string().describe("L'URL de l'image du service"),
})

export const AvisSchema = z.object({
  id: z.number().describe("L'ID de l'avis client, à générer automatiquement"),
  nom: z.string().describe('Le nom du client'),
  description: z.string().describe("L'avis du client"),
})

export const PartenaireSchema = z.object({
  id: z.number().describe("L'ID du partenaire, à générer automatiquement"),
  nom: z.string().describe('Le nom du partenaire'),
  image: z.string().describe("L'URL du logo du partenaire"),
})

export const EtudeSchema = z.object({
  id: z.number().describe("L'ID de l'étude de cas, à générer automatiquement"),
  nom: z.string().describe("Le nom de l'étude de cas"),
  description: z.string().describe("La description de l'étude de cas"),
  resume: z.string().describe("Le résumé de l'étude de cas"),
})

export const ImageSchema = z.object({
  description: z.string().describe("La description de l'image à générer"),
})
