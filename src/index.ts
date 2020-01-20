// Needed for typeorm
import 'reflect-metadata'

import * as express from 'express'
import * as bodyParser from 'body-parser'

import * as passport from 'passport'
import * as passportJWT from 'passport-jwt'

import { check, validationResult } from 'express-validator'

import { createConnection, getRepository } from 'typeorm'

import { login } from './routes/auth'
import { User } from './entity/User'
import { Todo } from './entity/Todo'

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

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/', (req, res) => {
    res.json({ message: 'NoToDo' })
  })

  app.get('/todos', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user as User
    const todoRepository = getRepository(Todo)
    const todos = await todoRepository.find({ where: { user } })
    res.json({ todos: todos || [] })
  })

  app.post(
    '/todo',
    [passport.authenticate('jwt', { session: false }), check('title').isAlphanumeric()],
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: 0, errors: errors.array() })
      }

      const user = req.user as User
      const { title } = req.body
      const todo = new Todo()
      todo.title = title
      todo.user = user
      await connection.manager.save(todo)
      res.json({ success: 1, todo })
    }
  )

  app.get('/todo/:id', [passport.authenticate('jwt', { session: false }), check('id').isUUID()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: 0, errors: errors.array() })
    }
    const todoRepository = getRepository(Todo)
    const todo = await todoRepository.findOne(req.params.id)
    res.json({ success: !todo ? 0 : 1, todo: todo || null })
  })

  app.delete(
    '/todo/:id',
    [passport.authenticate('jwt', { session: false }), check('id').isUUID()],
    async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: 0, errors: errors.array() })
      }
      const todoRepository = getRepository(Todo)
      await todoRepository.delete(req.params.id)
      res.json({ success: 1, todo: { id: req.params.id } })
    }
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
