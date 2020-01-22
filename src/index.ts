// Needed for typeorm
import 'reflect-metadata'

import * as express from 'express'
import * as bodyParser from 'body-parser'

import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'

import * as cors from 'cors'
import * as compression from 'compression'
import * as helmet from 'helmet'

import * as expressGraphQL from 'express-graphql'

import { IncomingMessage } from 'http'

import { check } from 'express-validator'

import { createConnection, getRepository } from 'typeorm'

import { login, register } from './routes/auth'
import { User } from './entity/User'
import { createTodo, getTodos, getTodo, deleteTodo, updateTodo, getCurrentTodos, getTodosByDate } from './routes/todos'

import resolvers from './resolvers'
import schema from './schema'

const context = (req: IncomingMessage) => {
  const { authorization: token } = req.headers
  return { token }
}

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
  app.use(compression())
  app.use(helmet())

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(
    '/graphql',
    expressGraphQL(req => ({
      schema,
      graphiql: true,
      rootValue: resolvers,
      context: () => context(req),
    }))
  )

  app.get('/', (req, res) => {
    res.json({ message: 'NoToDo' })
  })

  app.get('/todos/current', passport.authenticate('jwt', { session: false }), getCurrentTodos)
  app.get(
    '/todos/:date',
    [
      passport.authenticate('jwt', { session: false }),
      check('date')
        .isISO8601()
        .toDate(),
    ],
    getTodosByDate
  )
  app.get('/todos', passport.authenticate('jwt', { session: false }), getTodos)

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
  app.post(
    '/register',
    [
      check('name')
        .notEmpty()
        .isAlphanumeric()
        .isLength({ min: 5, max: 200 }),
      check('password')
        .notEmpty()
        .isLength({ min: 6 }),
      check('email')
        .notEmpty()
        .isEmail()
        .isLength({ max: 200 }),
      check('firstname')
        .notEmpty()
        .isAlpha()
        .isLength({ max: 200 }),
      check('lastname')
        .notEmpty()
        .isAlpha()
        .isLength({ max: 200 }),
    ],
    register
  )

  const PORT = process.env.port || 3000

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
})
