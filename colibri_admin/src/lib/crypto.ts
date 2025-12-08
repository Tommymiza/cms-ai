import crypto from 'crypto'
import invariant from 'tiny-invariant'

invariant(process.env.NEXT_CRYPTO_KEY, 'NEXT_CRYPTO_KEY is not set in environment')
const secretKey = process.env.NEXT_CRYPTO_KEY!
const key: Buffer = crypto.createHash('sha256').update(secretKey).digest()

export const encrypt = async (data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

      let encrypted = cipher.update(data, 'utf-8', 'hex')
      encrypted += cipher.final('hex')

      resolve(`${iv.toString('hex')}:${encrypted}`)
    } catch (error) {
      reject(error)
    }
  })
}

export const decrypt = async (encryptedData: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const [ivHex, encryptedText] = encryptedData.split(':')
      const iv = Buffer.from(ivHex, 'hex')

      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

      let decrypted = decipher.update(encryptedText, 'hex', 'utf-8')
      decrypted += decipher.final('utf-8')

      resolve(decrypted)
    } catch (error) {
      reject(error)
    }
  })
}
