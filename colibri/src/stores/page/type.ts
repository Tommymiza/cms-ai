import { BlockItem } from "../block/type";

export type PageType = "standard" | "service" | "produit";

export type PageItem = {
  id: number;
  documentId: string;
  title: string;
  keywords: string;
  description: string;
  path: string;
  published: boolean;
  show_menu: boolean;
  order: number;
  type: "standard" | "service" | "produit";
  parent?: PageItem;
  children?: PageItem[];
  blocks: BlockItem[];
  style: string;
  website?: number;
};

export type PageStoreItem = {
  page: PageItem | null;
  loading: boolean;
  getPage: (documentId: string) => Promise<PageItem | null>;
  createPage: (page: Partial<PageItem>) => Promise<PageItem | null>;
  updatePage: (
    documentId: string,
    page: Partial<PageItem>
  ) => Promise<PageItem | null>;
  deletePage: (documentId: string) => Promise<void>;
  setPage: (page: PageItem | null) => void;
};
