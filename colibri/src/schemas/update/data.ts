import z from "zod";

export const UpdateProduitSchema = z.object({
  documentId: z.string().describe("Le documentId du produit"),
  nom: z.string().describe("Le nom du produit").optional(),
  description: z.string().describe("La description du produit").optional(),
  prix: z.number().describe("Le prix du produit").optional(),
  image: z.string().describe("L'URL de l'image du produit").optional(),
  produit_category: z
    .number()
    .describe("L'ID de la catégorie du produit")
    .optional(),
});

export const UpdateProduitCategorySchema = z.object({
  documentId: z.string().describe("Le documentId de la catégorie de produit"),
  nom: z.string().describe("Le nom de la catégorie de produit").optional(),
  description: z
    .string()
    .describe("La description de la catégorie de produit")
    .optional(),
});

export const UpdateServiceSchema = z.object({
  documentId: z.string().describe("Le documentId du service"),
  nom: z.string().describe("Le nom du service").optional(),
  description: z.string().describe("La description du service").optional(),
  image: z.string().describe("L'URL de l'image du service").optional(),
});

export const UpdateAvisSchema = z.object({
  documentId: z.string().describe("Le documentId de l'avis"),
  nom: z.string().describe("Le nom du client").optional(),
  description: z.string().describe("L'avis du client").optional(),
});

export const UpdatePartenaireSchema = z.object({
  documentId: z.string().describe("Le documentId du partenaire"),
  nom: z.string().describe("Le nom du partenaire").optional(),
  image: z.string().describe("L'URL du logo du partenaire").optional(),
});

export const UpdateEtudeSchema = z.object({
  documentId: z.string().describe("Le documentId de l'étude de cas"),
  nom: z.string().describe("Le nom de l'étude de cas").optional(),
  description: z
    .string()
    .describe("La description de l'étude de cas")
    .optional(),
  resume: z.string().describe("Le résumé de l'étude de cas").optional(),
  image: z.string().describe("L'URL de l'image de l'étude de cas").optional(),
});
