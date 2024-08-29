import bcrypt from 'bcrypt'

export const hashPassword = (password: string): string => {
  const rounds = 10
  const s = bcrypt.genSaltSync(rounds)
  return bcrypt.hashSync(password, s)
}
