import { validationResult } from 'express-validator'
import { getConnection } from 'typeorm'
import { Request, Response } from 'express'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const createTodo = async (req: Request, res: Response) => {
  const connection = getConnection()
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
