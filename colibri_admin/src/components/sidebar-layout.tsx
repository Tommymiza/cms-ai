'use client'

import { Role } from '@/lib/constant'
import authStore from '@/store/auth'
import chatStore from '@/store/chat-dialog'
import tenantStore from '@/store/tenant'
import tokenStore from '@/store/token'
import * as Headless from '@headlessui/react'
import { ArrowPathIcon, ChatBubbleLeftRightIcon, XCircleIcon } from '@heroicons/react/16/solid'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BrowserView, MobileOnlyView } from 'react-device-detect'
import BotContainer from './bot/bot-container'
import BotMobileContainer from './bot/bot-mobile-container'
import { Button } from './button'
import { Dialog, DialogBody } from './dialog'
import { NavbarItem } from './navbar'
import TenantDialog from './tenant-form-container'

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  )
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

function MobileSidebar({ open, close, children }: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 w-full max-w-80 p-2 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
      >
        <div className="flex h-full flex-col rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
          <div className="-mb-3 px-4 pt-3">
            <Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  )
}

export function SidebarLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{ navbar: React.ReactNode; sidebar: React.ReactNode }>) {
  let [showSidebar, setShowSidebar] = useState(false)
  const { auth } = authStore()
  const { open, toggle } = chatStore()
  const { balance, getBalance } = tokenStore()
  const { open: tenantOpen, toggle: tenantToggle, tenantId } = tenantStore()
  const router = useRouter()
  useEffect(() => {
    getBalance()
  }, [])
  return (
    <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Sidebar on desktop */}
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">{sidebar}</div>

      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar on mobile */}
      <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <NavbarItem onClick={() => setShowSidebar(true)} aria-label="Open navigation">
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
        <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto max-w-6xl overflow-x-auto overflow-y-hidden">{children}</div>
          <div className="absolute bottom-10 right-10">
            <Button
              onClick={() => {
                if (auth && auth.role_admin.code === Role.ADMIN) {
                  router.push('/admin/websites')
                } else {
                  router.push('/user/websites')
                }
                toggle(true)
              }}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <Dialog onClose={() => {}} open={open} size="lg">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Tweeksy AI</h2>
              <div className="flex items-center gap-2">
                <h2 className="font-bold">Credit: {balance} </h2>
                <ArrowPathIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem(`chatMessages-${tenantId?.tenant.id}`)
                    window.location.reload()
                  }}
                />
                <XCircleIcon className="h-5 w-5 cursor-pointer" onClick={() => toggle(false)} />
              </div>
            </div>
            <DialogBody>
              <BrowserView>
                <BotContainer />
              </BrowserView>
              <MobileOnlyView>
                <BotMobileContainer />
              </MobileOnlyView>
            </DialogBody>
          </Dialog>

          <Dialog onClose={() => {}} open={tenantOpen} size="lg">
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <XCircleIcon className="h-5 w-5 cursor-pointer" onClick={() => tenantToggle(false)} />
              </div>
            </div>
            <DialogBody>
              <BrowserView>
                <TenantDialog />
              </BrowserView>
              {/* <MobileOnlyView>
                <BotMobileContainer />
              </MobileOnlyView> */}
            </DialogBody>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
