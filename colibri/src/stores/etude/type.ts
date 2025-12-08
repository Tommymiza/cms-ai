export type EtudeItem = {
  id: number
  title: string
  documentId: string
  description: string
  image: string
  website?: number
}

export type EtudeStore = {
  etudes: EtudeItem[]
  loading: boolean
  createEtude: (etude: EtudeItem) => Promise<void>
  deleteEtude: (documentId: string) => Promise<void>
  updateEtude: ({
    documentId,
    data,
  }: {
    documentId: string
    data: Partial<EtudeItem>
  }) => Promise<any>
  searchEtude: (search: string, websiteId?: number) => Promise<any[]>
  getEtudes: () => Promise<void>
}
