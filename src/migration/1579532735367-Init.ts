import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1579532735367 implements MigrationInterface {
  name = 'Init1579532735367'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `user` (`id` varchar(36) NOT NULL, `userName` varchar(200) NOT NULL, `password` varchar(200) NOT NULL, `firstName` varchar(200) NOT NULL, `lastName` varchar(200) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `user`', undefined)
  }
}