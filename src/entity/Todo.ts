import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm'

import { User } from './User'

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @CreateDateColumn()
  createdAt!: Date

  @Column('datetime', { nullable: true })
  scheduledAt!: Date

  @Column('datetime', { nullable: true })
  doneAt!: Date

  @Column('varchar', { length: 200 })
  title!: string

  @ManyToOne(
    type => User,
    user => user.todos
  )
  user!: User
}
