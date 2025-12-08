import ax from 'axios'

const axios = ax.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
})

export default axios
