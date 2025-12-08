import { ProduitCategoryItem } from '../produit-category/type'

export type ProduitItem = {
  id: number
  nom: string
  documentId: string
  description: string
  prix: number
  image: string
  website?: number
  updatedAt: string
  produit_category?: number | ProduitCategoryItem
}

export type ProduitStore = {
  produits: ProduitItem[]
  loading: boolean
  createProduit: (produit: ProduitItem) => Promise<void>
  deleteProduit: (documentId: string) => Promise<void>
  searchProduit: (search: string, websiteId?: number) => Promise<any[]>
  updateProduit: ({
    documentId,
    data,
  }: {
    documentId: string
    data: Partial<ProduitItem>
  }) => Promise<any>
  getProduits: () => Promise<void>
}
