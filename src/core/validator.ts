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
      schema.parse(request[source])
      Logger.warn('Validator gets it in try')
      next()
    } catch (error: any) {
      if (error instanceof ZodError) {
        Logger.error('Invalid data provided in validator')
        Logger.error(`Request: ${JSON.stringify(request[source])}`)
        return BadRequestResponse('Invalid data provided', response)
      }
      Logger.error('Error in validator, not ZodError')
      return next(error)
    }
  }
}
