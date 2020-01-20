import {MigrationInterface, QueryRunner} from "typeorm";

export class init1579531628659 implements MigrationInterface {
    name = 'init1579531628659'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `userName` varchar(200) NOT NULL, `password` varchar(200) NOT NULL, `firstName` varchar(200) NOT NULL, `lastName` varchar(200) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `user`", undefined);
    }

}
