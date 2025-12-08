export type BureauItem = {
  id: number
  documentId: string
  ville: string
  adresse: string
  coordonnee: string
  website?: number
}

export type BureauStore = {
  bureaus: BureauItem[]
  loading: boolean
  createBureau: (bureau: BureauItem) => Promise<void>
  deleteBureau: (documentId: string) => Promise<void>
  updateBureau: ({
    documentId,
    data,
  }: {
    documentId: string
    data: Partial<BureauItem>
  }) => Promise<any>
  searchBureau: (search: string, websiteId?: number) => Promise<any[]>
  getBureaus: () => Promise<void>
}
