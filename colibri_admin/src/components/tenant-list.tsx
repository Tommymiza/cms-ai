'use client'
import { deleteDomain } from '@/lib/api-vercel'
import siteStore from '@/store/site'
import { HeadCell } from '@/types/types'
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from './dialog'
import Loading from './loading/loading'
import DataTable from './table/data-table'
import Tooltip from './Tooltip'
import userStore from '@/store/user'
import tenantStore from '@/store/tenant'

export default function TenantList({ query }: { query: string }) {
  const { loading } = userStore()
  const { tenants, getTenantOfUser } = tenantStore()
  const headCells: HeadCell[] = [
    {
      id: 'tenant.name',
      label: "Tenant",
      type: 'text',
    },
    {
      id: 'role',
      label: "Role",
      type: 'text',
    },
    {
      id: 'action',
      label: "Actions",
      type: 'action',
      customButtons: [
        // ((user: UserItem) => <Tooltip
        //   title="Modifier"
        //   onClick={() => {
        //     console.log(user)
        //     setSelectedUser(user)
        //     toggleUserEditDialog(true)
        //   }
        //   }
        // >
        //   <PencilIcon className="h-4 w-4" />
        // </Tooltip>),
        // (() => <Tooltip title="Revoquer" onClick={() => null}>
        //   <TrashIcon className="h-4 w-4" />
        // </Tooltip>)
      ],
    },
  ]
  useEffect(() => {
    getTenantOfUser()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[150px] flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }
  return (
    <div>
      <DataTable data={tenants} headCells={headCells} />
    </div>
  )
}