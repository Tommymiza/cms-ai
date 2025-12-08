import { NextResponse } from 'next/server'
import { checkDomain } from '../../bot/function'

export async function POST(req: Request) {
  const { data } = await req.json()
  try {
    console.log(data)
    const result = await checkDomain(data)
    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
