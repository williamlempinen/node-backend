import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { BadRequestResponse, InternalErrorResponse } from './responses'

export enum ValidationSource {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params'
}

export const validator = (schema: ZodSchema<any>, source: ValidationSource = ValidationSource.BODY) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      schema.parse(request[source])
      next()
    } catch (error: any) {
      if (error instanceof ZodError) {
        return BadRequestResponse('Invalid data provided', response)
      }

      return InternalErrorResponse('Internal server error', response)
    }
  }
}
