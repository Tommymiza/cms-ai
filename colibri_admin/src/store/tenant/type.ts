import { SiteItem } from "../site/type"
import { UserItem } from "../user/type"

export type TenantRole = "editor" | "admin" | "owner"

export type TenantItem = {
  id: number
  name: string
}

export type TenantMemberShip = {
  documentId?: string
  id?: number
  tenant: TenantItem
  role: TenantRole
  user: UserItem
  is_registred: boolean
}

export type EditorTenantAccess = {
  documentId?: string
  id?: number
  tenant_membership: TenantMemberShip
  website: SiteItem
}

export type TenantStore = {
  open: boolean
  userEditDialog: boolean
  tenantList: boolean
  tenantUsers: TenantMemberShip[]
  tenants: TenantMemberShip[]
  tenantId: TenantMemberShip | null
  userOnTenantListDialog: boolean
  editorTenantAccess: EditorTenantAccess[]
  getEditorTenantAccess: (userId: number) => Promise<void>
  toggleUserOnTenantListDialog: (state: boolean) => void
  toggle: (state: boolean) => void
  toggleUserEditDialog: (state: boolean) => void
  toggleTenant: (tenantId: number) => void
  getUserOnTenantId: () => void
  getTenantOfUser: () => Promise<void>
  initTenant: () => Promise<void>
  addUserToMyTenant: (user: UserItem) => void
  deleteUserFromTenant: (user: TenantMemberShip) => void
  updateUserRoleOnTenant: (user: TenantMemberShip, role: TenantRole, siteAccess: SiteItem[]) => void
  getMyOwnedTenant: () => Promise<TenantMemberShip>
}
