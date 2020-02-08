import { getRepository } from 'typeorm'
import { Request, Response } from 'express'
import { startOfDay, endOfDay } from 'date-fns'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const getCurrentTodos = async (req: Request, res: Response) => {
  const user = req.user as User
  const todoRepository = getRepository(Todo)

  const todoQueryBuilder = todoRepository
    .createQueryBuilder('todo')
    .andWhere('userId = :userId', { userId: user.id })
    .andWhere('(doneAt IS null OR doneAt >= :start)', { start: startOfDay(new Date()) })
    .andWhere('(scheduledAt IS null OR scheduledAt <= :end)', { end: endOfDay(new Date()) })
    .orderBy('-doneAt', 'DESC')
    .addOrderBy('rank', 'ASC')

  const todos = await todoQueryBuilder.getMany()
  res.json({ todos: todos || [] })
}
