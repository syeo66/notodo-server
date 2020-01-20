import { Response, Request } from 'express'
import { sign } from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import * as bcrypt from 'bcrypt'

import { User } from '../../entity/User'

export const login = (jwtOptions: { secretOrKey: string }) => async (req: Request, res: Response) => {
  const userRepository = getRepository(User)
  const { name, password } = req.body

  if (name && password) {
    const user = await userRepository.findOne({ where: { userName: name } })
    if (!user) {
      res.status(401).json({ message: 'No such user found' })
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      // from now on we'll identify the user by the id and the id is the
      // only personalized value that goes into our token
      let payload = { id: user.id }
      let token = sign(payload, jwtOptions.secretOrKey)
      res.json({ message: 'ok', token: token })
    } else {
      res.status(401).json({ message: 'Credentials are incorrect' })
    }
    return
  }
  res.status(400).json({ message: 'wrong parameters' })
}
