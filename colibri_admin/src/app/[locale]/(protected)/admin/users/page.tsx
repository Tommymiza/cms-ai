import AdminUserList from '@/components/admin-user-list'
import { Heading } from '@/components/heading'

export default function UsersPage() {
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>User List</Heading>
      </div>
      <AdminUserList />
    </>
  )
}
