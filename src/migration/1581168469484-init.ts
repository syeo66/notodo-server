import {MigrationInterface, QueryRunner} from "typeorm";

export class init1581168469484 implements MigrationInterface {
    name = 'init1581168469484'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userName` varchar(200) NOT NULL, `password` varchar(200) NOT NULL, `firstName` varchar(200) NOT NULL, `lastName` varchar(200) NOT NULL, `email` varchar(200) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `todo` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `scheduledAt` datetime NULL, `doneAt` datetime NULL, `title` varchar(200) NOT NULL, `rank` varchar(255) NOT NULL, `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `todo` ADD CONSTRAINT `FK_1e982e43f63a98ad9918a86035c` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `todo` DROP FOREIGN KEY `FK_1e982e43f63a98ad9918a86035c`", undefined);
        await queryRunner.query("DROP TABLE `todo`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
    }

}
