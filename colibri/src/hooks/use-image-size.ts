import { useEffect, useState } from 'react'

export default function useImageSize(size: number, src: string) {
  const [resizedSrc, setResizedSrc] = useState<string>('')
  const [aspectRatio, setAspectRatio] = useState<number>(1)
  useEffect(() => {
    const resizeImage = async () => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => {
        const aspectRatio = img.width / img.height
        const canvas = document.createElement('canvas')
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
        if (ctx && size) {
          canvas.width = Number(size)
          canvas.height = Number(size) / aspectRatio
          // 🛑 ⚡ Ne pas mettre de fond blanc → Transparence conservée
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, Number(size), Number(size) / aspectRatio)

          // 🔥 Convertir en WebP avec transparence & compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpUrl = URL.createObjectURL(blob)
                setResizedSrc(webpUrl)
              } else {
                console.error('❌ Échec de la conversion en WebP')
              }
            },
            'image/png', // ✅ WebP = transparence + compression
          )
        }
      }

      img.onerror = () => {
        console.error("❌ Erreur lors du chargement de l'image !")
      }
    }

    resizeImage()
  }, [src, size])

  return resizedSrc
}
