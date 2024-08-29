import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { UserDTO } from '../database/models/UserDTOs'
import Logger from '../core/Logger'

export const createJwtToken = (user: UserDTO, expiresIn: string = '1h'): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn }
  )
}

export const verifyJwtToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error: any) {
    Logger.error(`Error verifing token: ${error}`)
    return 'impl later'
  }
}
