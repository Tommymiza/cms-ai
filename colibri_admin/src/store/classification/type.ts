export type ClassificationItem = {
  id: number
  name: string
}

export type ClassificationStore = {
  classification: ClassificationItem | null
  classificationList: ClassificationItem[]
  loading: boolean
  isEditing: boolean
  createClassification: (classification: Partial<ClassificationItem>) => Promise<ClassificationItem>
  updateClassification: ({
    id,
    classification,
  }: {
    id: number
    classification: Partial<ClassificationItem>
  }) => Promise<ClassificationItem>
  deleteClassification: (id: number) => Promise<ClassificationItem>
  getClassification: (id: number) => Promise<ClassificationItem>
  getClassifications: () => Promise<ClassificationItem[]>
  editClassification: (id: number) => Promise<any>
  cancelEdit: () => void
}
