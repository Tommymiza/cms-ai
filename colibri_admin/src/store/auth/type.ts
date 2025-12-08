import { type UserItem } from '../user/type'

export type AuthStore = {
  auth: UserItem | null
  loading: boolean
  login: ({ identifier, password }: { identifier: string; password: string }) => Promise<any>
  register: (user: Partial<UserItem>) => Promise<UserItem>
  logout: () => Promise<any>
  updatePassword: (data: { new: string }) => Promise<any>
  getMe: () => Promise<any>
}
