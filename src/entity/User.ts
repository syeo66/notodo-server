import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import { Todo } from './Todo'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @CreateDateColumn()
  createdAt!: Date

  @Column('varchar', { length: 200 })
  userName!: string

  @Column('varchar', { length: 200 })
  password!: string

  @Column('varchar', { length: 200 })
  firstName!: string

  @Column('varchar', { length: 200 })
  lastName!: string

  @Column('varchar', { length: 200 })
  email!: string

  @OneToMany(
    type => Todo,
    todo => todo.user
  )
  todos!: Promise<Todo[]>
}
