import axios from '@/lib/axios'
import { resolve } from 'node:dns'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export function getTranslations(lang: string) {
  const filePath = path.join(process.cwd(), 'messages', `${lang}.json`)
  const rawData = readFileSync(filePath, 'utf-8')
  const translations = JSON.parse(rawData)
  return translations
}

export function getMessage(lang: string, key: string) {
  const translations = getTranslations(lang)
  const message = translations['api'][key] || 'Missing translation'
  return message
}

export async function parameters() {
  const cultures: { id: number; name: string }[] = (await axios.get('/cultures')).data.data
  return { cultures }
}

export function base64ToFile(base64String: string, mimeType: string, fileName: string) {
  // Remove data URL scheme if present
  const base64Data = base64String.replace(/^data:.+;base64,/, '')
  const byteCharacters = atob(base64Data) // Decode Base64 string
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mimeType })
  return new File([blob], fileName, { type: mimeType })
}

export async function checkDomain(data: { main_domain_name: string }) {
  try {
    console.log(data)
    const resultat = await new Promise((res, rej) => {
      resolve(data.main_domain_name, (err, address) => {
        if (err) {
          res(err)
        } else {
          rej(address)
        }
      })
    })
    console.log(resultat)
    return 'Le domaine est valide'
  } catch (error: any) {
    console.log(error)
    return 'Le domaine est déjà pris, êtes vous propriétaire de ce domaine ?'
  }
}
