import { setUrlApiEndpoint } from '@/lib/util'
import axios from 'axios'

// invariant(
//   process.env.NEXT_PUBLIC_API_ENDPOINT,
//   'NEXT_PUBLIC_API_ENDPOINT is not defined, please define it in your .env file'
// )

// console.log('isProduction :', isProduction)
// console.log('isPreview :', isPreview)
// console.log('process.env.NEXT_PUBLIC_API_ENDPOINT :', process.env.NEXT_PUBLIC_API_ENDPOINT)
const Axios = axios.create({
  baseURL: setUrlApiEndpoint(),
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export class HttpClient {
  static async get<T>(url: string, params?: Record<string, any>) {
    console.log('url :', url)
    const response = await Axios.get<T>(`${url}`, {
      params: {
        ...params,
        timestamp: new Date().getTime(), // Add timestamp to force cache refresh
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    return response.data
  }

  static async post<T>(url: string, data: unknown, options?: any) {
    console.log('url post :', url)
    const response = await Axios.post<T>(url, data, options)
    return response.data
  }

  static async put<T>(url: string, data: unknown) {
    const response = await Axios.put<T>(url, data)
    return response.data
  }

  static async delete<T>(url: string) {
    const response = await Axios.delete<T>(url)
    return response.data
  }
}
