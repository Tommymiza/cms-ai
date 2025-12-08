import { create } from 'zustand'
import { TenantStore, TenantItem, TenantMemberShip, TenantRole, EditorTenantAccess } from './type'
import { tenantsMock, userItemsMock, userTenants } from '@/mock_data/user'
import { UserItem } from '../user/type'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import userStore from '../user'
import authStore from '../auth'
import { SiteItem } from '../site/type'

const tenantStore = create<TenantStore>((set, get) => ({
  open: false,
  userOnTenantListDialog: false,
  userEditDialog: false,
  tenantList: false,
  tenantUsers: [],
  tenants: [],
  tenantId: null,
  editorTenantAccess: [],
  toggle(state) {
    set({ open: state })
  },
  toggleUserEditDialog(state) {
    set({ userEditDialog: state })
  },
  toggleUserOnTenantListDialog(state) {
    set({ userOnTenantListDialog: state })
  },
  async toggleTenant(tenantId: number) {
    console.log("Toggling tenant", tenantId)
    try {
      const response = await axios.get('/tenant-memberships', {
        params: {
          populate: ['user', 'tenant'],
          filters: {
            tenant: {
              $eq: tenantId
            },
            user: {
              $eq: authStore.getState().auth?.id
            }
          }
        }
      })
      if (response.data.data.length === 0) {
        throw new Error('Tenant not found')
      }
      console.log("Tenant toggled", response.data.data)
      const tenant = response.data.data[0]
      localStorage.setItem('tenantId', JSON.stringify(tenant))
      set({ tenantId: tenant })
    } catch (error) {
      console.log(error)
    }

  },

  async getUserOnTenantId() {
    console.log("Getting user on tenant id")
    try {
      const response = await axios.get('/tenant-memberships', {
        params: {
          populate: ['user', 'tenant'],
          filters: {
            tenant: {
              $eq: get().tenantId?.tenant.id
            }
          }
        }
      })
      console.log(response)
      set({ tenantUsers: response.data.data })
    } catch (error) {
      console.log(error)
    }
  },

  async getTenantOfUser() {
    const currentUser = authStore.getState().auth
    if (!currentUser) throw new Error('User not found')
    console.log("Getting tenant of user", currentUser)
    try {
      const response = await axios.get('/tenant-memberships', {
        params: {
          populate: ['user', 'tenant'],
          filters: {
            user: {
              $eq: currentUser.id,
            },
            is_registred: {
              $eq: true
            }
          }
        }
      })
      console.log(response)
      set({ tenants: response.data.data })
    } catch (error) {
      console.log(error)
    }
  },

  async getMyOwnedTenant() {
    console.log("Getting my owned tenant")
    const currentUser = authStore.getState().auth
    if (!currentUser) throw new Error('User not found')
    console.log("Getting tenant of user", currentUser)
    try {
      const response = await axios.get('/tenant-memberships', {
        params: {
          populate: ['user', 'tenant'],
          filters: {
            user: {
              $eq: currentUser.id
            },
            role: {
              $eq: 'owner'
            }
          }
        }
      })
      console.log("My owned tenant", response)
      return response.data.data[0]
    } catch (error) {
      console.log(error)
    }
  },

  async initTenant() {
    console.log("Initializing tenant")
    const raw_tenantId = localStorage.getItem('tenantId')
    let tenantId: TenantMemberShip | null = null
    if (!raw_tenantId) {

      const myTenant = await get().getMyOwnedTenant()
      if (!myTenant) throw new Error('Tenant not found')
      localStorage.setItem('tenantId', JSON.stringify(myTenant))
      tenantId = myTenant
    } else {
      tenantId = JSON.parse(raw_tenantId)
    }

    if (tenantId) {
      set({ tenantId })
    }
  },

  async addUserToMyTenant(user: UserItem) {
    console.log("Adding user to my tenant", user)
    const tenantId = get().tenantId
    if (!tenantId) throw new Error('Tenant not found')
    if (tenantId.role !== 'owner') throw new Error('You are not the owner of this tenant')
    const newTenantUser = {
      user: user.id,
      tenant: tenantId.tenant.id,
      role: 'editor',
    }

    try {
      console.log("Inserting tenant user", newTenantUser)
      const response = await axios.post('/tenant-memberships',
        { data: newTenantUser },
      );

      if (!response.status.toString().startsWith('2')) {
        toast.error('Error creating entry')
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const insertedTenantUser = await response.data;
      console.log('Entry created:', insertedTenantUser);

      if (get().tenantUsers.find((tenant) => tenant.user.id === user.id)) {
        toast.error('User already in tenant')
        return
      }
      get().getUserOnTenantId()
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  },

  async deleteUserFromTenant(tenantMemberShip: TenantMemberShip) {
    console.log("Deleting user from tenant", tenantMemberShip)
    try {
      console.log("Deleting tenant user", tenantMemberShip)
      console.log("Deleting tenant user documentId", tenantMemberShip.documentId)
      const response = await axios.delete(`/tenant-memberships/${tenantMemberShip.documentId}`);
      if (!response.status.toString().startsWith('2')) {
        toast.error('Error deleting entry')
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const deletedTenantUser = await response.data;
      console.log('Entry deleted:', deletedTenantUser);
      const newData = get().tenantUsers.filter((tenant) => tenant.id !== tenantMemberShip.id)
      console.log(newData)
      set({ tenantUsers: newData })
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  },

  async getEditorTenantAccess(userId: number) {
    console.log("Getting editor tenant access")
    try {
      const response = await axios.get('/editor-tenant-accesses', {
        params: {
          populate: ['tenant_membership', 'website'],
          filters: {
            tenant_membership: {
              user: {
                $eq: userId
              }
            }
          }
        }
      })
      console.log("Editor tenant access", response)
      set({ editorTenantAccess: response.data.data })
    } catch (error) {
      console.log(error)
    }
  },

  async updateUserRoleOnTenant(tenantMemberShip: TenantMemberShip, role: TenantRole, websiteItems: SiteItem[] = []) {
    console.log("Updating user role on tenant", tenantMemberShip)
    try {
      console.log("Updating tenant user", tenantMemberShip)
      const response = await axios.put(`/tenant-memberships/${tenantMemberShip.documentId}`,
        { data: { role } },
      );
      if (!response.status.toString().startsWith('2')) {
        toast.error('Error updating entry')
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if(role === 'editor') {
        const editorTenantAccess = await axios.get(`/editor-tenant-accesses`, {
          params: {
            populate: ['tenant_membership', 'website'],
            filters: {
              tenant_membership: {
                $eq: tenantMemberShip.id
              }
            }
          }
        });
        console.log("Editor tenant access", editorTenantAccess)
        if(editorTenantAccess.data.data.length > 0) {
          editorTenantAccess.data.data.forEach(async (access: EditorTenantAccess) => {
            await axios.delete(`/editor-tenant-accesses/${access.documentId}`);
          })
        }
        websiteItems.forEach(async (website) => {
          const editorTenantAccess = {
            tenant_membership: tenantMemberShip.id,
            website: website.id,
          }
          await axios.post('/editor-tenant-accesses',
          { data: editorTenantAccess },
        );
        })
      }

      const updatedTenantUser = await response.data;
      console.log('Entry updated:', updatedTenantUser);
      get().getUserOnTenantId()
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  }
}))

export default tenantStore
