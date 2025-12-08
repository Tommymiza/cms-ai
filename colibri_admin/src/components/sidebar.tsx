'use client'

import { cn } from '@/lib/cn'
import { SidebarRoutesType } from '@/types/types'
import * as Headless from '@headlessui/react'
import { ChevronDownIcon, GlobeAltIcon, UserIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import React, { Fragment, forwardRef, useEffect, useId, useState } from 'react'
import { TouchTarget } from './button'
import { Link } from './link'
import tenantStore from '@/store/tenant'

export function Sidebar({ className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav {...props} className={clsx(className, 'flex h-full min-h-0 flex-col')} />
}

export function SidebarHeader({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    />
  )
}

export function SidebarBody({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8'
      )}
    />
  )
}

export function SidebarFooter({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5'
      )}
    />
  )
}

export function SidebarSection({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  let id = useId()

  return (
    <LayoutGroup id={id}>
      <div {...props} data-slot="section" className={clsx(className, 'flex flex-col gap-0.5')} />
    </LayoutGroup>
  )
}

export function SidebarDivider({ className, ...props }: React.ComponentPropsWithoutRef<'hr'>) {
  return <hr {...props} className={clsx(className, 'my-4 border-t border-zinc-950/5 lg:-mx-4 dark:border-white/5')} />
}

export function SidebarSpacer({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" {...props} className={clsx(className, 'mt-8 flex-1')} />
}

export function SidebarHeading({ className, ...props }: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 {...props} className={clsx(className, 'mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400')} />
  )
}

// export const SidebarItem = forwardRef(function SidebarItem(
//   {
//     current,
//     className,
//     children,
//     ...props
//   }: { current?: boolean; className?: string; children: React.ReactNode } & (
//     | Omit<React.ComponentPropsWithoutRef<'button'>, 'as' | 'className'>
//     | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'type' | 'className'>
//   ),
//   ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
// ) {
//   let classes = clsx(
//     // Base
//     'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5',
//     // Leading icon/icon-only
//     'data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5',
//     // Trailing icon (down chevron or similar)
//     'data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4',
//     // Avatar
//     'data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6',
//     // Hover
//     'data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950',
//     // Active
//     'data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950',
//     // Current
//     'data-[slot=icon]:*:data-[current]:fill-zinc-950',
//     // Dark mode
//     'dark:text-white dark:data-[slot=icon]:*:fill-zinc-400',
//     'dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white',
//     'dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white',
//     'dark:data-[slot=icon]:*:data-[current]:fill-white'
//   )

//   return (
//     <span className={clsx(className, 'relative')}>
//       {current && (
//         <motion.span
//           layoutId="current-indicator"
//           className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white"
//         />
//       )}
//       {'href' in props ? (
//         <Headless.CloseButton as={Fragment} ref={ref}>
//           <Link className={classes} {...props} data-current={current ? 'true' : undefined}>
//             <TouchTarget>
//               <>{children}</>
//             </TouchTarget>
//           </Link>
//         </Headless.CloseButton>
//       ) : (
//         <Headless.Button
//           {...props}
//           className={clsx('cursor-default', classes)}
//           data-current={current ? 'true' : undefined}
//           ref={ref}
//         >
//           <TouchTarget>{children}</TouchTarget>
//         </Headless.Button>
//       )}
//     </span>
//   )
// })
export const SidebarItem = forwardRef(function SidebarItem(
  {
    current,
    className,
    // children,
    submenu,
    sidebarRoute,
    ...props
  }: {
    current?: boolean
    className?: string
    children?: React.ReactNode
    sidebarRoute?: SidebarRoutesType
    submenu?: { label: string; href: string }[] // Sous-menu
  } & (
    | Omit<React.ComponentPropsWithoutRef<'button'>, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'type' | 'className'>
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let classes = clsx(
    'flex w-full items-center rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5',
    'data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5',
    'data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4',
    'data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6',
    'data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950',
    'data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950',
    'data-[slot=icon]:*:data-[current]:fill-zinc-950',
    'dark:text-white dark:data-[slot=icon]:*:fill-zinc-400',
    'dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white',
    'dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white',
    'dark:data-[slot=icon]:*:data-[current]:fill-white'
  )

  const pathname = usePathname()
  const locale = useLocale()
  const [isCurrent, setIsCurrent] = useState(false)
  useEffect(() => {
    if (sidebarRoute?.subRoute) {
      const isSubRoute =
        `/${locale}${sidebarRoute?.subRoute?.find((item) => `/${locale}${item.href}` === pathname)?.href}` === pathname
      setIsCurrent(isSubRoute)
      setShowSubRoute(true)
      return
    }
    if (pathname === `/${locale}${sidebarRoute?.href}`) {
      setIsCurrent(true)
      return
    }
    setIsCurrent(false)
  }, [pathname, locale, sidebarRoute])

  const t = useTranslations('sidebar')
  const [showSubRoute, setShowSubRoute] = useState(false)
  const render = (
    <TouchTarget>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6">
            {sidebarRoute?.icon && <sidebarRoute.icon className="h-6 w-6" />}
          </span>
          <SidebarLabel>{t(sidebarRoute?.label)}</SidebarLabel>
        </div>
        {sidebarRoute?.subRoute && (
          <motion.span animate={{ rotate: showSubRoute ? 180 : 0 }} className="ml-auto transform">
            <ChevronDownIcon width={16} height={16} />
          </motion.span>
        )}
      </div>
    </TouchTarget>
  )

  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    setShowSubRoute((prev) => !prev)
  }
  return (
    <div>
      <span className={clsx(className, 'relative')}>
        {isCurrent && (
          <motion.span
            layoutId="current-indicator"
            className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white"
          />
        )}
        {sidebarRoute?.href && !sidebarRoute?.subRoute ? (
          <Headless.CloseButton as={Fragment} ref={ref}>
            <Link
              className={cn('cursor-pointer', classes)}
              href={sidebarRoute?.href}
              data-current={current ? 'true' : undefined}
            >
              {render}
            </Link>
          </Headless.CloseButton>
        ) : (
          <Headless.Button
            className={clsx('cursor-pointer', classes)}
            data-current={current ? 'true' : undefined}
            ref={ref}
            onClick={onClick}
          >
            {render}
          </Headless.Button>
        )}
        {/* Sous-menu */}
      </span>
      {sidebarRoute?.subRoute && showSubRoute && (
        <div className="flex flex-col transition-all duration-300">
          {sidebarRoute?.subRoute?.map((item) => <SidebarSubItem key={item.label} route={item} />)}
        </div>
      )}
    </div>
  )
})

function SidebarSubItem({
  className,
  route,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { route: Pick<SidebarRoutesType, 'label' | 'href'> }) {
  const t = useTranslations('sidebar')
  const pathName = usePathname()
  const locale = useLocale()
  const [isActive, setIsActive] = useState(false)
  useEffect(() => {
    if (`/${locale}${route.href}` === pathName) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [pathName, locale, route])
  return (
    <Link
      href={route.href}
      {...props}
      className={clsx(
        className,
        'flex w-full cursor-pointer items-center rounded-lg px-2 py-2.5 pl-7 text-left text-base/6 font-medium text-zinc-950 hover:bg-white/10 sm:py-2 sm:text-sm/5 dark:text-white',
        isActive ? 'bg-white/10 dark:bg-white/10' : ''
      )}
    >
      <TouchTarget>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <span className="h-6 w-6">
              <route.icon />
            </span> */}
            <SidebarLabel>{t(route.label)}</SidebarLabel>
          </div>
        </div>
      </TouchTarget>
    </Link>
  )
}

export const SidebarItemButton = forwardRef(function SidebarItemButton(
  {
    current,
    className,
    children,
    submenu,
    ...props
  }: {
    current?: boolean
    className?: string
    children: React.ReactNode
    submenu?: { label: string; href: string }[] // Sous-menu
  } & (
    | Omit<React.ComponentPropsWithoutRef<'button'>, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'type' | 'className'>
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  let classes = clsx(
    'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5',
    'data-[slot=icon]:*:size-6 data-[slot=icon]:*:shrink-0 data-[slot=icon]:*:fill-zinc-500 sm:data-[slot=icon]:*:size-5',
    'data-[slot=icon]:last:*:ml-auto data-[slot=icon]:last:*:size-5 sm:data-[slot=icon]:last:*:size-4',
    'data-[slot=avatar]:*:-m-0.5 data-[slot=avatar]:*:size-7 data-[slot=avatar]:*:[--ring-opacity:10%] sm:data-[slot=avatar]:*:size-6',
    'data-[hover]:bg-zinc-950/5 data-[slot=icon]:*:data-[hover]:fill-zinc-950',
    'data-[active]:bg-zinc-950/5 data-[slot=icon]:*:data-[active]:fill-zinc-950',
    'data-[slot=icon]:*:data-[current]:fill-zinc-950',
    'dark:text-white dark:data-[slot=icon]:*:fill-zinc-400',
    'dark:data-[hover]:bg-white/5 dark:data-[slot=icon]:*:data-[hover]:fill-white',
    'dark:data-[active]:bg-white/5 dark:data-[slot=icon]:*:data-[active]:fill-white',
    'dark:data-[slot=icon]:*:data-[current]:fill-white'
  )

  return (
    <div>
      <span className={clsx(className, 'relative')}>
        {'href' in props ? (
          <Headless.CloseButton as={Fragment} ref={ref}>
            <Link className={classes} {...props} data-current={current ? 'true' : undefined}>
              <TouchTarget>
                <div className="flex items-center justify-between">{children}</div>
              </TouchTarget>
            </Link>
          </Headless.CloseButton>
        ) : (
          <Headless.Button
            {...props}
            className={clsx('cursor-default', classes)}
            data-current={current ? 'true' : undefined}
            ref={ref}
          >
            <TouchTarget>{children}</TouchTarget>
          </Headless.Button>
        )}
      </span>
    </div>
  )
})
export function SidebarLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'truncate')} />
}

