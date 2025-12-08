// In Next.js, this file would be called: app/providers.tsx
'use client'
import { Toaster } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import cultureStore from '@/store/culture'
import { useUiStore } from '@/store/ui'
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useAuth()
  const queryClient = getQueryClient()
  const { setIsAudioPermit } = useUiStore()
  const { getCultures } = cultureStore()
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Ne pas oublier de stopper le stream après la permission accordée
        stream.getTracks().forEach((track) => track.stop())
        setIsAudioPermit(true)
      } catch (error) {
        setIsAudioPermit(false)
        console.error('Permission microphone refusée ou erreur :', error)
      }
    }
    requestMicrophonePermission()
    getCultures()
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster richColors position="top-right" />
    </>
  )
}
