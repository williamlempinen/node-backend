import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { BadRequestResponse } from './responses'
import Logger from './Logger'

export enum ValidationSource {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
  HEADERS = 'headers'
}

export const validator = (schema: ZodSchema<any>, source: ValidationSource = ValidationSource.BODY) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      Logger.warn(`[validator try]`)
      schema.parse(request[source])
      next()
    } catch (error: any) {
      if (error instanceof ZodError) {
        Logger.error('[validator catch, zod]: Invalid data provided in validator')
        Logger.error(`[validator catch, zod]: Request in validator: ${JSON.stringify(request[source])}`)
        return BadRequestResponse('Invalid data provided', response)
      }
      Logger.error('[validator catch, !zod]: Error in validator')
      return next(error)
    }
  }
}
