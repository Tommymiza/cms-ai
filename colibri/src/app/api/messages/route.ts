import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const lang = searchParams.get('lang')
    if (!lang) {
      return NextResponse.json(
        { error: 'Missing lang query parameter' },
        { status: 400 },
      )
    }
    const messages = await import(`./${lang}.json`)
    return NextResponse.json(messages.default)
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
