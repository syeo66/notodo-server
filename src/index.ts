// Needed for typeorm
import 'reflect-metadata'

import * as express from 'express'
import * as bodyParser from 'body-parser'

import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'

import * as cors from 'cors'

import { check } from 'express-validator'

import { createConnection, getRepository } from 'typeorm'

import { login } from './routes/auth'
import { User } from './entity/User'
import { createTodo, getTodos, getTodo, deleteTodo, updateTodo, getCurrentTodos } from './routes/todos'

createConnection().then(connection => {
  const app = express()

  const ExtractJwt = passportJWT.ExtractJwt
  const JwtStrategy = passportJWT.Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '5952FC21-FB3A-481E-9085-5279B54E0644',
  }

  const strategy = new JwtStrategy(jwtOptions, async (jwtPayload, next) => {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne(jwtPayload.id)
    next(null, { ...user, password: '*****' })
  })
  passport.use(strategy)

  app.use(passport.initialize())
  app.use(cors())

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/', (req, res) => {
    res.json({ message: 'NoToDo' })
  })

  app.get('/todos', passport.authenticate('jwt', { session: false }), getTodos)
  app.get('/todos/current', passport.authenticate('jwt', { session: false }), getCurrentTodos)
  app.post('/todo', [passport.authenticate('jwt', { session: false }), check('title').notEmpty()], createTodo)
  app.get(
    '/todo/:id',
    [
      passport.authenticate('jwt', { session: false }),
      check('id')
        .notEmpty()
        .isUUID(),
    ],
    getTodo
  )
  app.delete(
    '/todo/:id',
    [
      passport.authenticate('jwt', { session: false }),
      check('id')
        .notEmpty()
        .isUUID(),
    ],
    deleteTodo
  )
  app.put(
    '/todo/:id',
    [
      passport.authenticate('jwt', { session: false }),
      check('id')
        .notEmpty()
        .isUUID(),
      check('doneAt')
        .optional({ nullable: true })
        .isISO8601()
        .toDate(),
      check('scheduledAt')
        .optional({ nullable: true })
        .isISO8601()
        .toDate(),
    ],
    updateTodo
  )

  app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    const user = req.user as User
    res.json({ user })
  })

  app.post('/login', login(jwtOptions))

  const PORT = process.env.port || 3000

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
})
