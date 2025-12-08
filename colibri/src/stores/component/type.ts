import { BlockItem } from "../block/type";

export type ComponentItem = {
  id: number;
  documentId: string;
  nom: string;
  block: BlockItem;
};

export type ComponentStore = {
  components: ComponentItem[];
  loading: boolean;
  createComponent: (
    component: Omit<ComponentItem, "id" | "documentId">
  ) => Promise<void>;
  deleteComponent: (documentId: string) => Promise<void>;
  updateComponent: ({
    documentId,
    data,
  }: {
    documentId: string;
    data: Partial<ComponentItem>;
  }) => Promise<void>;
  getComponents: (qs: any) => Promise<ComponentItem[]>;
};
