import { CreateBlockItemSchema } from "@/schemas/create/block-item";
import {
  DeleteBlockItemSchema,
  UpdateBlocksSchema,
} from "@/schemas/update/block-item";
import { tool } from "ai";

export const createBlockTool = tool({
  name: "add_block_item",
  description:
    "Permet d'insérer un nouvel élément de block sur la page ou sur un autre block",
  inputSchema: CreateBlockItemSchema,
});

export const updateBlockTool = tool({
  name: "update_block_item",
  description: "Permet de mettre à jour des blocks existants",
  inputSchema: UpdateBlocksSchema,
});

export const deleteBlockTool = tool({
  name: "delete_block_item",
  description: "Permet de supprimer un élément de block",
  inputSchema: DeleteBlockItemSchema,
});
