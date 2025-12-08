const isProduction = process.env.VERCEL_ENV === 'production'
const isPreview = process.env.VERCEL_ENV === 'preview'

export const setUrlApiEndpoint = () => {
  if (isProduction) {
    return process.env.NEXT_PUBLIC_API_ENDPOINT
  }
  if (isPreview) {
    return process.env.NEXT_PUBLIC_PREVIEW_API_ENDPOINT
  }
  return process.env.NEXT_PUBLIC_API_ENDPOINT
}

export const setUrlBase = () => {
  if (isProduction) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  if (isPreview) {
    return process.env.NEXT_PUBLIC_PREVIEW_BASE_URL
  }
  return process.env.NEXT_PUBLIC_BASE_URL
}

export const setUrl = () => {
  if (isProduction) {
    return process.env.NEXT_PUBLIC_URL
  }
  if (isPreview) {
    return process.env.NEXT_PUBLIC_PREVIEW_URL
  }
  return process.env.NEXT_PUBLIC_URL
}

const strapiBackend = process.env.NEXT_PUBLIC_API_ENDPOINT?.replace('/api', '')

export const setUrlPhoto = (photo: string) => {
  return photo
}
