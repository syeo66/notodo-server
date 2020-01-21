import { getRepository } from 'typeorm'
import { Request, Response } from 'express'
import { startOfDay, endOfDay } from 'date-fns'
import { validationResult } from 'express-validator'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const getTodosByDate = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }
  const user = req.user as User
  const requestDate = new Date(req.params.date)
  const todoRepository = getRepository(Todo)

  const dayRange = { start: startOfDay(requestDate), end: endOfDay(requestDate) }

  const todoQueryBuilder = todoRepository
    .createQueryBuilder('todo')
    .andWhere('userId = :userId', { userId: user.id })
    .andWhere('((doneAt >= :start AND doneAt <= :end) OR (scheduledAt >= :start AND scheduledAt <= :end))')
    .setParameters(dayRange)

  const todos = await todoQueryBuilder.getMany()
  res.json({ todos: todos || [] })
}
