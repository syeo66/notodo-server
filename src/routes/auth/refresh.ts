import { Response, Request } from 'express'
import { verify } from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import { User } from '../../entity/User'
import { createToken } from './token'

export const refresh = (jwtOptions: { secretOrKey: string }) => (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() })
  }

  const accessToken = req.headers.authorization || ''
  let id: string | undefined
  try {
    const accessPayload: string | { id?: string; aud?: 'access' | 'refresh' } = verify(
      accessToken.split(' ')[1],
      jwtOptions.secretOrKey,
      { audience: 'access', ignoreExpiration: true }
    )
    id = typeof accessPayload === 'string' ? accessPayload : accessPayload.id
  } catch (e) {
    return res.status(422).json({ success: false, errors: ['Access token is not valid'] })
  }

  const payload: string | { id?: string; aud?: 'access' | 'refresh' } = verify(
    req.cookies.refresh_token,
    jwtOptions.secretOrKey,
    { audience: 'refresh' }
  )

  if (typeof payload === 'string') {
    return res.status(422).json({ success: false })
  }

  if (payload.aud !== 'refresh') {
    return res.status(422).json({ success: false, errors: ['This is not a refresh token'] })
  }

  if (id !== (payload as { id: string }).id) {
    return res.status(422).json({ success: false })
  }

  const tokenData = createToken({ user: { id }, jwtOptions })
  res.cookie('refresh_token', tokenData.refreshToken, {
    httpOnly: true,
    secure: (process.env.NODE_ENV || 'development') !== 'development',
  })
  res.json({
    success: true,
    message: 'ok',
    token: tokenData.token,
    tokenExpiry: tokenData.tokenExpiry,
  })
}
