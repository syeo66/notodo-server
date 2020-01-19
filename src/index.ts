// Needed for typeorm
import 'reflect-metadata'

import * as express from 'express'
import * as bodyParser from 'body-parser'

import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'

import { login } from './routes/auth'

const app = express()

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: '5952FC21-FB3A-481E-9085-5279B54E0644',
}

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  console.log('payload received', jwtPayload)
  next(null, { id: 1, userName: 'red' })
})
passport.use(strategy)

app.use(passport.initialize())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: 'Hello world' })
})

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  const user = req.user as { userName: string }
  res.json({ message: user && user.userName ? `hello ${user.userName}` : 'hello anonymous' })
})

app.post('/login', login(jwtOptions))

const PORT = process.env.port || 3000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
