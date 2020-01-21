import { validationResult } from 'express-validator'
import { getRepository } from 'typeorm'
import { Request, Response } from 'express'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const getTodo = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }
  const user = req.user as User
  const todoRepository = getRepository(Todo)
  const todo = await todoRepository.findOne({ where: { id: req.params.id, user } })
  res.json({ success: !todo ? 0 : 1, todo: todo || null })
}
