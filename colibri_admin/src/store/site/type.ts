export type SiteItem = {
  id?: number
  name: string
  documentId?: string
  display_name: string
  description: string
  main_domain_name: string
  website_classification_id: number
  default_visitor_culture: number
  logo: string | null
  tweeksy_preview_domain_name: string
  tweeksy_domain_name: string
  createdAt: string
}

export type PropertyItem = {
  documentId: string
  name: string
  describe: string
  type: 'string' | 'number' | 'boolean'
}

export type SiteStore = {
  site: SiteItem | null
  siteList: SiteItem[]
  loading: boolean
  isEditing: boolean
  createSite: (site: any) => Promise<any>
  updateSite: ({ id, site }: { id: string; site: FormData }) => Promise<any>
  deleteSite: (id: string) => Promise<SiteItem>
  getSite: (id: string) => Promise<SiteItem>
  getSites: () => Promise<SiteItem[]>
  editSite: (id: string) => Promise<any>
  cancelEdit: () => void
}
