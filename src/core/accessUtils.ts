import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { createJwtToken } from '../auth/JWT'
import RefreshTokenRepo from '../database/repository/RefreshTokenRepo'
import { UserDTO } from '../database/models/UserDTOs'

type Tokens = {
  accessToken: string
  refreshToken: string
}

export const hashPassword = (password: string): string => {
  const rounds = 10
  const s = bcrypt.genSaltSync(rounds)
  return bcrypt.hashSync(password, s)
}

export const checkPasswordHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}

export const createTokens = async (userDTO: UserDTO): Promise<Tokens> => {
  const accessToken = createJwtToken(userDTO, '1h')

  const refreshToken = crypto.randomBytes(64).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  await RefreshTokenRepo.create({
    user: { connect: { id: userDTO.id } },
    token_hash: refreshToken,
    expires_at: expiresAt
  })

  return { accessToken, refreshToken }
}
