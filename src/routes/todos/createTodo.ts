import { validationResult } from 'express-validator'
import { getConnection, getRepository } from 'typeorm'
import { Request, Response } from 'express'
import { LexoRank } from 'lexorank'

import { Todo } from '../../entity/Todo'
import { User } from '../../entity/User'

export const createTodo = async (req: Request, res: Response) => {
  const connection = getConnection()
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: 0, errors: errors.array() })
  }

  const user = req.user as User
  const todoRepository = getRepository(Todo)
  const { title } = req.body

  const todoQueryBuilder = todoRepository
    .createQueryBuilder('todo')
    .andWhere('userId = :userId', { userId: user.id })
    .orderBy('rank', 'DESC')

  const lastTodo = await todoQueryBuilder.getOne()

  const lexoRank = !lastTodo ? LexoRank.middle() : LexoRank.parse(lastTodo.rank).genNext()

  const todo = new Todo()
  todo.title = title
  todo.user = user
  todo.rank = lexoRank.toString()
  await connection.manager.save(todo)
  res.json({ success: 1, todo })
}
