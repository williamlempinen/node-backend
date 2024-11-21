import { Response } from 'express'

export enum StatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500
}

const send = (response: Response, status: StatusCode, body: object) => {
  return response.status(status).json(body)
}

export const SuccessResponse = (message: string, response: Response, data: any = null) => {
  return send(response, StatusCode.SUCCESS, {
    status: StatusCode.SUCCESS,
    message,
    data
  })
}

export const BadRequestResponse = (message: string, response: Response) => {
  return send(response, StatusCode.BAD_REQUEST, {
    status: StatusCode.BAD_REQUEST,
    message
  })
}

export const ForbiddenResponse = (message: string, response: Response) => {
  return send(response, StatusCode.FORBIDDEN, {
    status: StatusCode.FORBIDDEN,
    message
  })
}

export const NotFoundResponse = (message: string, response: Response) => {
  return send(response, StatusCode.NOT_FOUND, {
    status: StatusCode.NOT_FOUND,
    message
  })
}

export const InternalErrorResponse = (message: string, response: Response) => {
  return send(response, StatusCode.INTERNAL_ERROR, {
    status: StatusCode.INTERNAL_ERROR,
    message
  })
}

export const AuthFailureResponse = (message: string, response: Response) => {
  return send(response, StatusCode.UNAUTHORIZED, {
    status: StatusCode.UNAUTHORIZED,
    message
  })
}

export const RefreshTokenResponse = (
  message: string,
  response: Response,
  accessToken: string,
  refreshToken: string
) => {
  return send(response, StatusCode.SUCCESS, {
    status: StatusCode.SUCCESS,
    message,
    accessToken,
    refreshToken
  })
}
