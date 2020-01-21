import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEmail1579639302917 implements MigrationInterface {
    name = 'AddEmail1579639302917'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `email` varchar(200) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `todo` DROP FOREIGN KEY `FK_1e982e43f63a98ad9918a86035c`", undefined);
        await queryRunner.query("ALTER TABLE `todo` CHANGE `scheduledAt` `scheduledAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `todo` CHANGE `doneAt` `doneAt` datetime NULL", undefined);
        await queryRunner.query("ALTER TABLE `todo` CHANGE `userId` `userId` varchar(36) NULL", undefined);
        await queryRunner.query("ALTER TABLE `todo` ADD CONSTRAINT `FK_1e982e43f63a98ad9918a86035c` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `todo` DROP FOREIGN KEY `FK_1e982e43f63a98ad9918a86035c`", undefined);
        await queryRunner.query("ALTER TABLE `todo` CHANGE `userId` `userId` varchar(36) NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `todo` CHANGE `doneAt` `doneAt` datetime NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `todo` CHANGE `scheduledAt` `scheduledAt` datetime NULL DEFAULT 'NULL'", undefined);
        await queryRunner.query("ALTER TABLE `todo` ADD CONSTRAINT `FK_1e982e43f63a98ad9918a86035c` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `email`", undefined);
    }

}
