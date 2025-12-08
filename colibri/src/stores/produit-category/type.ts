export type ProduitCategoryItem = {
  id: number;
  nom: string;
  documentId: string;
  description: string;
  image: string;
  website?: number;
};

export type ProduitCategoryStore = {
  produitCategorys: ProduitCategoryItem[];
  loading: boolean;
  createProduitCategory: (
    produitCategory: ProduitCategoryItem
  ) => Promise<void>;
  deleteProduitCategory: (documentId: string) => Promise<void>;
  searchProduitCategory: (search: string, websiteId?: number) => Promise<any[]>;
  updateProduitCategory: ({
    documentId,
    data,
  }: {
    documentId: string;
    data: Partial<ProduitCategoryItem>;
  }) => Promise<any>;
  getProduitCategorys: () => Promise<void>;
};
