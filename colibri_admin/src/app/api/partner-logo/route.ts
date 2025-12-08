import axios from 'axios'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { nom } = await request.json()
    const response = await axios.get(`https://api.logo.dev/search?q=${nom}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LOGO_SECRET_KEY}`,
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
