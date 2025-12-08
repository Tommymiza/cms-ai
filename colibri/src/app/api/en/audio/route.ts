import AWS from 'aws-sdk'
import { NextResponse } from 'next/server'
require('aws-sdk/lib/maintenance_mode_message').suppress = true

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
})

const polly = new AWS.Polly()

export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const { content } = await req.json()
    const response: Promise<ArrayBuffer> = new Promise((res, rej) => {
      polly.synthesizeSpeech(
        {
          Text: content,
          OutputFormat: 'mp3',
          VoiceId: 'Salli',
          LanguageCode: 'en-US',
        },
        (err, data) => {
          if (err) {
            console.log(err)
            rej(err)
          } else {
            if (data && data.AudioStream) {
              let uInt8Array = new Uint8Array(
                data.AudioStream as unknown as ArrayBuffer,
              )
              let arrayBuffer = uInt8Array.buffer
              res(arrayBuffer)
            }
          }
        },
      )
    })
    const blob = await response
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error) {
    return new NextResponse(null, {
      status: 500,
    })
  }
}