export const sidebarUserRoutes: SidebarRoutesType[] = [
  {
    label: 'user.profil',
    href: '/user/profile',
    icon: ({ className, width, height }) => <UserIcon className={className} width={width} height={height} />,
    subRoute: [
      {
        label: 'user.edit-profile',
        href: '/user/profile',
        // icon: ({ className, width, height }) => (
        //   <FaUserEdit className={clsx(className, 'h-5 w-5')} width={width} height={height} />
        // ),
      },
      {
        label: 'user.change-password',
        href: '/user/edit-password',
        // icon: ({ className, width, height }) => (
        //   <FaUserEdit className={clsx(className, 'h-5 w-5')} width={width} height={height} />
        // ),
      },
    ],
  },
  {
    label: 'user.websites',
    href: '/user/websites',
    icon: ({ className, width, height }) => <GlobeAltIcon className={className} width={width} height={height} />,
  },
]

export const sidebarAdminRoutes: SidebarRoutesType[] = [
  {
    label: 'admin.users',
    href: '/admin/users',
    icon: ({ className, width, height }) => <UserIcon className={className} width={width} height={height} />,
  },
  {
    label: 'admin.websites',
    href: '/admin/websites',
    icon: ({ className, width, height }) => <GlobeAltIcon className={className} width={width} height={height} />,
  },
]
