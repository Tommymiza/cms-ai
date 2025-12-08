'use client'
import { deleteDomain } from '@/lib/api-vercel'
import siteStore from '@/store/site'
import { HeadCell } from '@/types/types'
import { CheckIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from './dialog'
import Loading from './loading/loading'
import DataTable from './table/data-table'
import Tooltip from './Tooltip'
import userStore from '@/store/user'
import tenantStore from '@/store/tenant'

export default function TenantUserList({ query }: { query: string }) {
  const { userList, loading, getUsersByQuery } = userStore()
  const { userEditDialog, tenantUsers, toggleUserEditDialog, getUserOnTenantId, deleteUserFromTenant, updateUserRoleOnTenant } = tenantStore()
  const [selectedTenantMemberShip, setSelectedTenantMemberShip] = useState<TenantMemberShip | null>(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const headCells: HeadCell[] = [
    {
      id: 'user.email',
      label: "Email",
      type: 'text',
    },
    {
      id: 'role',
      label: "Role",
      type: 'text',
    },
    {
      id: 'is_registred',
      label: "Status",
      type: 'text',
      customButtons: [
        ((tenantMemberShip: TenantMemberShip) => tenantMemberShip.is_registred ? <p>Actif</p> : <p>En attente</p>),
      ]
    },
    {
      id: 'action',
      label: "Actions",
      type: 'action',
      customButtons: [
        ((tenantMemberShip: TenantMemberShip) =>  tenantMemberShip.role !== "owner" ? <Tooltip
          title="Modifier"
          onClick={() => {
            console.log(tenantMemberShip)
            setSelectedTenantMemberShip(tenantMemberShip)
            toggleUserEditDialog(true)
          }
          }
        >
          <PencilIcon className="h-4 w-4" />
        </Tooltip>:<p></p>),
        ((tenantMemberShip: TenantMemberShip) =>  tenantMemberShip.role !== "owner" ? <div>
          <Tooltip title="Revoquer" onClick={() => onUserAddConfirm(tenantMemberShip)}>
            <TrashIcon className="h-4 w-4" />
          </Tooltip>
        </div>:<p></p>)

      ],
    },
  ]

  const onUserAddConfirm = (tenantMemberShip: TenantMemberShip) => {
    deleteUserFromTenant(tenantMemberShip)
    setOpenConfirmDialog(false)
  }


  useEffect(() => {
    getUsersByQuery('')
    getUserOnTenantId()
    console.log("UseEffect ", tenantUsers)
  }, [])

  // useEffect(()=>{
  //   console.log("Updating tenant user:", tenantUsers)
  // },[tenantUsers])

  if (loading) {
    return (
      <div className="flex h-[150px] flex-col items-center justify-center">
        <Loading width="30px" height="30px" />
      </div>
    )
  }
  return (
    <div>
      {/* <ConfirmDialog
        open={openConfirmDialog}
        message="Voulez-vous vraiment supprimer ce utilisateur ?"
        onCancel={() => setOpenConfirmDialog(false)} onConfirm={() => onUserAddConfirm(user)}
      /> */}
      <Dialog onClose={() => toggleUserEditDialog(false)} open={userEditDialog} size="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Edit User</h2>
          <div className="flex items-center gap-2">
            {/* Optional close button */}
          </div>
        </div>

        <DialogBody>
          <EditUserDialogBody
            tenant={selectedTenantMemberShip}
            onCancel={() => toggleUserEditDialog(false)}
            onSave={(role,siteAccess) => {
              console.log("Saving user role on tenant", role)
              if (!selectedTenantMemberShip) {
                return
              }
              console.log("Saving user role on tenant", role, siteAccess)
              updateUserRoleOnTenant(selectedTenantMemberShip, role as TenantRole, siteAccess)
              toggleUserEditDialog(false)
            }}
          />
        </DialogBody>
      </Dialog>
      <DataTable data={tenantUsers} headCells={headCells} />
    </div>
  )
}

import { RadioGroup } from '@headlessui/react'
import { UserItem } from '@/store/user/type'
import ConfirmDialog from './confirm-dialog'
import { TenantMemberShip, TenantRole } from '@/store/tenant/type'
import { CheckboxField, CheckboxGroup, Checkbox } from './checkbox'
import { SiteItem } from '@/store/site/type'

type Props = {
  tenant: TenantMemberShip | null
  onSave: (role: 'admin' | 'editor', siteAccess: SiteItem[]) => void
  onCancel: () => void
}

enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor',
}

function EditUserDialogBody({ tenant, onSave, onCancel }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role>(tenant?.role as Role)
  const { siteList } = siteStore()
  const { getEditorTenantAccess, editorTenantAccess } = tenantStore()
  const [selectedSites, setSelectedSites] = useState<SiteItem[]>([]);

  const toggleSite = (site: SiteItem) => {
    setSelectedSites(prev => {
      const exists = prev.some(s => s.id === site.id);
      if (exists) {
        return prev.filter(s => s.id !== site.id);
      } else {
        return [...prev, site];
      }
    });
  }

  useEffect(() => {
    if (!tenant) return
    (async () => {
      await getEditorTenantAccess(tenant.user.id)
    })()
  }, [])
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">User Name</label>
        <p className="mt-1 text-gray-900">{tenant?.user?.username}</p>
      </div>

      <div>
        <RadioGroup value={selectedRole} onChange={setSelectedRole}>
          <RadioGroup.Label className="block text-sm font-medium text-gray-700">
            Role
          </RadioGroup.Label>
          <div className="mt-2 flex flex-col space-y-2">
            {([Role.ADMIN, Role.EDITOR] as const).map((role) => (
              <RadioGroup.Option
                key={role}
                value={role}
                className={({ active, checked }) =>
                  `relative flex cursor-pointer rounded-lg px-4 py-2 shadow-sm border focus:outline-none ${checked ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'
                  }`
                }
              >
                {({ checked }) => (
                  <span
                    className={`block text-sm font-medium ${checked ? 'text-blue-700' : 'text-gray-900'
                      }`}
                  >
                    {role}
                  </span>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      {selectedRole === Role.EDITOR && (
        <div>
          <CheckboxGroup className="max-w-md">
            {
              siteList.map((site) => (
                <CheckboxField key={site.id}>
                  <Checkbox
                    checked={selectedSites.some(s => s.id === site.id)}
                    onChange={() => toggleSite(site)}
                    className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-white data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
                  >
                    <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                  </Checkbox>
                  <span>
                    {site.display_name}
                  </span>
                </CheckboxField>
              ))
            }
          </CheckboxGroup>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 text-sm font-medium bg-gray-100 rounded hover:bg-gray-200"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => onSave(selectedRole, selectedSites)}
        >
          Save
        </button>
      </div>
    </div>
  )
}