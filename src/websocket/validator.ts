import { ZodError, ZodSchema } from 'zod'
import Logger from '../core/Logger'

export const validator = (schema: ZodSchema<any>, payload: any) => {
  try {
    Logger.warn(`[validator try]: PAYLOAD: ${JSON.stringify(payload)}`)

    const validatedData = schema.parse(payload)

    return { isValid: true, data: validatedData }
  } catch (error: any) {
    if (error instanceof ZodError) {
      Logger.error('[validator catch, zod]: Invalid data provided in WebSocket validator')
      Logger.error(`[validator catch, zod]: Validation Errors: ${JSON.stringify(error.errors)}`)
      return { isValid: false, error: error.errors }
    }

    Logger.error('[validator catch, !zod]: Unexpected error in WebSocket validator')
    throw error
  }
}
