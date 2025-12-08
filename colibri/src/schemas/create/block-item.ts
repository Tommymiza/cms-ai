import z from "zod";
import { BlockSchema } from "../block";

export const CreateBlockItemSchema = z
  .object({
    data: BlockSchema.describe("Le block de contenu"),
    parent: z.number().describe("L'ID du block parent").optional(),
    order: z.number().describe("L'ordre du block parmi ses frères"),
    page: z
      .number()
      .describe(
        "L'ID de la page associée au block si le block n'a pas de parent"
      )
      .optional(),
  })
  .describe(
    "Insérer un block de contenu sur la page actuelle, ou en tant qu'enfant d'un autre block, selon le cas. le block peut avoir donc comme parent un autre block ou une page mais pas les deux en même temps."
  );
