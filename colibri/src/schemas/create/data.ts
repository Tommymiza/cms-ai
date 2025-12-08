import z from "zod";

export const CreateProduitSchema = z.object({
  nom: z.string().describe("Le nom du produit"),
  description: z.string().describe("La description du produit"),
  prix: z.number().describe("Le prix du produit"),
  image: z.string().describe("L'URL de l'image du produit"),
  produit_category: z.number().describe("L'ID de la catégorie du produit"),
  website: z.number().describe("L'ID du site web associé au produit"),
});

export const CreateProduitCategorySchema = z.object({
  nom: z.string().describe("Le nom de la catégorie de produit"),
  description: z.string().describe("La description de la catégorie de produit"),
  website: z
    .number()
    .describe("L'ID du site web associé à la catégorie de produit"),
});

export const CreateServiceSchema = z.object({
  nom: z.string().describe("Le nom du service"),
  description: z.string().describe("La description du service"),
  image: z.string().describe("L'URL de l'image du service"),
  website: z.number().describe("L'ID du site web associé au service"),
});

export const CreateAvisSchema = z.object({
  nom: z.string().describe("Le nom du client"),
  description: z.string().describe("L'avis du client"),
  website: z.number().describe("L'ID du site web associé à l'avis"),
});

export const CreatePartenaireSchema = z.object({
  nom: z.string().describe("Le nom du partenaire"),
  image: z.string().describe("L'URL du logo du partenaire"),
  website: z.string().describe("L'URL du site web du partenaire"),
});

export const CreateEtudeSchema = z.object({
  nom: z.string().describe("Le nom de l'étude de cas"),
  description: z.string().describe("La description de l'étude de cas"),
  resume: z.string().describe("Le résumé de l'étude de cas"),
  image: z.string().describe("L'URL de l'image de l'étude de cas"),
  website: z.number().describe("L'ID du site web associé à l'étude de cas"),
});
