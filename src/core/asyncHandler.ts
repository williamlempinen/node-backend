import { Request, Response, NextFunction } from 'express'

type AsyncFunction = (request: Request, response: Response, next: NextFunction) => Promise<any>

export const asyncHandler = (execution: AsyncFunction) => {
  return (request: Request, response: Response, next: NextFunction) => {
    execution(request, response, next).catch(next)
  }
}
