// Generate POST API route

import { openai } from '@ai-sdk/openai'
import { generateObject, ModelMessage } from 'ai'
import { NextResponse } from 'next/server'
import z from 'zod'

export const maxDuration = 300

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    const fetchImage = await fetch(url)
    const imageBlob = await fetchImage.blob()
    if (!imageBlob) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const arrayBuffer = await imageBlob.arrayBuffer()
    const messages: ModelMessage[] = [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            image: arrayBuffer,
          },
        ],
      },
    ]
    const responseObject = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        primary: z
          .string()
          .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)
          .describe('La couleur principale en format hexadécimal'),
        secondary: z
          .string()
          .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)
          .describe('La couleur secondaire en format hexadécimal'),
      }),
      messages,
    })

    return responseObject.toJsonResponse()
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
