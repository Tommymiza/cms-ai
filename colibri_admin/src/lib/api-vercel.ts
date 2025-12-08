import { Vercel } from '@vercel/sdk'

const vercel = new Vercel({
  bearerToken: process.env.NEXT_PUBLIC_VERCEL_TOKEN!,
})

export const formatSubdomain = (siteName: string) => {
  let formattedName = siteName.toLowerCase()

  formattedName = formattedName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')

  formattedName = formattedName.replace(/^-+|-+$/g, '')

  if (formattedName.length > 63) {
    formattedName = formattedName.substring(0, 63)
  }
  return `${formattedName}`
}

export const addNewTweeksySubDomain = async (siteName: string) => {
  if (!siteName) {
    throw new Error('Site name is required')
  }
  const domain = 'tweeksy.lu'

  let res = null

  let i = 0
  while (!res) {
    try {
      const newSubDomain =
        i === 0 ? `${formatSubdomain(siteName)}.${domain}` : `${formatSubdomain(siteName)}-${i}.${domain}`
      const response = await vercel.projects.addProjectDomain({
        idOrName: process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!,
        teamId: process.env.NEXT_PUBLIC_VERCEL_PROJECT_TEAM_ID!,
        requestBody: {
          name: newSubDomain,
          customEnvironmentId: process.env.NEXT_PUBLIC_ENVIRONMENT_ID!,
        },
      })
      res = response.name
    } catch (error) {
      i++
      console.log('error add domain', error)
    }
  }
  return res
}
export const addNewPreviewTweeksySubDomain = async (siteName: string) => {
  if (!siteName) {
    throw new Error('Site name is required')
  }
  const domain = 'tweeksy.lu'

  let res = null

  let i = 0
  while (!res) {
    try {
      const newSubDomain =
        i === 0
          ? `${formatSubdomain(siteName)}.preview.${domain}`
          : `${formatSubdomain(siteName)}-${i}.preview.${domain}`
      const response = await vercel.projects.addProjectDomain({
        idOrName: process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!,
        teamId: process.env.NEXT_PUBLIC_VERCEL_PROJECT_TEAM_ID!,
        requestBody: {
          name: newSubDomain,
          customEnvironmentId: process.env.NEXT_PUBLIC_ENVIRONMENT_ID!,
        },
      })
      res = response.name
    } catch (error) {
      i++
      console.log('error add domain', error)
    }
  }
  return res
}

export const deleteDomain = async (domainName: string) => {
  try {
    if (!domainName) {
      throw new Error('Domain name is required')
    }
    await vercel.projects.removeProjectDomain({
      idOrName: process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!,
      teamId: process.env.NEXT_PUBLIC_VERCEL_PROJECT_TEAM_ID!,
      domain: domainName,
    })
  } catch (error) {
    console.log('error delete domain', error)
  }
}
