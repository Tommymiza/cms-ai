import axios from '@/lib/axios'

export const uploadFile = async (file: File) => {
  try {
    const token = sessionStorage.getItem('token')
    const formData = new FormData()
    formData.append('files', file)
    const res = await axios.post('/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data[0].url
  } catch (error) {
    throw error
  }
}
