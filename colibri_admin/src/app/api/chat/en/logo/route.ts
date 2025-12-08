import axios from 'axios'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

export const maxDuration = 300

async function cropBase64Image(base64Input: string) {
  try {
    const inputBuffer = Buffer.from(base64Input, 'base64')

    // Traiter l'image avec Sharp
    const outputBuffer = await sharp(inputBuffer)
      .trim() // Recadrer l'image
      .toFormat('png') // Convertir en PNG
      .toBuffer() // Retourner en buffer

    // Convertir le buffer de sortie en base64
    const base64Output = outputBuffer.toString('base64')

    return base64Output
  } catch (error) {
    console.error('Erreur lors du recadrage :', error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { primary, secondary, nom, description } = await req.json()
    const sizes = ['2048x1024', '1024x1024']

    let prompt = ''
    if (secondary) {
      prompt = `A logo with primary color ${primary} and secondary color ${secondary}, on a white background. The name on the logo is: "${nom}". Description: ${description}. Do not include the description in the design.`
    } else {
      prompt = `A logo ${primary} on a white background with the name : "${nom}", description: ${description}. Do not include the description in the design.`
    }
    const response = await axios.post(
      'https://external.api.recraft.ai/v1/images/generations',
      {
        prompt,
        response_format: 'b64_json',
        size: sizes[Math.floor(Math.random() * sizes.length)],
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
      }
    )
    if (!response.data.data[0].b64_json) {
      throw new Error('An error occurred while generating the image')
    }
    const base64Data = response.data.data[0].b64_json
    const byteCharacters = atob(base64Data)
    const byteArray = new Uint8Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i)
    }
    const blob = new Blob([byteArray], { type: 'image/png' })
    const formData = new FormData()
    const file = new File([blob], `image-${Date.now()}.png`, { type: 'image/png' })
    formData.append('file[]', file)
    formData.append('response_format', 'b64_json')
    console.log('File type', blob.type)
    const uploadResponse = await axios.post('https://external.api.recraft.ai/v1/images/removeBackground', formData, {
      headers: {
        Authorization: `Bearer ${process.env.RECRAFT_API_KEY}`,
      },
    })
    if (!uploadResponse.data.image.b64_json) {
      throw new Error('An error occurred while generating the image')
    }

    const imageRecadrer = await cropBase64Image(uploadResponse.data.image.b64_json)
    return NextResponse.json({ url: imageRecadrer })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}
