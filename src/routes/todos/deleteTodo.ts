import { validationResult } from 'express-validator'
import { getRepository } from 'typeorm'

import { Todo } from '../../entity/Todo'

export const deleteTodo = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }
  const todoRepository = getRepository(Todo)
  await todoRepository.delete(req.params.id)
  res.json({ success: 1, todo: { id: req.params.id } })
}
