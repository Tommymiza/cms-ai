import { NextResponse } from 'next/server'
export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const { link } = await req.json()
    const response = await fetch(link, { method: 'HEAD' })
    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({
      success: false,
    })
  }
}
