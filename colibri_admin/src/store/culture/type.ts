export type CultureItem = {
  id: number
  name: string
  code: string
  short_name: string
  alias: string
}

export type CultureStore = {
  culture: CultureItem | null
  cultureList: CultureItem[]
  loading: boolean
  isEditing: boolean
  createCulture: (culture: Partial<CultureItem>) => Promise<CultureItem>
  updateCulture: ({ id, culture }: { id: number; culture: Partial<CultureItem> }) => Promise<CultureItem>
  deleteCulture: (id: number) => Promise<CultureItem>
  getCulture: (id: number) => Promise<CultureItem>
  getCultures: () => Promise<CultureItem[]>
  editCulture: (id: number) => Promise<any>
  cancelEdit: () => void
}
