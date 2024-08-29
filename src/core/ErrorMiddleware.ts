import { Request, Response, NextFunction } from 'express'
import Logger from './Logger'
import { HandleError, ErrorType } from './errors'

const ErrorMiddleware = (error: any, request: Request, response: Response, next: NextFunction) => {
  Logger.error(`Error occurred: ${error.message || error}, error middleware`)

  if (error.type && Object.values(ErrorType).includes(error.type)) {
    return HandleError(error.type, error.message || 'An error occurred', response)
  }

  return HandleError(ErrorType.INTERNAL, 'An unexpected error occurred (super general)', response)
}

export default ErrorMiddleware
