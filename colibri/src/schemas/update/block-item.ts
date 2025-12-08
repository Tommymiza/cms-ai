import z from "zod";
import { BlockSchema } from "../block";

export const UpdateBlockItemSchema = z
  .object({
    documentId: z
      .string()
      .describe("The document ID of the block to be updated"),
    data: BlockSchema.describe("The content of the block").optional(),
    parent: z.number().describe("The ID of the parent block").optional(),
    order: z
      .number()
      .describe("The order of the block among its siblings")
      .optional(),
    page: z
      .number()
      .describe(
        "The ID of the page where the block is located if it's a top-level block"
      )
      .optional(),
  })
  .describe("Schema for updating a block item");

export const DeleteBlockItemSchema = z.object({
  documentId: z.string().describe("The document ID of the block to be deleted"),
});

export const UpdateBlocksSchema = z.object({
  blocks: z
    .array(UpdateBlockItemSchema)
    .describe("Array of blocks to be updated"),
});
