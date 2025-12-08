import axios from 'axios'
import { NextResponse } from 'next/server'

export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    const response = await axios.post(
      'https://external.api.recraft.ai/v1/images/generations',
      {
        prompt,
        response_format: 'b64_json',
        extra_body: {
          controls: {
            background_color: [255, 255, 255],
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RECRAFT_API_KEY}`,
        },
      },
    )
    if (!response.data.data[0].b64_json) {
      throw new Error('An error occurred while generating the image')
    }
    const base64Data = response.data.data[0].b64_json
    return NextResponse.json({ image: base64Data })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error })
  }
}
