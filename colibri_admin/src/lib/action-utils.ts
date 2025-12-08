import { ErrorType, ServerActionResult } from '@/types/types'

// Classe d'erreur serveur
export class ServerActionError extends Error {
  code: string
  status: number

  constructor(
    message: string,
    code: string = 'UNKNOWN',
    status: number = 500,
    name: string = 'ServerActionError',
    stack: string = ''
  ) {
    super(message)
    this.name = 'ServerActionError'
    this.code = code
    this.status = status
    this.stack = stack
  }
}

export function createServerAction<Return, Args extends unknown[] = []>(
  callback: (...args: Args) => Promise<Return>
): (...args: Args) => Promise<ServerActionResult<Return>> {
  return async (...args: Args) => {
    try {
      const value = await callback(...args)
      return { success: true, data: value }
    } catch (error) {
      if (error instanceof ServerActionError) {
        const newError = JSON.parse(error.message) as ErrorType
        // console.log('error.message server actions :', newError)
        return {
          success: false,
          error: {
            message: newError.message,
            code: newError.code,
            status: newError.status,
            stack: newError.stack,
            name: newError.name,
          },
        }
      }
      throw error
    }
  }
}
