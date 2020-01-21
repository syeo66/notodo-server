import { validationResult } from 'express-validator'
import { getRepository } from 'typeorm'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const deleteTodo = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }
  const user = req.user as User
  const todoRepository = getRepository(Todo)
  await todoRepository.delete({ id: req.params.id, user })
  res.json({ success: 1, todo: { id: req.params.id } })
}
