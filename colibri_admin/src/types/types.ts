import { UserItem } from '@/store/user/type'

export type PersonalInfoType = {
  title: string
  firstname: string
  lastname: string
  email: string
  country?: string
}

export type HeadCell = {
  id: string
  label: string
  type?: string
  format?: string
  showEdit?: boolean
  showRemove?: boolean
  disableSorting?: boolean
  customButtons?: React.FC<any>[]
}

export type UserType = PersonalInfoType & {
  id: number
  hasCompany: string
  roles: string
  company?: CompanyInfoType & {
    id: number
  }
}

export type CompanyInfoType = {
  name: string
  address: string
  city: string
  zipcode: string
  country: string
}

export type WebsiteInfoType = {
  name: string
  displayName: string
  description: string
  siteStatus: string
  defautlVisitorCulture: CultureType['id']
  guuid: string
  mainDomainName: string
  url: string
  templateId: Template['id']
  websiteClassificationId: WebsiteClassificationType['id']
  userId: number
  primaryColor: string
  secondaryColor: string
  bgColor: string
  accentColor: string
  textColor: string
  createdAt: Date
  updatedAt: Date
  template?: Template
  cultures?: CultureType[]
  WebsiteClassifications?: WebsiteClassificationType[]
  users?: UserItem[]
}
export type WebsiteClassificationType = {
  id: number
  name: string
  createdAt?: Date | string
  updatedAt?: Date | string
}
export type CultureType = {
  id: number
  name: string
  shortName: string
  code: string
  alias: string
  isUiCulture: boolean
  lastModified: Date
  guuid: string
}

export type Template = {
  id: number
  name: string
}
export type CompanyInfoFormType = {
  name: string
  address: string
  city: string
  zipcode: string
  country: string
}
export type InfoFormType = PersonalInfoType &
  CompanyInfoFormType & {
    confirmEmail: string
  }
export type PersonalInfoFormType = PersonalInfoType & {
  confirmEmail: string
}

export type SidebarRoutesType = {
  label: string
  href: string
  icon: (props: { className?: string; width?: number; height?: number }) => JSX.Element
  subRoute?: {
    label: string
    href: string
    // icon?: (props: { className?: string; width?: number; height?: number }) => JSX.Element
  }[]
}
// export type SidebarRoutesType = {
//   label: string
//   href: string
//   icon: React.FC<any>
//   subRoute?: Omit<SidebarRoutesType, 'subRoute'>[]
// }

export type SensitiveDataType = {
  id: number
  expirationDate: Date
}

export type ErrorType = { message: string; code: string; status: number; name: string; stack: string }

export type ServerActionResult<T> = { success: true; data: T } | { success: false; error: ErrorType }
