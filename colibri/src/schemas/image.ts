import z from "zod";

export const ImageSchema = z.object({
  description: z.string().describe("La description de l'image à générer"),
});
