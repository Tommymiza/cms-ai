export type PartenaireItem = {
  id: number
  nom: string
  documentId: string
  image?: string
  website?: number
}

export type PartenaireStore = {
  partenaires: PartenaireItem[]
  loading: boolean
  createPartenaire: (partenaire: PartenaireItem) => Promise<void>
  searchLogo: (name: string) => Promise<{ logo_url: string }[]>
  deletePartenaire: (documentId: string) => Promise<void>
  updatePartenaire: ({
    documentId,
    data,
  }: {
    documentId: string
    data: Partial<PartenaireItem>
  }) => Promise<any>
  searchPartenaire: (search: string, websiteId?: number) => Promise<any[]>
  getPartenaires: () => Promise<void>
}
