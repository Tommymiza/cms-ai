'use client'

import userStore from '@/store/user'
import { HeadCell } from '@/types/types'
import { useEffect } from 'react'
import Loading from './loading/loading'
import DataTable from './table/data-table'

export default function AdminUserList() {
  const headCells: HeadCell[] = [
    { id: 'firstname', label: 'First Name', type: 'text' },
    { id: 'lastname', label: 'Last Name', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'company_id.name', label: 'Company', type: 'company' },
    { id: 'country', label: 'Country', type: 'country' },
  ]
  const { getUsers, loading: isLoading, userList } = userStore()
  useEffect(() => {
    getUsers()
  }, [getUsers])

  if (isLoading) {
    return (
      <div className="flex h-[150px] flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }
  return <DataTable data={userList as []} headCells={headCells} />
}
