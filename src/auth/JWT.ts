import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'
import { UserDTO } from '../database/models/UserDTO'
import Logger from '../core/Logger'

type DecodedToken = {
  id: number
  email: string
  role: string
} & JwtPayload

export const createJwtToken = (user: UserDTO, expiresIn: string = '1h'): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn }
  )
}

export const verifyJwtToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken
    return decoded
  } catch (error: any) {
    Logger.error(`[JWT util, verifyToken]: Error verifing token: ${error}`)
    return null
  }
}
