import { sign } from 'jsonwebtoken'
import { fromUnixTime } from 'date-fns'

export const createToken = ({ user, jwtOptions }: { user: { id: string }; jwtOptions: { secretOrKey: string } }) => {
  // TODO: get iss from .env
  const payload = { sub: user.id, iss: 'tonotodo.com', id: user.id }

  const tokenExpiresIn = 15 * 60
  const token = sign({ ...payload, aud: 'access' }, jwtOptions.secretOrKey, { expiresIn: tokenExpiresIn })
  const refreshTokenExpiresIn = 30 * 24 * 60 * 60
  const refreshToken = sign({ ...payload, aud: 'refresh' }, jwtOptions.secretOrKey, {
    expiresIn: refreshTokenExpiresIn,
  })

  return {
    refreshToken,
    refreshTokenExpiry: fromUnixTime(Math.floor(Date.now() / 1000) + refreshTokenExpiresIn),
    token,
    tokenExpiry: fromUnixTime(Math.floor(Date.now() / 1000) + tokenExpiresIn),
  }
}
