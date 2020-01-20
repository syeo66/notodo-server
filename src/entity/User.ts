import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', { length: 200 })
  userName!: string

  @Column('varchar', { length: 200 })
  password!: string

  @Column('varchar', { length: 200 })
  firstName!: string

  @Column('varchar', { length: 200 })
  lastName!: string
}
