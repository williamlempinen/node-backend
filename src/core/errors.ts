import { Response } from 'express'
import {
  AuthFailureResponse,
  BadRequestResponse,
  ForbiddenResponse,
  InternalErrorResponse,
  NotFoundResponse
} from './responses'

export enum ErrorType {
  FORBIDDEN = 'ForbiddenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  BAD_REQUEST = 'BadRequestError'
}

export const handleError = (errorType: ErrorType, message: string, response: Response) => {
  switch (errorType) {
    case ErrorType.FORBIDDEN:
      return ForbiddenResponse(message, response)
    case ErrorType.TOKEN_EXPIRED:
    case ErrorType.UNAUTHORIZED:
      return AuthFailureResponse(message, response)
    case ErrorType.INTERNAL:
      return InternalErrorResponse(message, response)
    case ErrorType.NOT_FOUND:
      return NotFoundResponse(message, response)
    case ErrorType.BAD_REQUEST:
      return BadRequestResponse(message, response)
    default:
      return InternalErrorResponse('Unexpected error occurred', response)
  }
}
