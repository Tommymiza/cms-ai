export type AvisItem = {
  id: number
  nom: string
  documentId: string
  avis: string
  website?: number
}

export type AvisStore = {
  aviss: AvisItem[]
  loading: boolean
  createAvis: (avis: AvisItem) => Promise<void>
  deleteAvis: (documentId: string) => Promise<void>
  updateAvis: ({
    documentId,
    data,
  }: {
    documentId: string
    data: Partial<AvisItem>
  }) => Promise<void>
  searchAvis: (search: string, websiteId?: number) => Promise<any[]>
  getAviss: () => Promise<void>
}
