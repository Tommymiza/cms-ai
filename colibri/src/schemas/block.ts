import { z } from "zod";

// extract all void Elements
export const voidElements = [
  "area",
  "hr",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "textarea",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

export const PropsSchema = z.record(z.string(), z.any());

export const RichTextAttrsSchema = z.object({
  level: z
    .union([z.literal(1), z.literal(2), z.literal(3)])
    .describe("Niveau du heading (1 à 3)")
    .optional(),
  align: z
    .enum(["left", "center", "right", "justify"])
    .describe("Alignement du texte")
    .optional(),
});

export const RichTextSchema = z.object({
  type: z.enum(["heading", "paragraph"]).describe("Le type de contenu"),
  attrs: RichTextAttrsSchema.describe("Les attributs du texte").optional(),
  content: z
    .array(
      z.object({
        type: z.enum(["text"]).describe("Le type de contenu textuel"),
        text: z.string().describe("Le texte"),
      })
    )
    .describe("Le contenu textuel"),
});

/** Déclaration récursive */
export const BlockSchema: z.ZodType<any> = z
  .object({
    type: z.string().describe("Tag HTML du block"),
    content: z.string().describe("Le contenu textuel").optional(),
    props: PropsSchema.describe(
      "Les props du composant pour JSX, exemple: className et non pas class"
    ).optional(),
    children: z
      .array(
        z.any()
          .describe(`Block enfant de schéma identique: BlockSchema, comme celui-ci: {
          type: 'balise HTML',
          content: 'contenu textuel',
          props: { className: 'ma-classe', ... },
          children: [ ... ]
        }`)
      )
      .describe("Les blocks enfants")
      .optional(),
  })
  .describe("BlockSchema");

/** Type TS inferé */
export type BlockData = {
  type: string;
  content?: any;
  props?: any;
  children?: BlockData[];
};
