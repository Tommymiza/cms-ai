import ax from '@/lib/axios'
import { UserItem } from '@/store/user/type'
import axios from 'axios'

export const uploadSingleFile = async (image: File, oldImage: UserItem['photo']) => {
  try {
    const token = localStorage.getItem('auth')
    const strapiBackend = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace('/api', '')
    const uploadUrl = `${strapiBackend}/api/upload`
    const deleteUrl = `${strapiBackend}/api/upload/files`

    // Vérifiez si l'utilisateur a déjà une image et supprimez-la si elle existe
    if (oldImage && oldImage.id) {
      try {
        await axios.delete(`${deleteUrl}/${oldImage.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('Ancienne image supprimée avec succès')
      } catch (deleteError) {
        console.error("Erreur lors de la suppression de l'ancienne image:", deleteError)
      }
    }

    // Upload de la nouvelle image
    const formData = new FormData()
    formData.append('files', image)

    const res = await axios.post(uploadUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = progressEvent.total && Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`Uploading... ${percentCompleted}% complete`)
      },
    })

    return res.data
  } catch (error) {
    console.error("Erreur lors de l'upload de la nouvelle image:", error)
    return error
  }
}

export const uploadFile = async (files: FileList) => {
  try {
    const token = localStorage.getItem('auth')
    console.log(token)
    if (!files[0]) return
    const file = files[0]
    const formData = new FormData()
    formData.append('files', file)
    const res = await ax.post('/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data[0].url
  } catch (error) {
    throw error
  }
}

interface UploadedFile {
  name: string
  type: string
  url: string
}

export async function createFileListFromUrls(uploadedFiles: UploadedFile[]): Promise<FileList> {
  const dataTransfer = new DataTransfer()

  for (const fileData of uploadedFiles) {
    const response = await fetch(fileData.url)
    const blob = await response.blob()

    const file = new File([blob], fileData.name, { type: fileData.type })
    dataTransfer.items.add(file)
  }

  return dataTransfer.files
}
