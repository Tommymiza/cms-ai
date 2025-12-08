import ax from 'axios'

const axios = ax.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_ENDPOINT
})

export default axios