import { Request, Response, NextFunction, RequestHandler } from 'express'

type AsyncFunction = (request: Request, response: Response, next: NextFunction) => Promise<any>

export const asyncHandler = (execution: AsyncFunction): RequestHandler => {
  return (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(execution(request, response, next)).catch(next)
  }
}
