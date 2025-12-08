'use client'

import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import { Role } from '@/lib/constant'
// import { sidebarAdminRoutes, sidebarUserRoutes } from '@/routes/sidebar-route'
import authStore from '@/store/auth'
import { UserItem } from '@/store/user/type'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar } from './avatar'
import BtnLogin from './btn-login'
import { sidebarAdminRoutes, sidebarUserRoutes } from './sidebar'

export default function NavbarHome() {
  const { auth, loading } = authStore()

  return (
    <Navbar className="p-10 py-6">
      <Link href="/">
        <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">Tweeksy</h1>
      </Link>
      <NavbarSpacer />
      <NavbarSection>
        {loading ? (
          // Skeleton pendant le chargement
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-400" />
        ) : auth ? (
          // Avatar de l'utilisateur connecté
          <AvatarUser auth={auth} />
        ) : (
          // Bouton Login si l'utilisateur n'est pas connecté
          <NavbarItem href="/login" aria-label="Login">
            <BtnLogin />
          </NavbarItem>
        )}
      </NavbarSection>
    </Navbar>
  )
}

const AvatarUser = ({ auth }: { auth: UserItem }) => {
  const t = useTranslations('sidebar')
  const ts = useTranslations('signout')
  const { logout } = authStore()
  const router = useRouter()
  const menus = auth.role_admin.code === Role.ADMIN ? sidebarAdminRoutes : sidebarUserRoutes

  const handleLogout = async () => {
    logout()
    router.refresh()
  }

  return (
    <Menu as="div">
      <MenuButton>
        {auth.photo ? (
          <Avatar
            src={auth.photo.url}
            alt={auth.username}
            className="h-10 w-10 cursor-pointer border-2 border-transparent hover:border-zinc-950/5 hover:shadow-md dark:hover:border-gray-400"
          />
        ) : (
          <Avatar
            initials={auth.firstname?.charAt(0)}
            className="h-10 w-10 cursor-pointer border-2 border-transparent hover:border-zinc-950/5 hover:shadow-md dark:hover:border-gray-400"
          />
        )}
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-slate-900 p-1 text-sm/6 text-white shadow-lg transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-white/5 dark:text-zinc-950"
      >
        {menus.map((menu) => (
          <MenuItem key={menu.label}>
            <button
              type="button"
              onClick={() => router.push(menu.href)}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
            >
              <span className="flex h-6 w-6 items-center justify-center">{<menu.icon />}</span>
              <span className="truncate">{t(menu.label)}</span>
            </button>
          </MenuItem>
        ))}
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10"
            onClick={handleLogout}
          >
            <span className="flex h-6 w-6 items-center justify-center">
              <ArrowRightStartOnRectangleIcon />
            </span>
            {ts('title')}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
