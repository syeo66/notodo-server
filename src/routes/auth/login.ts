import { Response, Request } from 'express'
import { sign } from 'jsonwebtoken'

export const login = (jwtOptions: { secretOrKey: string }) => (req: Request, res: Response) => {
  const { name, password } = req.body
  if (name && password) {
    const user = { id: 1, userName: 'red', password: 'test' }
    if (!user) {
      res.status(401).json({ message: 'No such user found' })
    }
    if (user.password === password) {
      // from now on we'll identify the user by the id and the id is the
      // only personalized value that goes into our token
      let payload = { id: user.id }
      let token = sign(payload, jwtOptions.secretOrKey)
      res.json({ message: 'ok', token: token })
    } else {
      res.status(401).json({ message: 'Password is incorrect' })
    }
    return
  }
  res.status(400).json({ message: 'wrong parameters' })
}
