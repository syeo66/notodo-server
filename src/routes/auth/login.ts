import { Response, Request } from 'express'
import { getRepository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from '../../entity/User'
import { createToken } from './token'

export const login = (jwtOptions: { secretOrKey: string }) => async (req: Request, res: Response) => {
  const userRepository = getRepository(User)
  const { name, password } = req.body

  if (name && password) {
    const user = await userRepository.findOne({ where: { userName: name } })
    if (!user) {
      res.status(401).json({ message: 'No such user found' })
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      const tokenData = createToken({ user, jwtOptions })
      res.json({
        message: 'ok',
        ...tokenData,
      })
    } else {
      res.status(401).json({ message: 'Credentials are incorrect' })
    }
    return
  }
  res.status(400).json({ message: 'wrong parameters' })
}
