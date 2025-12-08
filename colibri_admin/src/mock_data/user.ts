import { TenantMemberShip } from '@/store/tenant/type'
import { UserItem } from '@/store/user/type'

export const user1 = {
  id: 1,
  title: 'John Doe',
  username: 'john.doe',
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe@example.com',
  country: 'France',
  role_code: 'admin',
  photo: null,
  company_id: null,
  role_admin: {
    code: 'admin',
  },
} as UserItem

export const user2 = {
  id: 2,
  title: 'Jane Doe',
  username: 'jane.doe',
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'jane.doe@example.com',
  country: 'France',
  role_code: 'user',
  photo: null,
  company_id: null,
  role_admin: {
    code: 'user',
  },
} as UserItem

export const user3 = {
  id: 3,
  title: 'Adolf Hitler',
  username: 'adolf.hitler',
  firstname: 'Adolf',
  lastname: 'Hitler',
  email: 'adolf.hitler@example.com',
  country: 'France',
  role_code: 'admin',
  photo: null,
  company_id: null,
  role_admin: {
    code: 'admin',
  },
} as UserItem

export const userItemsMock: UserItem[] = [user1, user2, user3]

export const tenant1 = {
  id: 1,
  name: 'Wazo',
}

export const tenant2 = {
  id: 2,
  name: 'BeConsult',
}

export const tenant3 = {
  id: 3,
  name: 'Safran',
}

export const userTenants : TenantMemberShip[] = [
  {
    user: user1,
    tenant: tenant1,
    role: 'owner',
    is_registred: true,
  },
  {
    user: user2,
    tenant: tenant2,
    role: 'editor',
    is_registred: true,
  },
  {
    user: user3,
    tenant: tenant3,
    role: 'admin',
    is_registred: true,
  },
]

export const tenantsMock = [tenant1, tenant2, tenant3]