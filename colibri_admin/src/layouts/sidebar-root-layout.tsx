'use client'

import { Avatar } from '@/components/avatar'
import { Dialog, DialogBody } from '@/components/dialog'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/components/dropdown'
import Loading from '@/components/loading/loading'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarItemButton,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import SignoutBtn from '@/components/Signout-btn'
import TenantList from '@/components/tenant-list'
import { setUrlPhoto } from '@/lib/util'
import authStore from '@/store/auth'
import siteStore from '@/store/site'
import tenantStore from '@/store/tenant'
import { SidebarRoutesType } from '@/types/types'
import { ChevronDownIcon, ChevronUpIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BrowserView } from 'react-device-detect'

const strapiBackend = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace('/api', '')
// const SignoutBtn = dynamic(() => import('@/components/Signout-btn'), { ssr: false })

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <SignoutBtn />
    </DropdownMenu>
  )
}

export default function SidebarRoutLayout({
  children,
  sidebarRoutes,
}: {
  children: React.ReactNode
  sidebarRoutes: SidebarRoutesType[]
}) {
  let pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('sidebar')
  const { auth } = authStore()
  const { tenantId,tenants, getTenantOfUser, toggleTenant, initTenant} = tenantStore()
  const {getSites} = siteStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      await initTenant()
      await getTenantOfUser()
      await getSites()
      setLoading(false)
    })()
  }, [])

  if (loading) return <Loading />

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                {auth?.photo ? (
                  <Avatar src={setUrlPhoto(auth.photo.url)} square />
                ) : (
                  <Avatar initials={auth?.firstname?.charAt(0)} square />
                )}
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItemButton}>
                <Avatar src="/teams/catalyst.svg" />
                <Link href="/">
                  <SidebarLabel>Colibri</SidebarLabel>
                </Link>
                <ChevronDownIcon />
              </DropdownButton>

            </Dropdown>

            <Dropdown>
              <DropdownButton as={SidebarItemButton}>Mon compte ({tenantId?.tenant.name})</DropdownButton>
              <DropdownMenu>
                {tenants.map((tenantMemberShip) => (
                  <DropdownItem key={tenantMemberShip.tenant.id}>
                    <SidebarLabel
                     onClick={
                      async () => {
                        await toggleTenant(tenantMemberShip.tenant.id)
                        await getSites()
                      }
                      } 
                    >{tenantMemberShip.tenant.name} ({tenantMemberShip.role})</SidebarLabel>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              {sidebarRoutes.map((route) => (
                <SidebarItem
                  key={route.label}
                  sidebarRoute={route}
                  current={route.subRoute ? true : pathname.startsWith(`/${locale}${route.href}`)}
                />
              ))}
            </SidebarSection>

            <SidebarSpacer />
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItemButton}>
                <span className="flex min-w-0 items-center gap-3">
                  {auth?.photo ? (
                    <Avatar square alt="avatar" src={setUrlPhoto(auth.photo.url)} className="h-6 w-6 max-w-6" />
                  ) : (
                    <Avatar square alt="avatar" initials={auth?.firstname?.charAt(0)} className="h-6 w-6 max-w-6" />
                  )}

                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {auth?.firstname}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {auth?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
