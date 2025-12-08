'use client'
import useCountryList from '@/hooks/useCountryList'
import authStore from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './button'
import { ErrorMessage, Field, Label } from './fieldset'
import { Input } from './input'
import { toast } from 'sonner'
import Loading from './loading/loading'
import { Select } from './select'
import { PlusCircleIcon } from '@heroicons/react/16/solid'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import userStore from '@/store/user'
import { UserItem } from '@/store/user/type'
import TenantUserList from './tenant-user-list'
import ConfirmDialog from './confirm-dialog'
import tenantStore from '@/store/tenant'

const schema = z
  .object({
    username: z.string()
  })

export default function TenantDialog() {
  const t = useTranslations('registerPage')
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })
  const [isPending, setPending] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const { userList, getUsersByQuery } = userStore()
  const {tenantUsers,addUserToMyTenant} = tenantStore()
  const [userInput, setUserInput] = useState<string>('')
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false)
  const [userSelected, setUserSelected] = useState<UserItem | null>(null)

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      setPending(true)
    } catch (error) {
      console.log(error)
    } finally {
      setPending(false)
    }
  }

  const onUserAddConfirm = () => {
    if(!selectedUser) {
      toast.error('User not selected')
      return
    }
    addUserToMyTenant(selectedUser)
    setOpenConfirmDialog(false)
    setSelectedUser(null)
    setUserInput('')
  }


  return (
    <div>
      <ConfirmDialog open={openConfirmDialog} message="Voulez-vous vraiment ajouter ce utilisateur ?" onCancel={() => setOpenConfirmDialog(false)} onConfirm={() => onUserAddConfirm()} />
      <span className="text-center text-sm text-red-500">{errors.root?.message && errors.root.message}</span>
      <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-4" autoComplete="off">
        <div className="space-y-4">
          <div className="mt-2 flex gap-3">
            <Field className="w-full max-w-sm">
              <div className="flex flex-col">
                <Combobox
                  value={selectedUser}
                  onClose={() => setUserInput('')}
                  onChange={setSelectedUser}
                >
                  <ComboboxInput
                    aria-label="Assignee"
                    placeholder="Tapez un Utilisateur à ajouter"
                    displayValue={(person?: UserItem) => person?.email ?? ""}
                    onChange={(event) => getUsersByQuery(event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <ComboboxOptions
                    anchor="bottom"
                    className="z-10 mt-1 max-h-60 w-80 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg empty:invisible"
                  >
                    {userList.map((person, index) => (
                      <ComboboxOption
                        key={person.id || person.username}
                        value={person}
                        className="cursor-pointer px-3 py-2 text-sm data-focus:bg-blue-50 hover:bg-blue-50"
                      >
                        {person.email}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                </Combobox>
                
                <p className="text-xs text-gray-500 mt-1">
                  Sélectionnez un utilisateur à assigner. Vous pouvez taper pour rechercher
                </p>
              </div>
            </Field>

            {isPending && <Loading />}
            {!isPending && (
              <PlusCircleIcon className="size-8 cursor-pointer mb-[2px]" onClick={() => setOpenConfirmDialog(true)} />
            )}
          </div>

        </div>
      </form>
      <h2 className="mt-4 font-bold">Utilisateurs</h2>
      <TenantUserList query=""/>
    </div>
  )
}
