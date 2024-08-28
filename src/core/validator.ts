import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import Logger from './Logger'

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
      Logger.error(`Error occurred while validating data: ${error}`)
      if (error instanceof ZodError) {
        Logger.error(`Validation error: ${error}`)
        return response.status(400).json({
          message: 'Invalid data provided',
          errors: error.errors.map((e) => e.message)
        })
      } else {
        Logger.error(`Unexpected error during validation: ${error}`)
        return response.status(500).json({ message: 'Internal Server Error' })
      }
    }
  }
}
