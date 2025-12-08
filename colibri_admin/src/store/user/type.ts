type FormatPhoto = {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string | null
  size: number
  width: number
  height: number
  sizeInBytes: number
}

// type Photo = {
//   id: number
//   documentId: string
//   url: string
//   name: string
//   formats: {
//     large: FormatPhoto
//     small: FormatPhoto
//     medium: FormatPhoto
//     thumbnail: FormatPhoto
//   }
// }
type ImageFormat = {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string | null
  size: number // en KB
  width: number
  height: number
  sizeInBytes: number // en bytes
  provider_metadata: {
    public_id: string
    resource_type: string
  }
}

type ImageFormats = {
  large?: ImageFormat
  small?: ImageFormat
  medium?: ImageFormat
  thumbnail?: ImageFormat
}

type Photo = {
  id: number
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: ImageFormats
  hash: string
  ext: string
  mime: string
  size: number // en KB
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: {
    public_id: string
    resource_type: string
  }
  createdAt: string // Format ISO 8601
  updatedAt: string // Format ISO 8601
  documentId: string
  locale: string | null
  publishedAt: string // Format ISO 8601
}
export type LangList = 'en' | 'fr'
export type UserItem = {
  id: number
  title: string
  lang_pref?: LangList
  lang_conv?: LangList
  username: string
  firstname: string
  lastname: string
  email: string
  password?: string
  country: string
  role_code: string
  photo: Photo | null
  plan: number
  company_id: {
    id?: number
    name: string
    zipcode: string
    address: string
    city: string
    country: string
  } | null
  role_admin: {
    code: string
  }
}

export type UserStore = {
  user: UserItem | null
  userList: UserItem[]
  loading: boolean
  isEditing: boolean
  getUsersByQuery: (query: string) => void
  createUser: (user: Partial<UserItem>) => Promise<UserItem>
  updateUser: ({ id, user }: { id: number; user: Partial<UserItem> }) => Promise<UserItem>
  deleteUser: (id: number) => Promise<UserItem>
  getUser: (id: number) => Promise<UserItem>
  getUsers: () => Promise<UserItem[]>
  editUser: (id: number) => Promise<any>
  cancelEdit: () => void
  getCurrentUser: () => Promise<UserItem>
  setPlan: (planId: number, userId: number) => Promise<UserItem>
  verifyPassBeforeSetNew: ({ id, email, password }: { id: number; password: string; email: string }) => Promise<any>
  recoveryPassword: (email: string) => Promise<any>
}
