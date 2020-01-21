import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { hashSync } from 'bcrypt'

import { User } from '../../entity/User'
import { getConnection } from 'typeorm'

export const register = async (req: Request, res: Response) => {
  const connection = getConnection()
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }
  const { name, password, firstname, lastname, email } = req.body
  const user = new User()

  user.userName = name
  user.firstName = firstname
  user.lastName = lastname
  user.email = email
  user.password = hashSync(password, 10)

  await connection.manager.save(user)

  res.json({ user: { ...user, password: '*****' } })
}
