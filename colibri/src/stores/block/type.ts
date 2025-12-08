import { BlockData } from "@/schemas/block";

export type BlockType = "standard" | "service" | "produit";

export type BlockItem = {
  id: number;
  documentId: string;
  data: BlockData;
  order: number;
  children?: BlockItem[];
};

export type BlockStoreItem = {
  block: BlockItem | null;
  loading: boolean;
  getBlock: (documentId: string) => Promise<BlockItem | null>;
  createBlock: (block: Partial<BlockItem>) => Promise<BlockItem | null>;
  updateBlock: (
    documentId: string,
    block: Partial<BlockItem>
  ) => Promise<BlockItem | null>;
  deleteBlock: (documentId: string) => Promise<void>;
  setBlock: (block: BlockItem | null) => void;
};
