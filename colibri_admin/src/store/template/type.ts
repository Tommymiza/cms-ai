export type TemplateItem = {
  id: number
  name: string
}

export type TemplateStore = {
  template: TemplateItem | null
  templateList: TemplateItem[]
  loading: boolean
  isEditing: boolean
  createTemplate: (template: Partial<TemplateItem>) => Promise<TemplateItem>
  updateTemplate: ({ id, template }: { id: number; template: Partial<TemplateItem> }) => Promise<TemplateItem>
  deleteTemplate: (id: number) => Promise<TemplateItem>
  getTemplate: (id: number) => Promise<TemplateItem>
  getTemplates: () => Promise<TemplateItem[]>
  editTemplate: (id: number) => Promise<any>
  cancelEdit: () => void
}
