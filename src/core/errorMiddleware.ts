import { Request, Response, NextFunction } from 'express'
import Logger from './Logger'
import { handleError, ErrorType } from './errors'

const errorMiddleware = (error: any, request: Request, response: Response, next: NextFunction) => {
  Logger.error(`Error occurred: ${error.message || error}, error middleware start`)

  if (error.type && Object.values(ErrorType).includes(error.type)) {
    Logger.error('Error type found in error middleware')
    return handleError(error.type, error.message || 'An error occurred', response)
  }

  return handleError(ErrorType.INTERNAL, 'An unexpected error occurred (super general)', response)
}

export default errorMiddleware
