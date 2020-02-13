import { validationResult } from 'express-validator'
import { getRepository } from 'typeorm'
import { Request, Response } from 'express'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const updateTodo = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }
  const user = req.user as User
  const todoRepository = getRepository(Todo)
  const todo = await todoRepository.findOne({ where: { id: req.params.id, user } })
  if (!todo) {
    return res.status(422).json({ success: 0, errors: ['Todo not found'] })
  }

  if ('title' in req.body) {
    todo.title = req.body.title
  }
  if ('doneAt' in req.body) {
    todo.doneAt = req.body.doneAt
  }
  if ('scheduledAt' in req.body) {
    todo.scheduledAt = req.body.scheduledAt
  }

  todoRepository.save(todo)
  res.json({ success: 1, todo: todo || null })
}
