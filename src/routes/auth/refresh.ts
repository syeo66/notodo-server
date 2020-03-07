import { Response, Request } from 'express'
import { verify } from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import { User } from '../../entity/User'
import { createToken } from './token'

export const refresh = (jwtOptions: { secretOrKey: string }) => (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }

  const payload: string | { id?: string; aud?: 'access' | 'refresh' } = verify(
    req.body.refreshToken,
    jwtOptions.secretOrKey
  )

  if (typeof payload === 'string') {
    return res.status(422).json({ success: 0 })
  }

  if (payload.aud !== 'refresh') {
    return res.status(422).json({ success: 0, errors: ['This is not a refresh token'] })
  }

  const user = req.user as User
  if (!user || user.id !== (payload as { id: string }).id) {
    return res.status(422).json({ success: 0 })
  }

  const tokenData = createToken({ user, jwtOptions })

  res.json({
    message: 'ok',
    ...tokenData,
  })
}
