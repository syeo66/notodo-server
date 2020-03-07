import { Response, Request } from 'express'
import { verify, sign } from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { fromUnixTime } from 'date-fns'

import { User } from '../../entity/User'

export const refresh = (jwtOptions: { secretOrKey: string }) => (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }

  const payload = verify(req.body.refreshToken, jwtOptions.secretOrKey)

  if (typeof payload === 'string') {
    return res.status(422).json({ success: 0 })
  }

  const user = req.user as User
  const newPayload = { id: (payload as { id: string }).id }

  if (!user || user.id !== newPayload.id) {
    return res.status(422).json({ success: 0 })
  }

  const tokenExpiresIn = 60 * 60
  const token = sign(newPayload, jwtOptions.secretOrKey, { expiresIn: tokenExpiresIn })
  const refreshTokenExpiresIn = 24 * 60 * 60
  const refreshToken = sign(newPayload, jwtOptions.secretOrKey, { expiresIn: refreshTokenExpiresIn })

  res.json({
    message: 'ok',
    token,
    tokenExpiry: fromUnixTime(Math.floor(Date.now() / 1000) + tokenExpiresIn),
    refreshToken,
    refreshTokenExpiry: fromUnixTime(Math.floor(Date.now() / 1000) + refreshTokenExpiresIn),
  })
}
