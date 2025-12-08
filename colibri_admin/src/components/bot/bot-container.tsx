import useCountryList from '@/hooks/useCountryList'
import { addNewPreviewTweeksySubDomain, addNewTweeksySubDomain, deleteDomain } from '@/lib/api-vercel'
import axios from '@/lib/axios'
import { cn } from '@/lib/cn'
import { collectTextDFS, tokenCounter } from '@/lib/token-counter'
import { uploadFile } from '@/lib/upload/upload'
import authStore from '@/store/auth'
import cultureStore from '@/store/culture'
import siteStore from '@/store/site'
import tokenStore from '@/store/token'
import { useUiStore } from '@/store/ui'
// import { data } from '@/types/first-data'
import { htmlToJson } from '@/lib/htmlToJson'
import { removeMarkdownLinks } from '@/lib/markdown'
import tenantStore from '@/store/tenant'
import { useChat } from '@ai-sdk/react'
import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/16/solid'
import { DefaultChatTransport, FileUIPart, lastAssistantMessageIsCompleteWithToolCalls } from 'ai'
import ax from 'axios'
import { useLocale, useTranslations } from 'next-intl'
import { DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Divider } from '../divider'
import LoadingChat from './loading-chat'
import { Message } from './message'
import Speech from './speech'

export default function BotContainer() {
  const chatContainer = useRef<HTMLDivElement>(null)
  const { getSites, createSite, siteList, deleteSite } = siteStore()
  const { setUpload, isAudioPermit } = useUiStore()
  const [localLoading, setLocalLoading] = useState<number>(0)
  const [loadingText, setLoadingText] = useState<string | null>(null)
  const { addToken, getBalance } = tokenStore()

  const { auth } = authStore()
  const { cultureList } = cultureStore()
  const [switcher, setSwitcher] = useState<boolean>(
    localStorage.getItem('switcher') ? localStorage.getItem('switcher') === 'true' : true
  )

  const [fileLoading, setFileLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileUIPart[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const submitButton = useRef<HTMLButtonElement>(null)
  const [input, setInput] = useState('')
  const [loadVoice, setLoadVoice] = useState(false)
  const locale = useLocale()
  const t = useTranslations('bot')
  const [dataLoading, setDataLoading] = useState<boolean>(false)

  const recognition: SpeechRecognition | undefined = useMemo(
    () =>
      Boolean(window.webkitSpeechRecognition || window.SpeechRecognition)
        ? new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition()
        : undefined,
    []
  )

  async function handleFileUpload(fileList: FileList): Promise<FileUIPart[]> {
    try {
      const url = await uploadFile(fileList)

      const uploadedFiles: FileUIPart[] = [
        { type: 'file', filename: fileList[0].name, mediaType: fileList[0].type, url },
      ]

      // Tu peux accéder aux urls stockées
      uploadedFiles.forEach((f: any) => console.log(f.url))

      return uploadedFiles
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const [isListening, setIsListening] = useState(false)
  const { tenantId } = tenantStore()

  const { messages, setMessages, clearError, regenerate, addToolResult, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/bot`,
      body: {
        token: localStorage.getItem('auth') || '',
        tenantId: tenantId?.tenant.id,
        tenantType: tenantId?.role,
      },
    }),
    onError(error) {
      toast.error('Un problème est survenu !')
      console.log(error)
      clearError()
      const last = messages[messages.length - 1]
      if (last?.role === 'user') {
        setMessages((prev) => prev.slice(0, -2))
      } else {
        setMessages((prev) => prev.slice(0, -1))
      }
      regenerate()
    },
    onToolCall: async ({ toolCall }) => {
      const tool = toolCall
      try {
        const toolInput: any = tool.input
        switch (tool.toolName) {
          case 'generate_logo':
            const logo = await generateLogo(tool)
            finishTool(tool, logo)
            break
          case 'create_website':
            const createResponse = await createWebsite(tool)

            finishTool(tool, createResponse)
            break
          case 'update_website':
            finishTool(tool)
            break
          case 'delete_website':
            await deleteWebsite(tool)
            await getSites()
            finishTool(tool)
            break
          default:
            break
        }
      } catch (error) {
        console.log(error)
        toast.error(`Une erreur est survenue lors de l'exécution de la commande ${tool.toolName}`)
        finishTool(tool, `Erreur lors de l'exécution de la commande ${tool.toolName}`)
      } finally {
        setLoadingText('')
      }
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: async (data) => {
      const { isError, messages, message } = data
      localStorage.setItem(`chatMessages-${tenantId?.tenant.id}`, JSON.stringify(messages))
      const rawText = collectTextDFS(message)
      const outputToken = tokenCounter(rawText)
      await addToken(outputToken, 'openai/gpt5', 'output_token')
      localStorage.setItem(`chatMessages-${tenantId?.tenant.id}`, JSON.stringify(messages))
      console.log(data)
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, 2000)
      })
      scroll()
    },
  })

  const [result, setResult] = useState<string | null>(null)

  const finishTool = (tool: { toolName: string; toolCallId: string }, result: any = true) => {
    addToolResult({
      tool: tool.toolName,
      output: result,
      toolCallId: tool.toolCallId,
    })
  }

  const getUrlWithDescription = async (description: string) => {
    try {
      const response = await ax.post('/api/image', {
        description,
      })
      const data = response.data
      if (data.error) throw new Error(data.error)
      const blob = new Blob([`data:image/png;base64,${data.image}`], {
        type: 'image/png',
      })
      const formData = new FormData()
      formData.append('files', new File([blob], Date.now().toString(), { type: 'image/png' }))
      const res = await axios.post('/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth')}`,
        },
      })
      const url: string = res.data[0].url
      return {
        url,
        alt: description,
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const generateImage = async (images: { description: string }[]) => {
    try {
      const promises = images.map((img) => getUrlWithDescription(img.description))
      const results = await Promise.all(promises)
      return results
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  const countryList = useCountryList()

  const createWebsite = async (tool: any) => {
    let data = tool.input as any
    try {
      setLocalLoading(10)

      if (!auth) return

      const currentCountry = countryList.find((c) => c.id === +auth.country)?.name

      data = {
        ...data,
        fiche_entreprise: {
          country: currentCountry ?? 'France',
          contact_email: auth.email,
        },
      }
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('')
        }, 500)
      })

      setSwitcher(false)
      setLoadingText('Génération des données du site...')

      let imageData: any[] = []
      while (imageData.length === 0) {
        try {
          imageData = await generateImage(data.data.images)
        } catch (error) {
          console.log(error)
        }
      }

      data = { ...data, data: { ...data.data, images: imageData } }
      let siteData: any = null
      while (!siteData) {
        try {
          const dataRequest = await ax.post(`/api/site-data`, {
            site: data,
            token: localStorage.getItem('auth'),
            tenantId: tenantId?.tenant.id,
          })
          siteData = dataRequest.data.object.siteData
          // if (siteData.partenaires) {
          //   const partenairesWithLogos = await Promise.all(
          //     siteData.partenaires.map(async (partenaire: any) => {
          //       const results = await ax.post(`/api/partner-logo`, { nom: partenaire.nom })
          //       return {
          //         ...partenaire,
          //         image: results.data[0]?.logo_url || partenaire.image,
          //       }
          //     })
          //   )
          //   siteData = { ...siteData, partenaires: partenairesWithLogos }
          // }
        } catch (error) {
          console.log(error)
        }
      }

      data = { ...data, data: { ...data.data, ...siteData } }

      setLocalLoading(40)
      setLoadingText('Génération des pages du site...')

      let pageData: any = null
      while (!pageData) {
        try {
          const pageRequest = await ax.post(`/api/site-pages`, {
            site: data,
            token: localStorage.getItem('auth'),
            tenantId: tenantId?.tenant.id,
          })
          console.log(pageRequest.data)
          pageData = pageRequest.data.object
        } catch (error) {
          console.log(error)
        }
      }
      function cleanHTMLString(s: string) {
        return s
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\t/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim()
      }

      data = {
        ...data,
        data: {
          pages: pageData.pages.map((p: any) => ({
            ...p,
            html: cleanHTMLString(p.html),
          })),
          components: pageData.components.map((c: any) => {
            const key = Object.keys(c)[0]
            return {
              [key]: htmlToJson(cleanHTMLString(c[key].html)),
            }
          }),
          lists: data.data.siteData.lists,
        },
        style: cleanHTMLString(pageData.style),
        header: cleanHTMLString(pageData.header),
        footer: cleanHTMLString(pageData.footer),
      }

      setLoadingText("Transformation de l'HTML en JSON")
      setLocalLoading(75)

      data.header = htmlToJson(data.header)
      data.footer = htmlToJson(data.footer)

      data.data.pages = data.data.pages.map((page: any) => {
        const { html, ...rest } = page
        return {
          ...rest,
          blocks: htmlToJson(html),
        }
      })

      console.log(data)

      setLoadingText('Création du nom de domaine...')
      setLocalLoading(80)

      let tweeksy_domain_name = null
      let tweeksy_preview_domain_name = null

      while (!tweeksy_domain_name || !tweeksy_preview_domain_name) {
        try {
          const domainResponse = await addNewTweeksySubDomain(data.display_name)
          tweeksy_domain_name = domainResponse
          const previewDomainResponse = await addNewPreviewTweeksySubDomain(data.display_name)
          tweeksy_preview_domain_name = previewDomainResponse
        } catch (error) {
          console.log(error)
        }
      }

      const culture_id = cultureList.find(
        (c) =>
          c.code.toLowerCase() === data.default_visitor_culture.toLowerCase() ||
          c.short_name.toLowerCase() === data.default_visitor_culture.toLowerCase() ||
          c.alias.toLowerCase() === data.default_visitor_culture.toLowerCase()
      )?.id

      if (!culture_id) throw new Error('Culture non trouvée')
      const { version, ...finalData } = data
      const newSite: any = {
        ...finalData,
        default_visitor_culture: culture_id,
        tweeksy_domain_name,
        tweeksy_preview_domain_name,
        url: tweeksy_domain_name,
      }

      setLocalLoading(70)
      setLoadingText('Finalisation du site...')
      await createSite(newSite)

      localStorage.setItem('switcher', String(false))
      setLocalLoading(90)
      while (true) {
        try {
          const response = await ax.post(`/api/check-domain`, {
            link: `https://${tweeksy_preview_domain_name}`,
          })
          const { success } = response.data
          if (!success) throw new Error("Le site n'est pas encore disponible")
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve('')
            }, 5000)
          })
          break
        } catch (error) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve('')
            }, 5000)
          })
        }
      }

      setLocalLoading(100)
      await getSites()
      toast.success(t('toast.create-success'))
      return `[${newSite.display_name}](https://${tweeksy_preview_domain_name}?token=${localStorage.getItem('auth')}&tenant=${tenantId?.tenant.id})`
    } catch (error: any) {
      console.log(error)
      toast.error(t('toast.create-error'))
      return t('create.error')
    } finally {
      setLocalLoading(0)
      setLoadingText(null)
    }
  }

  const deleteWebsite = async (tool: any) => {
    const { documentId } = tool.input as any
    try {
      if (!documentId) return
      const site = siteList.find((s) => s.documentId === documentId)
      if (!site) return
      await deleteDomain(site.tweeksy_domain_name)
      await deleteDomain(site.tweeksy_preview_domain_name)
      await deleteSite(documentId)
      toast.success(t('toast.delete-success'))
      return 'Le site web a été supprimé avec succès.'
    } catch (error: any) {
      toast.error(t('toast.delete-error'))
      throw new Error("Une erreur s'est produite")
    }
  }

  const generateLogo = async (toolCall: any) => {
    try {
      const data = {
        ...toolCall.input,
      }
      setLoadingText(t('create.logo'))
      await new Promise((resolve) => {
        setTimeout(resolve, 500)
      })
      scroll()
      // generate logo
      const res1 = await ax.post(`/api/chat/logo`, data)
      const blob = new Blob([`data:image/png;base64,${res1.data.url}`], {
        type: 'image/png',
      })
      const formData = new FormData()
      formData.append('files', new File([blob], Date.now().toString(), { type: 'image/png' }))
      const res = await axios.post('/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth')}`,
        },
      })
      const url: string = res.data[0].url
      // const resColor = await ax.post('/api/getcolor', { url })
      // const colors = resColor.data
      return { url }
    } catch (error) {
      console.log(error)
      throw new Error('An error occurred while generating the logo')
    } finally {
      setLoadingText(null)
    }
  }

  const scroll = () => {
    const container = chatContainer.current
    if (container) {
      const { offsetHeight, scrollHeight, scrollTop } = container
      if (scrollHeight >= scrollTop + offsetHeight) {
        container.scrollTo(0, scrollHeight + 200)
      }
    }
  }

  const getAudioWithoutSignal = async (content: string) => {
    try {
      setLoadVoice(true)
      const response = await fetch(`/api/chat/${locale}/audio`, {
        method: 'POST',
        body: JSON.stringify({
          content,
        }),
      })
      const arrayBuffer = await response.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      if (audio.current) {
        audio.current.src = url
        audio.current.play()
      }
    } catch (error) {
      console.log(error)
      return null
    } finally {
      setLoadVoice(false)
    }
  }

  const getAudioWithSignal = async (content: string, signal: AbortSignal) => {
    try {
      setLoadVoice(true)
      const response = await fetch(`/api/chat/${locale}/audio`, {
        method: 'POST',
        body: JSON.stringify({
          content,
        }),
        signal: signal,
      })
      const arrayBuffer = await response.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      if (audio.current) {
        audio.current.src = url
        audio.current.play()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadVoice(false)
    }
  }

  const updateLoadingText = () => {
    const lastMessage = messages[messages.length - 1]

    if (!lastMessage || lastMessage.role !== 'assistant') {
      return
    }

    const lastPart: any = lastMessage.parts[lastMessage.parts.length - 1]

    if (!lastPart) {
      return
    }

    let nextValue: string | null = null

    if (lastPart.type.includes('tool')) {
      const state = lastPart.state
      if (!state) return
      switch (state) {
        case 'input-streaming':
          nextValue = 'Génération des données...'
        case 'input-available':
          nextValue = 'Génération des données...'
          break
        case 'output-available':
          nextValue = "Réception de la réponse de l'IA..."
          break
        case 'output-error':
          nextValue = null
          break
        default:
          nextValue = null
          break
      }
    }

    if (nextValue !== loadingText) {
      setLoadingText(nextValue)
    }
  }

  useEffect(() => {
    scroll()
    if (messages[messages.length - 1]?.role === 'user') {
      setUpload(false)
    }
    updateLoadingText()
  }, [messages])

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages-${tenantId?.tenant.id}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
      return
    }
    setMessages([
      {
        id: 'DzJjC0gXT3YHbikI',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: t('initial-message'),
            state: 'done',
          },
        ],
      },
    ])
  }, [t])

  useEffect(() => {
    if (switcher && messages.length > 0) {
      switch (status) {
        case 'ready':
          const lastMessage = messages[messages.length - 1]
          if (lastMessage.role === 'assistant') {
            const lastText = lastMessage.parts
              .map((part) => {
                if (part.type === 'text') {
                  return part.text
                }
                return ''
              })
              .join('')
            if (Boolean(lastText)) {
              const filteredText = removeMarkdownLinks(lastText)
              console.log(filteredText)
              getAudioWithoutSignal(filteredText)
            }
          }
          break
      }
    } else {
      if (audio.current?.played) {
        audio.current.pause()
      }
    }
  }, [status, switcher, messages])

  useEffect(() => {
    if (!isListening && result) {
      setInput(result)
      handleSubmitEvent()
    }
  }, [isListening, result])

  useEffect(() => {
    let controller = new AbortController()
    if (switcher) {
      if (messages.length === 1) {
        getAudioWithSignal('', controller.signal)
      }
    }
    if (!isAudioPermit) return

    if (!recognition) {
      toast.error('SpeechRecognition API non supportée.')
      console.error('SpeechRecognition API non supportée.')
      return
    }

    let isPressed = false

    const startRecognition = () => {
      if (!isPressed) {
        isPressed = true
        setIsListening(true)
        if (recognition) recognition.start()
      }
    }
    const stopRecognition = () => {
      if (isPressed) {
        isPressed = false
        if (recognition) recognition.stop()
      }
    }

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'fr-FR'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('result', event.results)
      if (event.results[event.results.length - 1].isFinal) {
        let finalTranscript = ''
        for (let result of event.results) {
          finalTranscript += result[0].transcript
        }
        setResult(finalTranscript)
        setInput(finalTranscript)
        if (!isPressed) {
          setIsListening(false)
        }
        return
      }
      let interimTranscript = ''
      for (let result of event.results) {
        interimTranscript += result[0].transcript
      }
      setInput(interimTranscript)
    }

    recognition.onerror = (event) => {
      console.log('error', event)
      setIsListening(false)
    }

    recognition.onend = () => {
      console.log('end')
      setIsListening(false)
    }

    // Détecter l'appui et le maintien de la touche espace
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' && event.ctrlKey && !isListening) {
        event.preventDefault()
        if (audio.current) {
          audio.current.pause()
        }
        startRecognition()
      }
    }

    // Détecter quand la touche est relâchée
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        stopRecognition()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      if (recognition) recognition.stop()
      controller.abort()
    }
  }, [isAudioPermit])

  const renderMessage = () => {
    return messages.filter((m) => m?.role !== 'system').map((m, i) => <Message message={m} key={m.id} />)
  }

  const handleSubmitEvent = (e?: FormEvent<HTMLFormElement>) => {
    try {
      e?.preventDefault()
      if (status !== 'ready') return
      if (!input.trim() && !files) return
      let message: any = { text: '' }
      if (input.trim()) message = { text: input.trim() }
      //url de l'image en format markdown
      if (files.length > 0) message = { text: message.text + ` \n ![${files[0].filename}](${files[0].url})`, files }
      sendMessage(message)
      setInput('')
      setFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Empêche l'ajout d'une nouvelle ligne
      console.log('Form submitted!')
      handleSubmitEvent()
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      setFileLoading(true)
      const newFileList = await handleFileUpload(droppedFiles as unknown as FileList)
      setFiles(newFileList)
    } else {
      setFiles([])
    }
    setFileLoading(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileLoading(true)
      const newFileList = await handleFileUpload(e.target.files)
      setFiles(newFileList)
    } else {
      setFiles([])
    }
    setFileLoading(false)
  }

  useEffect(() => {
    console.log('loadingText', loadingText)
  }, [loadingText])

  useEffect(() => {
    getBalance()
  }, [])

  // const sendData = async () => {
  //   try {
  //     const data = completeSite
  //     setDataLoading(true)
  //     const response = await createSite(data)
  //     console.log(response.data)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setDataLoading(false)
  //   }
  // }

  const testDomain = async () => {
    try {
      const siteName = 'test Site'
      const domain = await addNewTweeksySubDomain(siteName)
      console.log(domain)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      className={cn(isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100')}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="-z-10 flex max-h-[80vh] min-h-[80vh] w-full flex-col items-center justify-between gap-4 rounded-md bg-slate-50 p-4 dark:bg-zinc-950">
        <div className={cn('flex w-full flex-col gap-2 overflow-auto', switcher && 'h-[50vh]')} ref={chatContainer}>
          {renderMessage()}
          {loadingText && (
            <div className="flex w-full flex-col items-center gap-2">
              <p>{loadingText}.</p>
              {localLoading > 0 && (
                <>
                  <div className="w-full bg-white dark:bg-zinc-950">
                    <div
                      className="min-h-[10px] rounded-sm bg-zinc-800 dark:bg-slate-50"
                      style={{
                        width: `${localLoading}%`,
                      }}
                    />
                  </div>
                  <p>{localLoading}%</p>
                </>
              )}
            </div>
          )}
          {(status !== 'ready' || loadVoice || Boolean(localLoading)) && <LoadingChat />}
        </div>
        <div className="flex w-full flex-col items-center">
          <Divider />
          <button onClick={() => createWebsite('')}>{dataLoading ? 'loading..' : 'Send data'}</button>
          {recognition && isAudioPermit && (
            <div className="mt-2 flex flex-col">
              <audio controls ref={audio} className="hidden" />
              <Speech isListening={isListening} />
            </div>
          )}
          <form onSubmit={handleSubmitEvent} ref={formRef} className="relative mt-2 w-full">
            <textarea
              className="w-full rounded-[40px] border-2 p-4 pr-24 dark:[color-scheme:dark]"
              placeholder={t('input-placeholder')}
              onChange={(e) => setInput(e.target.value)}
              ref={inputRef}
              value={input}
              rows={1}
              onKeyDown={handleKeyDown}
              disabled={localLoading !== 0}
            />
            <div className="absolute right-4 top-5 flex items-center gap-2">
              {status === 'error' && (
                <button onClick={() => regenerate}>
                  <ArrowPathIcon className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:text-slate-50" />
                </button>
              )}
              <label htmlFor="image">
                <PhotoIcon className="h-6 w-6 cursor-pointer text-slate-400 hover:text-slate-600 dark:text-slate-50" />
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={() => {
                  setSwitcher((prev) => !prev)
                  localStorage.setItem('switcher', String(!switcher))
                }}
                disabled={loadVoice}
              >
                {switcher ? (
                  <SpeakerWaveIcon className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:text-slate-50" />
                ) : (
                  <SpeakerXMarkIcon className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:text-slate-50" />
                )}
              </button>
              <button disabled={localLoading !== 0} type="submit" ref={submitButton}>
                <PaperAirplaneIcon className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:text-slate-50" />
              </button>
            </div>
            {fileLoading && (
              <div className="flex h-20 w-16 items-center justify-center rounded-lg border bg-white">
                <div className="h-8 w-8 animate-ping rounded-full bg-slate-200"></div>
              </div>
            )}
            {files.length > 0 && !fileLoading && (
              <img src={files[0].url} alt={files[0].filename} className="h-20 w-16 rounded-lg object-contain" />
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
