import { getRepository } from 'typeorm'
import { Request, Response } from 'express'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const getTodos = async (req: Request, res: Response) => {
  const user = req.user as User
  const todoRepository = getRepository(Todo)
  const todos = await todoRepository.find({ where: { user } })
  res.json({ todos: todos || [] })
}
