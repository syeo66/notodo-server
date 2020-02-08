import { getRepository } from 'typeorm'
import { Request, Response } from 'express'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const getTodos = async (req: Request, res: Response) => {
  const user = req.user as User
  const todoRepository = getRepository(Todo)

  const todoQueryBuilder = todoRepository
    .createQueryBuilder('todo')
    .andWhere('userId = :userId', { userId: user.id })
    .orderBy('doneAt', 'DESC')
    .addOrderBy('rank', 'ASC')

  const todos = await todoQueryBuilder.getMany()
  res.json({ todos: todos || [] })
}
